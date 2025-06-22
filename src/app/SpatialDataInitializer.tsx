'use client';

import { useEffect } from 'react';
import { useSpatialStore, setupReportsRefresh, cleanupReportsRefresh } from '@/lib/store/spatial-store';
import { useAuthStore } from '@/lib/store/auth-store';

const SpatialDataInitializer = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchAllData, fetchReports } = useSpatialStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch initial data
    fetchAllData();
      
      // Set up reports refresh
      setupReportsRefresh();

      // Cleanup on unmount
      return () => {
        cleanupReportsRefresh();
      };
    }
  }, [isAuthenticated, fetchAllData, fetchReports]);

  return null;
};

export default SpatialDataInitializer; 