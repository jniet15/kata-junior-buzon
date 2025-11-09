import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CurrentUser } from './auth/current-user.decorator';
import { Public } from './auth/auth.controller';

@Controller('example')
export class ExampleController {
  
  @Get('public')
  @Public() // Ruta pública - no requiere autenticación
  getPublic() {
    return { message: 'Esta ruta es pública' };
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard) // Ruta protegida
  getProtected(@CurrentUser() user: any) {
    return { 
      message: 'Esta ruta es protegida', 
      user 
    };
  }

  @Get('profile')
  getProfile(@CurrentUser('userId') userId: string) {
    // Acceder a una propiedad específica del usuario
    return { userId };
  }
}