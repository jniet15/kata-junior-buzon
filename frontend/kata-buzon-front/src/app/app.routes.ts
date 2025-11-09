import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CreateRequestComponent } from './components/create-request/create-request';
import { authGuard } from './guards/auth';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'create-request', 
    component: CreateRequestComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];