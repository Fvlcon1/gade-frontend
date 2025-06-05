'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Cache duration constants
const FOUR_WEEKS_MS = 1000 * 60 * 60 * 24 * 28; // 4 weeks in milliseconds

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FOUR_WEEKS_MS, // Data will be considered fresh for 4 weeks
      gcTime: FOUR_WEEKS_MS, // Keep unused data in cache for 4 weeks
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