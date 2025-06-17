import type {
  LoginCredentials,
  LoginResponse,
  OTPRequest,
  OTPResponse,
  OTPVerificationRequest,
  OTPVerificationResponse,
  SetupAccountRequest,
  SetupAccountResponse,
  User,
  AccountRegistrationRequest,
  PaginatedResponse,
} from '@/types/auth';

class ApiError extends Error {
  constructor(public code: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new ApiError(response.status, error.error || 'An error occurred');
  }
  return response.json();
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  }

  auth = {
    login: (credentials: LoginCredentials) =>
      this.request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    setup: (data: SetupAccountRequest) => {
      console.log('apiClient.auth.setup - sending data:', data);
      return this.request<SetupAccountResponse>('/accounts/setup', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    logout: () =>
      this.request<void>('/auth/logout', {
        method: 'POST',
      }),

    sendOTP: (data: OTPRequest) =>
      this.request<OTPResponse>('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    verifyOTP: (data: OTPVerificationRequest) =>
      this.request<OTPVerificationResponse>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  accounts = {
    list: (params?: { pageId: number; pageSize: number }) =>
      this.request<User[]>(
        `/accounts/?page_id=${params?.pageId || 1}&page_size=${params?.pageSize || 10}`
      ),

    get: (id: string) =>
      this.request<User>(`/accounts/${id}`),

    register: (data: AccountRegistrationRequest) =>
      this.request<User>('/accounts/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<void>(`/accounts/${id}`, {
        method: 'DELETE',
      }),

    updateDepartment: (id: string, department: string) =>
      this.request<User>(`/accounts/${id}/department`, {
        method: 'PATCH',
        body: JSON.stringify({ department }),
      }),

    updateRole: (id: string, role: 'ADMIN' | 'STANDARD') =>
      this.request<User>(`/accounts/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),

    updateStatus: (id: string, status: 'ACTIVE' | 'INACTIVE' | 'PENDING') =>
      this.request<User>(`/accounts/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  };
}

export const apiClient = new ApiClient(); 