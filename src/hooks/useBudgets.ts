import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export interface Budget {
    id: string;
    user_id: string;
    category_id: string;
    amount_limit: number;
    period: string;
    categories?: { name: string; color: string; icon: string; type: string };
}

export interface BudgetWithSpent extends Budget {
    spent: number;
    percentage: number;
    status: 'safe' | 'warning' | 'danger';
}

export function useBudgets(filters?: { month?: number; year?: number }) {
    const { user } = useAuth();
    const qc = useQueryClient();

    const budgetsQuery = useQuery({
        queryKey: ['budgets', user?.id],
        queryFn: async (): Promise<Budget[]> => {
            if (!user) return [];
            const { data, error } = await (supabase.from('budgets') as any)
                .select('*, categories(name, color, icon, type)')
                .eq('user_id', user.id);
            if (error) throw error;
            return data || [];
        },
        enabled: !!user,
    });

    const transactionsQuery = useQuery({
        queryKey: ['budget-transactions', user?.id, filters?.month, filters?.year],
        queryFn: async () => {
            if (!user) return [];
            const now = new Date();
            const currentMonth = filters?.month !== undefined ? filters.month : now.getMonth();
            const currentYear = filters?.year !== undefined ? filters.year : now.getFullYear();
            const start = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
            const end = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('transactions')
                .select('amount, category_id')
                .eq('user_id', user.id)
                .eq('type', 'expense')
                .gte('date', start)
                .lte('date', end);
            if (error) throw error;
            return (data || []) as { amount: number; category_id: string }[];
        },
        enabled: !!user,
    });

    const budgetsWithSpent: BudgetWithSpent[] = (budgetsQuery.data || []).map((b) => {
        const spent = (transactionsQuery.data || [])
            .filter((t) => t.category_id === b.category_id)
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const pct = b.amount_limit > 0 ? (spent / b.amount_limit) * 100 : 0;
        return {
            ...b,
            spent,
            percentage: Math.min(pct, 100),
            status: pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'safe',
        };
    });

    const addBudget = useMutation({
        mutationFn: async (data: { category_id: string; amount_limit: number }) => {
            const { error } = await (supabase.from('budgets') as any)
                .insert({ ...data, user_id: user?.id });
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
    });

    const updateBudget = useMutation({
        mutationFn: async ({ id, amount_limit }: { id: string; amount_limit: number }) => {
            const { error } = await (supabase.from('budgets') as any)
                .update({ amount_limit, updated_at: new Date().toISOString() })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
    });

    const deleteBudget = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await (supabase.from('budgets') as any).delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
    });

    return {
        budgets: budgetsWithSpent,
        isLoading: budgetsQuery.isLoading || transactionsQuery.isLoading,
        addBudget,
        updateBudget,
        deleteBudget,
    };
}
