import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Verificar si estamos en el navegador
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Cargar usuario solo en el navegador
    if (this.isBrowser) {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('current_user');
      if (token && user) {
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  login(loginData: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          this.setSession(response);
        })
      );
  }

  register(registerData: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  private setSession(authResult: AuthResponse) {
    if (this.isBrowser) {
      localStorage.setItem('access_token', authResult.access_token);
      localStorage.setItem('current_user', JSON.stringify(authResult.user));
    }
    this.currentUserSubject.next(authResult.user);
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('current_user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}