import Cookies from "universal-cookie"

const cookies = new Cookies();

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
  AccountRegistrationRequest
} from '@/types/auth';

import axiosInstance from '@/utils/apis/axiosInstance';

class ApiError extends Error {
  constructor(public code: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      data?: any;
      params?: any;
    } = {}
  ): Promise<T> {
    try {
      const response = await axiosInstance.request<T>({
        url: endpoint,
        method: options.method || 'GET',
        data: options.data,
        params: options.params,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError(error.response.status, error.response.data?.message || error.message);
      }
      throw new ApiError(500, error.message || 'An error occurred');
    }
  }

  auth = {
    login: (credentials: LoginCredentials) =>
      this.request<LoginResponse>('/auth/login', {
        method: 'POST',
        data: credentials,
      }),

    setup: (data: SetupAccountRequest) => {
      console.log('apiClient.auth.setup - sending data:', data);
      return this.request<SetupAccountResponse>('/accounts/setup', {
        method: 'POST',
        data: data,
      });
    },

    logout: () =>
      this.request<void>('/auth/logout', {
        method: 'POST',
      }),

    sendOTP: (data: OTPRequest) =>
      this.request<OTPResponse>('/auth/send-otp', {
        method: 'POST',
        data: data,
      }),

    verifyOTP: (data: OTPVerificationRequest) =>
      this.request<OTPVerificationResponse>('/auth/verify-otp', {
        method: 'POST',
        data: data,
      }),
  };

  accounts = {
    list: (params?: { pageId: number; pageSize: number }) =>
      this.request<User[]>(
        `/accounts/`,
        { params: { page_id: params?.pageId || 1, page_size: params?.pageSize || 10 } }
      ),

    get: (id: string) =>
      this.request<User>(`/accounts/${id}`),

    register: (data: AccountRegistrationRequest) =>
      this.request<User>('/accounts/register', {
        method: 'POST',
        data: data,
      }),

    delete: (id: string) =>
      this.request<void>(`/accounts/${id}`, {
        method: 'DELETE',
      }),

    updateDepartment: (id: string, department: string) =>
      this.request<User>(`/accounts/${id}/department`, {
        method: 'PATCH',
        data: { department },
      }),

    updateRole: (id: string, role: 'ADMIN' | 'STANDARD') =>
      this.request<User>(`/accounts/${id}/role`, {
        method: 'PATCH',
        data: { role },
      }),

    updateStatus: (id: string, status: 'ACTIVE' | 'INACTIVE' | 'PENDING') =>
      this.request<User>(`/accounts/${id}/status`, {
        method: 'PATCH',
        data: { status },
      }),
  };

  spatial = {
    miningSites: () =>
      this.request<any>('/data/mining-sites'),
    districts: () =>
      this.request<any>('/data/districts'),
    forestReserves: () =>
      this.request<any>('/data/forest-reserves'),
    concessions: () =>
      this.request<any>('/data/concessions'),
    rivers: () =>
      this.request<any>('/data/rivers'),
    districtSearch: (searchTerm: string) =>
      this.request<any>(`/data/districts/search`, {
        params: { name: searchTerm }
      }),
    heatmapData: () => {
      // Calculate dates for the last 6 months
      const end = new Date();
      const start = new Date();
      start.setFullYear(start.getFullYear() - 1);
      end.setMonth(end.getMonth() - 1);
      
      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };

      return this.request<any>(`/data/heatmap-data`, {
        params: { start_date: formatDate(start), end_date: formatDate(end) }
      });
    },
  };

  reports = {
    list: (page: number = 1, pageSize: number = 10) =>
      this.request<any>(`/admin/report`, {
        params: { page_id: page, page_size: pageSize }
      }),
    all: () =>
      this.request<any>(`/admin/report`, {
        params: { page_id: 1, page_size: 1000 }
      }),
  };
}

export const apiClient = new ApiClient(); 