import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RequestsModule } from './requests/request.module';
import { NotificationsModule } from './notifications/notifications.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ExampleController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // ConfigModule para variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigService esté disponible en toda la app
      envFilePath: '.env',
    }),
    
    // Módulos de la aplicación
    PrismaModule,
    AuthModule,
    RequestsModule,
    NotificationsModule,
  ],
  controllers: [ExampleController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Guard global JWT para todas las rutas
    },
  ],
})
export class AppModule {}