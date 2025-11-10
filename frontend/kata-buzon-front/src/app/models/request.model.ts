export interface User {
  id: string;
  name: string;
  email: string;
}


export const RequestType = {
  DEPLOYMENT: 'DEPLOYMENT',
  ACCESS: 'ACCESS',
  TECHNICAL_CHANGE: 'TECHNICAL_CHANGE',
  OTHER: 'OTHER'
} as const;

export type RequestType = typeof RequestType[keyof typeof RequestType];

export const RequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const;

export type RequestStatus = typeof RequestStatus[keyof typeof RequestStatus];

export interface RequestHistory {
  id: string;
  status: RequestStatus;
  comments?: string;
  changedBy: User;
  createdAt: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  type: RequestType;
  status: RequestStatus;
  createdBy: User;
  assignedTo: User;
  createdAt: string;
  updatedAt: string;
  history: RequestHistory[];
}


export interface CreateRequestDto {
  title: string;
  description: string;
  type: RequestType;
  assignedToId: string;
}

export interface UpdateRequestStatusDto {
  status: RequestStatus;
  comments?: string;
}