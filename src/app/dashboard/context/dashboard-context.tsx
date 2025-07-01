'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import useDashboardMetrics from '../hooks/useDashboard';
import { DashboardContextType, Ranking } from '../utils/types';

// Create context
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Context provider
export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
    const metrics = useDashboardMetrics();

    return (
        <DashboardContext.Provider
            value={{
                ...metrics,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

// Custom hook to use context
export const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

// Export types
export type { Ranking, DashboardContextType };
