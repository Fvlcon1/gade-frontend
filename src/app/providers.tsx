'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Cache duration constants
const MAX_SAFE_TIMEOUT = 2_147_483_647; // Maximum safe timeout for Node.js timers (~24.8 days)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: MAX_SAFE_TIMEOUT, // Data will be considered fresh for max safe duration
      gcTime: MAX_SAFE_TIMEOUT, // Keep unused data in cache for max safe duration
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Don't refetch when component mounts if data exists
      refetchOnReconnect: false, // Don't refetch when reconnecting
      retry: 1, // Only retry failed requests once
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 