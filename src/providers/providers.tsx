'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import AntdConfigProvider from './antd-config-provider';

const MAX_SAFE_TIMEOUT = 2_147_483_647;

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: MAX_SAFE_TIMEOUT,
			gcTime: MAX_SAFE_TIMEOUT,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			retry: 1,
		},
	},
});

export function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<AntdConfigProvider>
				{children}
			</AntdConfigProvider>
		</QueryClientProvider>
	);
} 