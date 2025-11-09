import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request, CreateRequestDto, UpdateRequestStatusDto } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = 'http://localhost:3000/requests';

  constructor(private http: HttpClient) {}

  createRequest(request: CreateRequestDto): Observable<Request> {
    return this.http.post<Request>(this.apiUrl, request);
  }

  getAllRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(this.apiUrl);
  }

  getUserRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/my-requests`);
  }

  getPendingApprovals(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/pending-approvals`);
  }
  getRequestsApproved(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/approved`);
  }
  getRequestsRejected(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/rejected`);
  }

  updateRequestStatus(id: string, update: UpdateRequestStatusDto): Observable<Request> {
    return this.http.patch<Request>(`${this.apiUrl}/${id}/status`, update);
  }
  getUsersForAssignment(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/assignment-users`);
}
}