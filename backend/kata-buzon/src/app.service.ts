import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bienvenido a la Plataforma de Aprobaciones API!';
  }

  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'approval-platform-api',
      version: '1.0.0',
    };
  }

  getApiInfo(): object {
    return {
      name: 'Plataforma de Aprobaciones API',
      description: 'Sistema de gestión de solicitudes de aprobación',
      version: '1.0.0',
      endpoints: {
        auth: '/auth',
        requests: '/requests',
        users: '/users',
      },
      documentation: '/api/docs', 
    };
  }
}