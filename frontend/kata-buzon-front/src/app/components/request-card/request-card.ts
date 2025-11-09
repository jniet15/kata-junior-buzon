import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Request, RequestStatus } from '../../models/request.model';

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './request-card.html',
  styleUrls: ['./request-card.css']
})
export class RequestCardComponent {
  @Input() request!: Request;
  @Input() showActions: boolean = false;
  @Output() statusUpdate = new EventEmitter<{id: string, status: RequestStatus, comments?: string}>();

  showComments = false;
  showHistory = false;
  comments = '';

  readonly RequestStatus = RequestStatus;

  onApprove() {
    this.statusUpdate.emit({
      id: this.request.id,
      status: RequestStatus.APPROVED,
      comments: this.comments || undefined
    });
    this.resetComments();
  }

  onReject() {
    this.statusUpdate.emit({
      id: this.request.id,
      status: RequestStatus.REJECTED,
      comments: this.comments || undefined
    });
    this.resetComments();
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  private resetComments() {
    this.comments = '';
    this.showComments = false;
  }
  
toggleHistory() {
    this.showHistory = !this.showHistory;
  }
getTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    'DEPLOYMENT': 'Despliegue',
    'ACCESS': 'Acceso',
    'TECHNICAL_CHANGE': 'Cambio técnico',
    'OTHER': 'Otro'
  };
  return labels[type] || type;
}
getStatusLabel(type: string): string {
  const labels: { [key: string]: string } = {
    'PENDING': 'PENDIENTE',
    'APPROVED': 'APROBADO',
    'REJECTED': 'RECHAZADO',
  };
  return labels[type] || type;
}

}