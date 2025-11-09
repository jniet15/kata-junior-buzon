import { Test } from '@nestjs/testing';
import { NotificationsService } from '../src/notifications/notifications.service';
import { ConfigModule } from '@nestjs/config';

async function testNotifications() {
  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: '.env',
      }),
    ],
    providers: [NotificationsService],
  }).compile();

  const notificationsService = moduleRef.get<NotificationsService>(NotificationsService);

  // Datos de prueba
  const mockRequest = {
    id: 'test-123',
    title: 'Solicitud de prueba',
    description: 'Esta es una solicitud de prueba para notificaciones',
    type: 'VACATION',
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: {
      name: 'Usuario Solicitante',
      email: 'solicitante@example.com',
    },
    assignedTo: {
      name: 'Usuario Aprobador',
      email: 'aprobador@example.com', // Cambia por un email real para prueba
    },
    history: [
      {
        comments: 'Comentarios de prueba sobre la solicitud',
        createdAt: new Date(),
      },
    ],
  };

  console.log('🔔 Probando notificación de nueva solicitud...');
  
  try {
    // Probar notificación de nueva solicitud
    await notificationsService.notifyNewRequest(mockRequest);
    console.log('✅ Notificación de nueva solicitud enviada correctamente');
    
    // Probar notificación de cambio de estado
    console.log('🔔 Probando notificación de cambio de estado...');
    mockRequest.status = 'APPROVED';
    await notificationsService.notifyStatusUpdate(mockRequest);
    console.log('✅ Notificación de cambio de estado enviada correctamente');
    
  } catch (error) {
    console.error('❌ Error en las notificaciones:', error);
  }
}

testNotifications();