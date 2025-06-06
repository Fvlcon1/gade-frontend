import { create } from 'zustand';
import { fetchSpatialData } from '@/hooks/spatial-data';

// Define SpatialData type here since it's not exported from spatial-data
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

// Add type for mining site properties
interface MiningSiteProperties {
  assets?: string;
  category?: string;
  district?: string;
  name: string;
  owner?: string;
  region?: string;
  status?: string;
  type?: string;
  detected_date?: string; // Make it optional
}

interface SpatialState {
  districts: SpatialData | null;
  forestReserves: SpatialData | null;
  rivers: SpatialData | null;
  miningSites: SpatialData | null;
  filteredMiningSites: SpatialData | null;
  filteredDistricts: SpatialData | null;
  isLoading: boolean;
  error: string | null;
  selectedDistricts: string[];
  highlightedDistricts: string[];
  dateRange: {
    from: string | null;
    to: string | null;
  };
  setSelectedDistricts: (districts: string[]) => void;
  setHighlightedDistricts: (districts: string[]) => void;
  setDateRange: (range: { from: string | null; to: string | null }) => void;
  applyFilters: () => void;
  fetchAllData: () => Promise<void>;
}

// Update the mining sites type
interface MiningSite {
  type: string;
  features: Array<{
    type: string;
    properties: MiningSiteProperties;
    geometry: any;
  }>;
}

export const useSpatialStore = create<SpatialState>((set, get) => ({
  districts: null,
  forestReserves: null,
  rivers: null,
  miningSites: null,
  filteredMiningSites: null,
  filteredDistricts: null,
  isLoading: false,
  error: null,
  selectedDistricts: [],
  highlightedDistricts: [],
  dateRange: {
    from: null,
    to: null
  },
  setSelectedDistricts: (districts) => set({ selectedDistricts: districts }),
  setHighlightedDistricts: (districts) => set({ highlightedDistricts: districts }),
  setDateRange: (range) => set({ dateRange: range }),
  applyFilters: () => {
    const { miningSites, districts, selectedDistricts, dateRange } = get();
    if (!miningSites || !districts) return;

    console.log('Applying filters with:', {
      selectedDistricts,
      dateRange,
      totalMiningSites: miningSites.features.length
    });

    // Efficient date range check
    const isDateInRange = (dateStr: string) => {
      if (!dateRange.from && !dateRange.to) return true;
      
      const date = new Date(dateStr).getTime();
      const from = dateRange.from ? new Date(dateRange.from).setHours(0, 0, 0, 0) : null;
      const to = dateRange.to ? new Date(dateRange.to).setHours(23, 59, 59, 999) : null;
      
      return (!from || date >= from) && (!to || date <= to);
    };

    // First apply date range filter to all mining sites
    const dateFilteredSites = {
      ...miningSites,
      features: miningSites.features.filter(feature => 
        !feature.properties.detected_date || isDateInRange(feature.properties.detected_date)
      )
    };

    console.log('After date filter:', {
      dateFilteredCount: dateFilteredSites.features.length
    });

    // Then apply district filter if districts are selected
    const filteredSites = selectedDistricts.length === 0 
      ? dateFilteredSites // If no districts selected, show all date-filtered sites
      : {
          ...dateFilteredSites,
          features: dateFilteredSites.features.filter(feature => 
            selectedDistricts.includes(feature.properties.district)
          )
        };

    console.log('Final filtered results:', {
      filteredSitesCount: filteredSites.features.length,
      selectedDistrictsCount: selectedDistricts.length,
      dateRangeActive: !!(dateRange.from || dateRange.to)
    });

    // Only filter districts if we have selected districts
    const filteredDistricts = selectedDistricts.length === 0 ? districts : {
      ...districts,
      features: districts.features.filter(feature => 
        selectedDistricts.includes(feature.properties.district)
      )
    };

    set({ 
      filteredMiningSites: filteredSites,
      filteredDistricts: filteredDistricts
    });
  },
  fetchAllData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [districts, forestReserves, rivers, miningSites] = await Promise.all([
        fetchSpatialData('/data/districts'),
        fetchSpatialData('/data/forest-reserves'),
        fetchSpatialData('/data/rivers'),
        fetchSpatialData('/data/mining-sites'),
      ]);

      set({
        districts,
        forestReserves,
        rivers,
        miningSites,
        filteredMiningSites: miningSites,
        filteredDistricts: districts,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch spatial data',
        isLoading: false,
      });
    }
  },
})); 