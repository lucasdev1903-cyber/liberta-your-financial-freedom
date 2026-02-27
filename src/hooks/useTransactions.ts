import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from './useGamification';
import type { Transaction, TransactionInsert, TransactionUpdate } from '@/lib/database.types';

export function useTransactions(filters?: { month?: number; year?: number; type?: string }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { updateActivity } = useGamification();

    const query = useQuery({
        queryKey: ['transactions', user?.id, filters],
        queryFn: async (): Promise<Transaction[]> => {
            if (!user) return [];

            let q = supabase
                .from('transactions')
                .select('*, categories(name, icon, color)')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (filters?.month !== undefined && filters?.year !== undefined) {
                const startDate = new Date(filters.year, filters.month, 1).toISOString().split('T')[0];
                const endDate = new Date(filters.year, filters.month + 1, 0).toISOString().split('T')[0];
                q = q.gte('date', startDate).lte('date', endDate);
            }

            if (filters?.type) {
                q = q.eq('type', filters.type);
            }

            const { data, error } = await q;
            if (error) throw error;
            return (data as unknown as Transaction[]) || [];
        },
        enabled: !!user,
    });

    const addTransaction = useMutation({
        mutationFn: async (transaction: Omit<TransactionInsert, 'user_id'>) => {
            if (!user) throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('transactions')
                .insert({ ...transaction, user_id: user.id })
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
