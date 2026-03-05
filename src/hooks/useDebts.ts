import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export interface Debt {
    id: string;
    name: string;
    type: 'credit_card' | 'loan' | 'mortgage' | 'other';
    value: number; // Balance remaining
    interest_rate: number | null;
    min_payment: number | null;
}

export function useDebts() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: debts, isLoading, isError } = useQuery({
        queryKey: ['debts', user?.id],
        queryFn: async (): Promise<Debt[]> => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('liabilities')
                .select('*')
                .eq('user_id', user.id);
            if (error) throw error;
            return data as Debt[] || [];
        },
        enabled: !!user,
        retry: false,
    });

    const addDebt = useMutation({
        mutationFn: async (debt: Omit<Debt, 'id'>) => {
            const { data, error } = await (supabase
                .from('liabilities') as any)
                .insert({ ...debt, user_id: user?.id })
                .select()
                .single();
            if (error) throw error;
            return data as Debt;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['debts', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['liabilities', user?.id] });
        },
    });

    const updateDebt = useMutation({
        mutationFn: async ({ id, ...updates }: Partial<Debt> & { id: string }) => {
            const { data, error } = await (supabase
                .from('liabilities') as any)
                .update(updates)
                .eq('id', id)
                .eq('user_id', user?.id)
                .select()
                .single();
            if (error) throw error;
            return data as Debt;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['debts', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['liabilities', user?.id] });
        },
    });

    const deleteDebt = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('liabilities')
                .delete()
                .eq('id', id)
                .eq('user_id', user?.id);
            if (error) throw error;
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['debts', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['liabilities', user?.id] });
        },
    });

    return {
        debts: debts || [],
        isLoading,
        isError,
        addDebt,
        updateDebt,
        deleteDebt,
    };
}
