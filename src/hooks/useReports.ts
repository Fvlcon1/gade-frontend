import { useQuery } from '@tanstack/react-query';
import { useSpatialStore } from '@/lib/store/spatialStore';

interface ReportLocation {
  lat: number;
  lon: number;
}

export interface Report {
  id: string;
  locality: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  status: string;
  location: ReportLocation;
  created_at: string;
}

const fetchReports = async (baseUrl: string, page: number = 1, pageSize: number = 10): Promise<Report[]> => {
  console.log('Fetching reports from:', `${baseUrl}/admin/report?page_id=${page}&page_size=${pageSize}`);
  if (!baseUrl) {
    console.error('baseUrl is empty! Check NEXT_PUBLIC_API_URL environment variable');
    throw new Error('API base URL is not configured');
  }
  const response = await fetch(`${baseUrl}/admin/report?page_id=${page}&page_size=${pageSize}`);
  if (!response.ok) {
    console.error('Failed to fetch reports:', response.status, response.statusText);
    throw new Error('Failed to fetch reports');
  }
  const data = await response.json();
  console.log('Reports API response:', data);
  return data; // API returns array directly
};

export const useReports = (page: number = 1, pageSize: number = 10) => {
  const { baseUrl } = useSpatialStore();
  console.log('useReports - baseUrl:', baseUrl);

  return useQuery({
    queryKey: ['reports', page, pageSize],
    queryFn: () => fetchReports(baseUrl, page, pageSize),
    enabled: !!baseUrl,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}; 