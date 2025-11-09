export class Request {
  id: string;
  title: string;
  description: string;
  type: string; // Ahora es string en lugar de enum
  status: string; // Ahora es string en lugar de enum
  createdById: string;
  assignedToId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Definimos los valores permitidos como constantes
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