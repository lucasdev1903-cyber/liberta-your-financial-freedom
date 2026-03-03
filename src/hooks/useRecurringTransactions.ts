import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export interface RecurringTransaction {
    id: string;
    user_id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    frequency: 'weekly' | 'monthly' | 'yearly';
    day_of_month: number;
    is_active: boolean;
    next_due_date: string | null;
    created_at: string;
}

export function useRecurringTransactions() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['recurring', user?.id],
        queryFn: async (): Promise<RecurringTransaction[]> => {
            if (!user) return [];
            const { data, error } = await (supabase.from('recurring_transactions') as any)
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error) return [];
            return data || [];
        },
        enabled: !!user,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const addRecurring = useMutation({
        mutationFn: async (item: Omit<RecurringTransaction, 'id' | 'user_id' | 'created_at'>) => {
            const { data, error } = await (supabase.from('recurring_transactions') as any)
                .insert({ ...item, user_id: user?.id })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recurring'] }),
    });

    const updateRecurring = useMutation({
        mutationFn: async ({ id, ...updates }: Partial<RecurringTransaction> & { id: string }) => {
            const { data, error } = await (supabase.from('recurring_transactions') as any)
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recurring'] }),
    });

    const deleteRecurring = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase.from('recurring_transactions') as any)
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recurring'] }),
    });

    return {
        recurringItems: query.data || [],
        isLoading: query.isLoading,
        addRecurring,
        updateRecurring,
        deleteRecurring,
    };
}
