import { useQuery } from '@tanstack/react-query';


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

const fetchReports = async (baseUrl: string, page: number = 1, pageSize: number = 10): Promise<Report[]> => {
  if (!baseUrl) {
    throw new Error('API base URL is not configured');
  }
  const response = await fetch(`${baseUrl}/admin/report?page_id=${page}&page_size=${pageSize}`);
  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }
  const data = await response.json();
  console.log('Reports API response:', data);
  return data; // API returns array directly
};

export const useReports = (page: number = 1, pageSize: number = 10) => {
  const baseUrl =  process.env.NEXT_PUBLIC_API_URL

  return useQuery({
    queryKey: ['reports', page, pageSize],
    queryFn: () => fetchReports(baseUrl, page, pageSize),
    enabled: !!baseUrl,
    refetchInterval: 10000, // Refetch every 30 seconds
  });
}; 