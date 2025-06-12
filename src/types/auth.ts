export interface User {
  id: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  role: 'ADMIN' | 'STANDARD';
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  redirectUrl?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  requires_2fa: boolean;
}

export interface SetupAccountRequest {
    first_name: string;
  last_name: string;
  user_name: string;
  password: string;
  token: string;
}

export interface SetupAccountResponse {
  user: User;
  token: string;
}

export interface OTPRequest {
  email: string;
}

export interface OTPResponse {
  message: string;
}

export interface OTPVerificationRequest {
  email: string;
  otp: string;
  redirectUrl?: string;
}

export interface OTPVerificationResponse {
  user: User;
  token: string;
}

export interface AccountRegistrationRequest {
  email: string;
  department: string;
  role: 'ADMIN' | 'USER';
}

export interface PaginatedResponse<T> {
  data: T[];
  page_id: number;
  page_size: number;
  total: number;
} 