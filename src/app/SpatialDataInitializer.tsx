'use client';

import { useEffect } from 'react';
import { useSpatialStore } from '@/lib/store/spatial-store';
import { useAuthStore } from '@/lib/store/auth-store';

const SpatialDataInitializer = () => {
  const { isAuthenticated } = useAuthStore();
  const { fetchAllData } = useSpatialStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch initial data
    fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  return null;
};

export default SpatialDataInitializer; 