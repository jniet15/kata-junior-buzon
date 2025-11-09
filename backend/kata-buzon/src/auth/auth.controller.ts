import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SetMetadata } from '@nestjs/common';

// Decorador para rutas públicas
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() loginData: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginData.email, loginData.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @Public()
  async register(@Body() registerData: { 
    email: string; 
    password: string; 
    name: string; 
  }) {
    return this.authService.register(registerData);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  refreshToken(@Request() req) {
    // En una implementación real, podrías verificar el refresh token aquí
    return this.authService.login(req.user);
  }
}