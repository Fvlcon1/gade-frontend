import { create } from 'zustand';
import { fetchSpatialData } from '@/hooks/spatial-data';
import { useAuthStore } from '@/lib/store/auth-store';

// Define SpatialData type
interface SpatialData {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
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
    geometry: any;
  }>;
}

interface ReportLocation {
  lat: number;
  lon: number;
}

 interface Report {
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


interface SpatialState {
  // Spatial data
  districts: SpatialData | null;
  forestReserves: SpatialData | null;
  rivers: SpatialData | null;
  miningSites: SpatialData | null;
  filteredMiningSites: SpatialData | null;
  filteredDistricts: SpatialData | null;
  
  // Reports data
  reports: Report[] | null;
  reportsLastUpdated: number | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  selectedDistricts: string[];
  highlightedDistricts: string[];
  dateRange: { from: string | null; to: string | null } | null;

  // Actions
  setSelectedDistricts: (districts: string[]) => void;
  setHighlightedDistricts: (districts: string[]) => void;
  setDateRange: (range: { from: string | null; to: string | null }) => void;
  applyFilters: (options?: { year?: number; playhead?: number; range?: [number, number]; }) => void;
  fetchAllData: () => Promise<void>;
  fetchReports: () => Promise<void>;
}

// Helper function to fetch reports
const fetchReportsData = async (baseUrl: string): Promise<Report[]> => {
  if (!baseUrl) {
    throw new Error('API base URL is not configured');
  }
  const response = await fetch(`${baseUrl}/admin/report?page_id=1&page_size=1000`, {credentials: 'include'});
  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }
  const data = await response.json();
  return data;
};

export const useSpatialStore = create<SpatialState>((set, get) => ({
  // Initial state
  districts: null,
  forestReserves: null,
  rivers: null,
  miningSites: null,
  filteredMiningSites: null,
  filteredDistricts: null,
  reports: null,
  reportsLastUpdated: null,
  isLoading: false,
  error: null,
  selectedDistricts: [],
  highlightedDistricts: [],
  dateRange: null,

  // Actions
  setSelectedDistricts: (districts) => set({ selectedDistricts: districts }),
  setHighlightedDistricts: (districts) => set({ highlightedDistricts: districts }),
  setDateRange: (range) => set({ dateRange: range }),
  
  applyFilters: (options = {}) => {
    const { miningSites, districts, selectedDistricts, dateRange } = get();
    if (!miningSites || !districts) return;
  
    const { year, playhead, range } = options;
    let fromMonth = 0, toMonth = 11;
    if (range) {
      fromMonth = range[0];
      toMonth = range[1];
    }
    let playheadMonth = playhead != null ? playhead : toMonth;
  
    const filteredMiningSites = {
      ...miningSites,
      features: miningSites.features.filter(feature => {
        const matchesDistrict = selectedDistricts.length === 0 || 
          selectedDistricts.includes(feature.properties.district);
        
        let matchesDate = true;
        if (year != null && playhead != null) {
          const detected = feature.properties.detected_date;
          if (!detected) return false;
          
          const detectedYear = Number(detected.slice(0, 4));
          const detectedMonth = Number(detected.slice(5, 7)) - 1;
          
          matchesDate = detectedYear === year && 
                       detectedMonth <= playheadMonth && 
                       detectedMonth >= fromMonth &&
                       detectedMonth <= toMonth;
        } else if (dateRange?.from && dateRange?.to) {
          matchesDate = feature.properties.detected_date >= dateRange.from && 
                       feature.properties.detected_date <= dateRange.to;
        }
        
        return matchesDistrict && matchesDate;
      })
    };
  
    const filteredDistricts = {
      ...districts,
      features: districts.features.filter(feature => 
        selectedDistricts.length === 0 || 
        selectedDistricts.includes(feature.properties.district)
      )
    };
  
    console.log('Filtered Mining Sites:', filteredMiningSites.features.length);
    set({ filteredMiningSites, filteredDistricts });
  },
  fetchReports: async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      set({ error: 'API base URL is not configured' });
      return;
    }

    try {
      const reports = await fetchReportsData(baseUrl);
      set({ 
        reports,
        reportsLastUpdated: Date.now(),
        error: null 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch reports',
        reportsLastUpdated: Date.now() // Still update timestamp even on error
      });
    }
  },

  fetchAllData: async () => {
    set({ isLoading: true, error: null });
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) {
        throw new Error('API base URL is not configured');
      }

      // Fetch all data in parallel
      const [districts, forestReserves, rivers, miningSites, reports] = await Promise.all([
        fetchSpatialData('/data/districts'),
        fetchSpatialData('/data/forest-reserves'),
        fetchSpatialData('/data/rivers'),
        fetchSpatialData('/data/mining-sites'),
        fetchReportsData(baseUrl)
      ]);

      set({
        districts,
        forestReserves,
        rivers,
        miningSites,
        reports,
        reportsLastUpdated: Date.now(),
        filteredMiningSites: miningSites,
        filteredDistricts: districts,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        isLoading: false
      });
    }
  }
}));

// Set up automatic reports refresh
let refreshInterval: NodeJS.Timeout | null = null;

export const setupReportsRefresh = () => {
  const { isAuthenticated } = useAuthStore.getState();
  
  if (!isAuthenticated) return;
  
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  // Initial fetch
  useSpatialStore.getState().fetchReports();
  
  refreshInterval = setInterval(() => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
    useSpatialStore.getState().fetchReports();
    } else {
      cleanupReportsRefresh();
    }
  }, 10000); // Refresh every 10 seconds
};

export const cleanupReportsRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};