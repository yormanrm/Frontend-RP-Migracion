export type Role = 'CUSTOMER' | 'ASSOCIATE' | 'ADMIN';

export interface RegisterCustomerRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterAssociateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  storeName: string;
  rfc: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
}
