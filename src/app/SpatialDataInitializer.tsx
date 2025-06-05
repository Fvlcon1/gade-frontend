'use client';

import { useEffect } from 'react';
import { useSpatialStore } from '@/lib/store/spatialStore';

const SpatialDataInitializer = () => {
  const fetchAllData = useSpatialStore(state => state.fetchAllData);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return null;
};

export default SpatialDataInitializer; 