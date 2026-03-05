import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { startOfMonth, endOfMonth, subDays, startOfYear, format } from 'date-fns';

export type FilterMode = 'month' | 'range' | 'all';

interface DashboardFilters {
    mode: FilterMode;
    month: number;
    year: number;
    startDate?: string;
    endDate?: string;
}

interface DashboardFiltersContextType {
    filters: DashboardFilters;
    setFilters: (filters: DashboardFilters) => void;
    setQuickRange: (range: '30d' | '90d' | 'ytd' | 'all') => void;
}

const DashboardFiltersContext = createContext<DashboardFiltersContextType | undefined>(undefined);

export function DashboardFiltersProvider({ children }: { children: React.ReactNode }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const now = new Date();
    const defaultFilters: DashboardFilters = {
        mode: 'month',
        month: now.getMonth(),
        year: now.getFullYear()
    };

    const [filters, setFiltersState] = useState<DashboardFilters>(() => {
        const mode = (searchParams.get('mode') as FilterMode) || 'month';
        const m = searchParams.get('month');
        const y = searchParams.get('year');
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        return {
            mode,
            month: m ? parseInt(m) : defaultFilters.month,
            year: y ? parseInt(y) : defaultFilters.year,
            startDate: start || undefined,
            endDate: end || undefined
        };
    });

    const setFilters = useCallback((newFilters: DashboardFilters) => {
        setFiltersState(newFilters);
        const params = new URLSearchParams(searchParams);
        params.set('mode', newFilters.mode);
        if (newFilters.mode === 'month') {
            params.set('month', newFilters.month.toString());
            params.set('year', newFilters.year.toString());
            params.delete('start');
            params.delete('end');
        } else if (newFilters.mode === 'range') {
            if (newFilters.startDate) params.set('start', newFilters.startDate);
            if (newFilters.endDate) params.set('end', newFilters.endDate);
            params.delete('month');
            params.delete('year');
        } else {
            params.delete('month');
            params.delete('year');
            params.delete('start');
            params.delete('end');
        }
        setSearchParams(params);
    }, [searchParams, setSearchParams]);

    const setQuickRange = useCallback((range: '30d' | '90d' | 'ytd' | 'all') => {
        const today = new Date();
        let start: Date;
        let end: Date = today;

        if (range === '30d') {
            start = subDays(today, 30);
            setFilters({ mode: 'range', startDate: format(start, 'yyyy-MM-dd'), endDate: format(end, 'yyyy-MM-dd'), month: today.getMonth(), year: today.getFullYear() });
        } else if (range === '90d') {
            start = subDays(today, 90);
            setFilters({ mode: 'range', startDate: format(start, 'yyyy-MM-dd'), endDate: format(end, 'yyyy-MM-dd'), month: today.getMonth(), year: today.getFullYear() });
        } else if (range === 'ytd') {
            start = startOfYear(today);
            setFilters({ mode: 'range', startDate: format(start, 'yyyy-MM-dd'), endDate: format(end, 'yyyy-MM-dd'), month: today.getMonth(), year: today.getFullYear() });
        } else if (range === 'all') {
            setFilters({ mode: 'all', month: today.getMonth(), year: today.getFullYear() });
        }
    }, [setFilters]);

    useEffect(() => {
        const mode = (searchParams.get('mode') as FilterMode);
        if (mode) {
            setFiltersState({
                mode,
                month: parseInt(searchParams.get('month') || '0') || defaultFilters.month,
                year: parseInt(searchParams.get('year') || '0') || defaultFilters.year,
                startDate: searchParams.get('start') || undefined,
                endDate: searchParams.get('end') || undefined
            });
        }
    }, [searchParams]);

    return (
        <DashboardFiltersContext.Provider value={{ filters, setFilters, setQuickRange }}>
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
