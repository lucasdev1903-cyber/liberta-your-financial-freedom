import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export interface BankConnection {
    id: string;
    user_id: string;
    bank_name: string;
    bank_code: string | null;
    bank_logo: string | null;
    account_type: string;
    last_four: string | null;
    balance: number;
    status: 'connected' | 'disconnected' | 'syncing' | 'error';
    last_synced_at: string | null;
    created_at: string;
}

export function useBankConnections() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['bank-connections', user?.id],
        queryFn: async (): Promise<BankConnection[]> => {
            if (!user) return [];
            const { data, error } = await (supabase.from('bank_connections') as any)
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

    const addConnection = useMutation({
        mutationFn: async (conn: Partial<BankConnection>) => {
            const { data, error } = await (supabase.from('bank_connections') as any)
                .insert({ ...conn, user_id: user?.id })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bank-connections'] }),
    });

    const updateConnection = useMutation({
        mutationFn: async ({ id, ...updates }: Partial<BankConnection> & { id: string }) => {
            const { data, error } = await (supabase.from('bank_connections') as any)
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bank-connections'] }),
    });

    const deleteConnection = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase.from('bank_connections') as any)
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bank-connections'] }),
    });

    const importTransactions = useMutation({
        mutationFn: async (transactions: Array<{ date: string; description: string; amount: number; type: 'income' | 'expense'; category: string }>) => {
            if (!user) throw new Error('Not authenticated');
            const rows = transactions.map(t => ({
                user_id: user.id,
                description: t.description,
                amount: t.amount,
                type: t.type,
                category: t.category,
                date: t.date,
            }));
            const { error } = await (supabase.from('transactions') as any).insert(rows);
            if (error) throw error;
            return rows.length;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        },
    });

    return {
        connections: query.data || [],
        isLoading: query.isLoading,
        addConnection,
        updateConnection,
        deleteConnection,
        importTransactions,
    };
}
