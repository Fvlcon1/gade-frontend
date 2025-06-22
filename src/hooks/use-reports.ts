import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface ReportLocation {
  lat: number;
  lon: number;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  locality: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
  location: ReportLocation;
  created_at: string;
  updated_at: string;
}

export const useReports = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ['reports', page, pageSize],
    queryFn: () => apiClient.reports.list(page, pageSize),
    enabled: !!process.env.NEXT_PUBLIC_API_URL,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}; 