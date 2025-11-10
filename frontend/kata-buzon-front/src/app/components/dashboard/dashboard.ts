import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../services/auth.service';
import { RequestCardComponent } from '../request-card/request-card';
import { Request, RequestStatus, RequestType } from '../../models/request.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RequestCardComponent, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  requests: Request[] = [];
  filteredRequests: Request[] = [];
  pendingApprovals: Request[] = [];
  requestsApproved: Request[] = [];
  requestsRejected: Request[] = [];
  userRequests: Request[] = [];
  activeTab: 'overview' | 'pending' | 'my-requests' | 'all' = 'overview';
  selectedStatusFilter: string = 'all';
  
  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  constructor(
    private requestService: RequestService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.requestService.getUserRequests().subscribe(requests => {
      this.userRequests = requests;
      this.calculateStats(requests);
    });

    this.requestService.getPendingApprovals().subscribe(requests => {
      this.pendingApprovals = requests;
    });
    this.requestService.getRequestsApproved().subscribe(requests => {
      this.requestsApproved = requests;
    });
    this.requestService.getRequestsRejected().subscribe(requests => {
      this.requestsRejected = requests;
    });

    this.requestService.getAllRequests().subscribe(requests => {
      this.requests = requests;
      this.applyStatusFilter(); // Aplicar filtro inicial
    });
  }

  calculateStats(requests: Request[]) {
    this.stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === RequestStatus.PENDING).length,
      approved: requests.filter(r => r.status === RequestStatus.APPROVED).length,
      rejected: requests.filter(r => r.status === RequestStatus.REJECTED).length
    };
  }

  onTabChange(tab: 'overview' | 'pending' | 'my-requests' | 'all') {
    this.activeTab = tab;
    
    if (tab === 'all') {
      this.selectedStatusFilter = 'all';
      this.applyStatusFilter();
    }
  }

  onStatusFilterChange() {
    this.applyStatusFilter();
  }

  applyStatusFilter() {
    if (this.selectedStatusFilter === 'all') {
      this.filteredRequests = [...this.requests];
    } else {
      this.filteredRequests = this.requests.filter(
        request => request.status === this.selectedStatusFilter
      );
    }
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'all': 'Todos los estados',
      'PENDING': 'Pendientes',
      'APPROVED': 'Aprobadas',
      'REJECTED': 'Rechazadas'
    };
    return statusLabels[status] || status;
  }

  onStatusUpdate(event: {id: string, status: RequestStatus, comments?: string}) {
    this.requestService.updateRequestStatus(event.id, {
      status: event.status,
      comments: event.comments
    }).subscribe(() => {
      this.loadDashboardData();
    });
  }

  createNewRequest() {
    this.router.navigate(['/create-request']);
  }

  get isRequester() {
    const user = this.authService.getCurrentUser();
    return user && user.email === 'solicitante@example.com';
  }

  get isApprover() {
    const user = this.authService.getCurrentUser();
    return user && (user.email === 'aprobador@example.com' || user.email === 'admin@example.com');
  }
}