import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al iniciar sesión';
      }
    });
  }

  quickLogin(role: string) {
    switch (role) {
      case 'solicitante':
        this.loginData.email = 'solicitante@example.com';
        this.loginData.password = 'password123';
        break;
      case 'aprobador':
        this.loginData.email = 'aprobador@example.com';
        this.loginData.password = 'password123';
        break;
      case 'admin':
        this.loginData.email = 'admin@example.com';
        this.loginData.password = 'password123';
        break;
    }
  }
}