import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface SpatialFeature {
  geometry: any; // We'll type this properly when we know the exact geometry structure
  properties: {
    assets?: string;
    category?: string;
    district?: string;
    name: string;
    owner?: string;
    region?: string;
    status?: string;
    type?: string;
    detected_date?: string;
  };
  type: 'Feature';
}

interface SpatialData {
  features: SpatialFeature[];
  type: 'FeatureCollection';
}

// New interface for the district search response
interface DistrictSearchResponse {
  result: string[];
}
  
// Fetch function for each data type
export const fetchSpatialData = async (endpoint: string): Promise<SpatialData> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {credentials: 'include'});
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return response.json();
};

// Fetch function for searching districts
export const fetchDistrictSearch = async (search_term: string): Promise<DistrictSearchResponse> => {
  if (!search_term) return { result: [] };
  const response = await fetch(`${API_BASE_URL}/data/districts/search?name=${encodeURIComponent(search_term)}`, {credentials: 'include'});
  if (!response.ok) {
    throw new Error(`Failed to fetch districts for search: ${search_term}`);
  }
  return response.json();
};

// Query keys
export const spatialDataKeys = {
  // concessions: ['spatial', 'concessions'],
  miningSites: ['spatial', 'mining-sites'],
  districts: ['spatial', 'districts'],
  forestReserves: ['spatial', 'forest-reserves'],
  rivers: ['spatial', 'rivers'],
  districtSearch: (search_term: string) => ['spatial', 'districts', 'search', search_term],
} as const;

// Custom hooks for each data type
// export const useConcessions = () => {
//   return useQuery({
//     queryKey: spatialDataKeys.concessions,
//     queryFn: () => fetchSpatialData('concessions'),
//   });
// };

export const useMiningSites = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: spatialDataKeys.miningSites,
    queryFn: () => fetchSpatialData('/data/mining-sites'),
    enabled: isAuthenticated,
  });
};

export const useDistricts = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: spatialDataKeys.districts,
    queryFn: () => fetchSpatialData('/data/districts'),
    enabled: isAuthenticated,
  });
};

export const useForestReserves = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: spatialDataKeys.forestReserves,
    queryFn: () => fetchSpatialData('/data/forest-reserves'),
    enabled: isAuthenticated,
  });
};

export const useRivers = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: spatialDataKeys.rivers,
    queryFn: () => fetchSpatialData('/data/rivers'),
    enabled: isAuthenticated,
  });
};

export const useDistrictSearch = (searchTerm: string) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery<DistrictSearchResponse, Error>({
    queryKey: spatialDataKeys.districtSearch(searchTerm),
    queryFn: () => fetchDistrictSearch(searchTerm),
    enabled: isAuthenticated && !!searchTerm, // Only run if authenticated and searchTerm exists
    staleTime: 1000 * 60 * 60 * 24 * 28, // 4 weeks
    gcTime: 1000 * 60 * 60 * 24 * 28, // 4 weeks
  });
};

// Aggregate hook for all spatial data
export const useSpatialData = () => {
  // const concessions = useConcessions();
  const miningSites = useMiningSites();
  const districts = useDistricts();
  const forestReserves = useForestReserves();
  const rivers = useRivers();

  return {
    // concessions,
    miningSites,
    districts,
    forestReserves,
    rivers,
    isLoading: miningSites.isLoading || districts.isLoading || forestReserves.isLoading || rivers.isLoading,
    isError: miningSites.isError || districts.isError || forestReserves.isError || rivers.isError,
  };
}; 