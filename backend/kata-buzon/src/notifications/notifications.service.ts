import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailConfig = {
      host: this.configService.get('EMAIL_HOST') || 'smtp.ethereal.email',
      port: this.configService.get('EMAIL_PORT') || 587,
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    };

    this.transporter = nodemailer.createTransport(emailConfig);

    // Verificar la configuración del transporter
    this.verifyTransporter();
  }

  private async verifyTransporter() {
    try {
      await this.transporter.verify();
      this.logger.log('Email transporter configured successfully');
    } catch (error) {
      this.logger.error('Error configuring email transporter:', error);
    }
  }

  async notifyNewRequest(request: any) {
    const mailOptions = {
      from: `"Sistema de Aprobaciones" <${this.configService.get('EMAIL_FROM') || 'notifications@example.com'}>`,
      to: request.assignedTo.email,
      subject: `📋 Nueva solicitud de aprobación: ${request.title}`,
      html: this.getNewRequestEmailTemplate(request),
    };

    return this.sendEmail(mailOptions, 'new-request');
  }

  async notifyStatusUpdate(request: any) {
    const mailOptions = {
      from: `"Sistema de Aprobaciones" <${this.configService.get('EMAIL_FROM') || 'notifications@example.com'}>`,
      to: request.createdBy.email,
      subject: `🔄 Actualización de tu solicitud: ${request.title}`,
      html: this.getStatusUpdateEmailTemplate(request),
    };

    return this.sendEmail(mailOptions, 'status-update');
  }

  private async sendEmail(mailOptions: any, type: string) {
    try {
      // En producción, enviaríamos el email real
      if (this.configService.get('NODE_ENV') === 'production') {
        const info = await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email sent successfully (${type}): ${info.messageId}`);
        return info;
      } else {
        // En desarrollo, simulamos el envío y mostramos el preview
        this.logger.log(`[DEV] Email simulation (${type}):`);
        this.logger.log(`To: ${mailOptions.to}`);
        this.logger.log(`Subject: ${mailOptions.subject}`);
        
        // Para desarrollo, puedes obtener la URL de preview de Ethereal
        const testAccount = await nodemailer.createTestAccount();
        if (this.configService.get('EMAIL_USER') === testAccount.user) {
          const previewUrl = nodemailer.getTestMessageUrl({} as any);
          this.logger.log(`Preview URL: ${previewUrl}`);
        }
        
        return { message: 'Email simulated in development' };
      }
    } catch (error) {
      this.logger.error(`Error sending email (${type}):`, error);
      throw error;
    }
  }

  private getNewRequestEmailTemplate(request: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 5px; }
          .content { background: white; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .button { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📋 Tienes una nueva solicitud pendiente</h2>
          </div>
          <div class="content">
            <p><strong>Título:</strong> ${request.title}</p>
            <p><strong>Descripción:</strong> ${request.description}</p>
            <p><strong>Tipo:</strong> ${request.type}</p>
            <p><strong>Solicitante:</strong> ${request.createdBy.name}</p>
            <p><strong>Fecha de creación:</strong> ${new Date(request.createdAt).toLocaleDateString()}</p>
            
            <p style="margin-top: 30px;">
              <a href="${this.configService.get('http://localhost:4200') || 'http://localhost:4200'}/dashboard" class="button">
                Revisar Solicitud
              </a>
            </p>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getStatusUpdateEmailTemplate(request: any): string {
    const statusText = request.status === 'APPROVED' ? 'aprobada' : 'rechazada';
    const statusEmoji = request.status === 'APPROVED' ? '✅' : '❌';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 5px; }
          .content { background: white; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          .status-approved { color: #28a745; }
          .status-rejected { color: #dc3545; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${statusEmoji} Tu solicitud ha sido ${statusText}</h2>
          </div>
          <div class="content">
            <p><strong>Título:</strong> ${request.title}</p>
            <p><strong>Estado:</strong> <span class="status-${request.status.toLowerCase()}">${request.status}</span></p>
            <p><strong>Aprobador:</strong> ${request.assignedTo.name}</p>
            ${request.history[0]?.comments ? `
              <p><strong>Comentarios:</strong> ${request.history[0].comments}</p>
            ` : ''}
            <p><strong>Fecha de actualización:</strong> ${new Date(request.updatedAt).toLocaleDateString()}</p>
            
            <p style="margin-top: 30px;">
              <a href="${this.configService.get('APP_URL') || 'http://localhost:3000'}/dashboard" style="color: #007bff;">
                Ver detalles en la plataforma
              </a>
            </p>
          </div>
          <div class="footer">
            <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Método adicional para notificaciones internas (log)
  logNotification(message: string, metadata?: any) {
    this.logger.log(`Notification: ${message}`, metadata);
  }
}