import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Para acceder a las variables de entorno
  ],
  providers: [NotificationsService],
  exports: [NotificationsService], // Exportamos para que otros módulos puedan usarlo
})
export class NotificationsModule {}