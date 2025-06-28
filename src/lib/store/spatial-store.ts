import { create } from 'zustand';
import { apiClient } from '@/lib/api-client';
import { getLastTwelveMonths } from '@/utils/date-utils';

// SpatialData type
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
      id? : string
      area? : number
      severity? : string
      severity_type? : string
      severity_score? : number
      proximity_to_water? : boolean
      inside_forest_reserve? : boolean
      detection_date? : string
      all_violation_types? : string
      distance_to_water_m? : number
      distance_to_forest_m? : number
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

  //Filter
  months: Array<{ monthIndex: number; year: number }>;

  //Proximity
  minProximityToRiver: number;
  maxProximityToRiver: number;
  minProximityToForestReserve: number;
  maxProximityToForestReserve: number;


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
  setProximityFilters: (options: { minProximityToRiver?: number; maxProximityToRiver?: number; minProximityToForestReserve?: number; maxProximityToForestReserve?: number; }) => void;
  fetchAllData: () => Promise<void>;
  fetchReports: () => Promise<void>;
  setMonths: (months : Array<{ monthIndex: number; year: number }>) => void;
}

export const useSpatialStore = create<SpatialState>((set, get) => ({
  // Initial state
  districts: null,
  forestReserves: null,
  rivers: null,
  miningSites: null,
  filteredMiningSites: null,
  filteredDistricts: null,
  months: getLastTwelveMonths(),
  reports: null,
  reportsLastUpdated: null,
  isLoading: false,
  error: null,
  selectedDistricts: [],
  highlightedDistricts: [],
  dateRange: null,

  // Proximity
  minProximityToRiver: 0,
  maxProximityToRiver: 0,
  minProximityToForestReserve: 0,
  maxProximityToForestReserve: 0,

  // Actions
  setSelectedDistricts: (districts) => set({ selectedDistricts: districts }),
  setHighlightedDistricts: (districts) => set({ highlightedDistricts: districts }),
  setDateRange: (range) => set({ dateRange: range }),
  setMonths: (months : Array<{ monthIndex: number; year: number }>) => set({ months: months }),
  setProximityFilters: (options) => set({ 
    minProximityToRiver: options.minProximityToRiver ?? get().minProximityToRiver,
    maxProximityToRiver: options.maxProximityToRiver ?? get().maxProximityToRiver,
    minProximityToForestReserve: options.minProximityToForestReserve ?? get().minProximityToForestReserve,
    maxProximityToForestReserve: options.maxProximityToForestReserve ?? get().maxProximityToForestReserve,
   }),
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

    let filteredMiningSites = {
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

    const filterByProximityToRivers = () : SpatialData => {
      return {
        ...filteredMiningSites,
        features: filteredMiningSites.features.filter(feature => {
          const distance = feature.properties.distance_to_water_m;
          return distance >= get().minProximityToRiver && distance <= get().maxProximityToRiver;
        })
      }
    }

    const filterByProximityToForestReserves = () : SpatialData => {
      return {
        ...filteredMiningSites,
        features: filteredMiningSites.features.filter(feature => {
          const distance = feature.properties.distance_to_forest_m;
          return distance >= get().minProximityToForestReserve && distance <= get().maxProximityToForestReserve;
        })
      }
    }

    //Filter by proximity to river
    if (get().maxProximityToRiver)
      filteredMiningSites = filterByProximityToRivers()
    
    //Filter by proximity to forest reserve
    if (get().maxProximityToForestReserve)
      filteredMiningSites = filterByProximityToForestReserves()

    const filteredDistricts = {
      ...districts,
      features: districts.features.filter(feature =>
        selectedDistricts.length === 0 ||
        selectedDistricts.includes(feature.properties.district)
      )
    };

    console.log({filteredMiningSites})

    console.log('Filtered Mining Sites:', filteredMiningSites.features.length);
    set({ filteredMiningSites, filteredDistricts });
  },
  fetchReports: async () => {
    try {
      const reports = await apiClient.reports.all();
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
      console.log('Fetching all data...');
      // Fetch all data in parallel
      const [districts, forestReserves, rivers, miningSites] = await Promise.allSettled([
        apiClient.spatial.districts(),
        apiClient.spatial.forestReserves(),
        apiClient.spatial.rivers(),
        apiClient.spatial.miningSites(),
      ]);

      
      // const districts = await apiClient.spatial.districts();
      // const forestReserves = await apiClient.spatial.forestReserves();
      // const rivers = await apiClient.spatial.rivers();
      // const miningSites = await apiClient.spatial.miningSites();
      
      // console.log({districts, forestReserves, rivers, miningSites})
      
      // set({
      //   districts: districts,
      //   forestReserves: forestReserves,
      //   rivers: rivers,
      //   miningSites: miningSites,
      //   reportsLastUpdated: Date.now(),
      //   filteredMiningSites: miningSites,
      //   filteredDistricts: districts,
      //   isLoading: false,
      //   error: null
      // });

      set({
        districts: districts.status === "fulfilled" ? districts.value : null,
        forestReserves: forestReserves.status === "fulfilled" ? forestReserves.value : null,
        rivers: rivers.status === "fulfilled" ? rivers.value : null,
        miningSites: miningSites.status === "fulfilled" ? miningSites.value : null,
        reportsLastUpdated: Date.now(),
        filteredMiningSites: miningSites.status === "fulfilled" ? miningSites.value : null,
        filteredDistricts: districts.status === "fulfilled" ? districts.value : null,
        isLoading: false,
        error: null
      });

      console.log('Data fetched successfully');
    } catch (error) {
      console.error('Failed to fetch data:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        isLoading: false
      });
    }
  }
}));