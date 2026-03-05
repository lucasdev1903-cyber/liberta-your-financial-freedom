import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from './useGamification';
import type { Transaction, TransactionInsert, TransactionUpdate } from '@/lib/database.types';

export type TransactionWithCategory = Transaction & {
    categories?: {
        name: string;
        icon: string | null;
        color: string | null;
    } | null;
};

export type DateRange = 'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'all';

export function useTransactions(filters?: { month?: number; year?: number; type?: string; dateRange?: DateRange }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { updateActivity } = useGamification();

    const query = useQuery({
        queryKey: ['transactions', user?.id, filters],
        queryFn: async (): Promise<TransactionWithCategory[]> => {
            if (!user) return [];

            let q = supabase
                .from('transactions')
                .select('*, categories(name, icon, color)')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (filters?.dateRange) {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                let startDate: string;
                let endDate: string;

                if (filters.dateRange === 'this_month') {
                    startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
                    endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
                } else if (filters.dateRange === 'last_month') {
                    startDate = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
                    endDate = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];
                } else if (filters.dateRange === 'last_3_months') {
                    startDate = new Date(currentYear, currentMonth - 2, 1).toISOString().split('T')[0];
                    endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
                } else if (filters.dateRange === 'this_year') {
                    startDate = new Date(currentYear, 0, 1).toISOString().split('T')[0];
                    endDate = new Date(currentYear, 11, 31).toISOString().split('T')[0];
                } else { // all
                    startDate = new Date(2000, 0, 1).toISOString().split('T')[0];
                    endDate = new Date(2100, 0, 1).toISOString().split('T')[0];
                }
                q = q.gte('date', startDate).lte('date', endDate);
            } else if (filters?.month !== undefined && filters?.year !== undefined) {
                const startDate = new Date(filters.year, filters.month, 1).toISOString().split('T')[0];
                const endDate = new Date(filters.year, filters.month + 1, 0).toISOString().split('T')[0];
                q = q.gte('date', startDate).lte('date', endDate);
            }

            if (filters?.type) {
                q = q.eq('type', filters.type);
            }

            const { data, error } = await q;
            if (error) throw error;
            return (data as unknown as TransactionWithCategory[]) || [];
        },
        enabled: !!user,
    });

    const addTransaction = useMutation({
        mutationFn: async (transaction: Omit<TransactionInsert, 'user_id'>) => {
            if (!user) throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('transactions')
                .insert([{ ...transaction, user_id: user.id }] as any)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        },
    });

    const updateTransaction = useMutation({
        mutationFn: async ({ id, ...updates }: TransactionUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('transactions')
                // @ts-expect-error type inference is failing here
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        },
    });

    const deleteTransaction = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('transactions').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        },
    });

    return {
        transactions: query.data || [],
        isLoading: query.isLoading,
        error: query.error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
    };
}
