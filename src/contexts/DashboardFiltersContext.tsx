import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface DashboardFilters {
    month: number;
    year: number;
}

interface DashboardFiltersContextType {
    filters: DashboardFilters;
    setFilters: (filters: DashboardFilters) => void;
}

const DashboardFiltersContext = createContext<DashboardFiltersContextType | undefined>(undefined);

export function DashboardFiltersProvider({ children }: { children: React.ReactNode }) {
    const [searchParams, setSearchParams] = useSearchParams();

    // Default to current month and year
    const now = new Date();
    const defaultFilters: DashboardFilters = {
        month: now.getMonth(),
        year: now.getFullYear()
    };

    const [filters, setFiltersState] = useState<DashboardFilters>(() => {
        const m = searchParams.get('month');
        const y = searchParams.get('year');
        return {
            month: m ? parseInt(m) : defaultFilters.month,
            year: y ? parseInt(y) : defaultFilters.year
        };
    });

    const setFilters = (newFilters: DashboardFilters) => {
        setFiltersState(newFilters);
        const params = new URLSearchParams(searchParams);
        params.set('month', newFilters.month.toString());
        params.set('year', newFilters.year.toString());
        setSearchParams(params);
    };

    // Update state if URL changes externally
    useEffect(() => {
        const m = searchParams.get('month');
        const y = searchParams.get('year');
        if (m || y) {
            setFiltersState({
                month: m ? parseInt(m) : defaultFilters.month,
                year: y ? parseInt(y) : defaultFilters.year
            });
        }
    }, [searchParams]);

    return (
        <DashboardFiltersContext.Provider value={{ filters, setFilters }}>
            {children}
        </DashboardFiltersContext.Provider>
    );
}

export function useDashboardFilters() {
    const context = useContext(DashboardFiltersContext);
    if (context === undefined) {
        throw new Error('useDashboardFilters must be used within a DashboardFiltersProvider');
    }
    return context;
}
