import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth-store';
import { apiClient } from '@/lib/api-client';

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
  
// Query keys
export const spatialDataKeys = {
  miningSites: ['spatial', 'mining-sites'],
  districts: ['spatial', 'districts'],
  forestReserves: ['spatial', 'forest-reserves'],
  rivers: ['spatial', 'rivers'],
  districtSearch: (search_term: string) => ['spatial', 'districts', 'search', search_term],
} as const;

export const useMiningSites = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: spatialDataKeys.miningSites,
    queryFn: () => apiClient.spatial.miningSites(),
    enabled: isAuthenticated,
  });
};

export const useDistricts = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: spatialDataKeys.districts,
    queryFn: () => apiClient.spatial.districts(),
    enabled: isAuthenticated,
  });
};

export const useForestReserves = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: spatialDataKeys.forestReserves,
    queryFn: () => apiClient.spatial.forestReserves(),
    enabled: isAuthenticated,
  });
};

export const useRivers = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: spatialDataKeys.rivers,
    queryFn: () => apiClient.spatial.rivers(),
    enabled: isAuthenticated,
  });
};

export const useDistrictSearch = (searchTerm: string) => {
  const { isAuthenticated } = useAuthStore();
  return useQuery<DistrictSearchResponse, Error>({
    queryKey: spatialDataKeys.districtSearch(searchTerm),
    queryFn: () => apiClient.spatial.districtSearch(searchTerm),
    enabled: isAuthenticated && !!searchTerm, // Only run if authenticated and searchTerm exists
    staleTime: 1000 * 60 * 60 * 24 * 28, // 4 weeks
    gcTime: 1000 * 60 * 60 * 24 * 28, // 4 weeks
  });
};

// Aggregate hook for all spatial data
export const useSpatialData = () => {
  const { isAuthenticated } = useAuthStore();
  
  // Only fetch data if user is authenticated
  const miningSites = useMiningSites();
  const districts = useDistricts();
  const forestReserves = useForestReserves();
  const rivers = useRivers();

  return {
    miningSites,
    districts,
    forestReserves,
    rivers,
    isLoading: isAuthenticated && (miningSites.isLoading || districts.isLoading || forestReserves.isLoading || rivers.isLoading),
    isError: isAuthenticated && (miningSites.isError || districts.isError || forestReserves.isError || rivers.isError),
    isAuthenticated
  };
}; 