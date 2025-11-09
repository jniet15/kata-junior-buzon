import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';
import { RequestType } from '../../models/request.model';

interface User {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-request.html',
  styleUrls: ['./create-request.css']
})
export class CreateRequestComponent implements OnInit {
  requestData = {
    title: '',
    description: '',
    type: '' as RequestType,
    assignedToId: ''
  };

  users: User[] = [];
  isLoading = false;
  isSubmitting = false;
  requestTypes = [
    { value: 'DEPLOYMENT', label: 'Despliegue' },
    { value: 'ACCESS', label: 'Acceso' },
    { value: 'TECHNICAL_CHANGE', label: 'Cambio tenico' },
    { value: 'OTHER', label: 'Otro' }
  ];

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.requestService.getUsersForAssignment().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (!this.requestData.title || !this.requestData.description || !this.requestData.type || !this.requestData.assignedToId) {
      return;
    }

    this.isSubmitting = true;
    this.requestService.createRequest(this.requestData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error creating request:', error);
        this.isSubmitting = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}