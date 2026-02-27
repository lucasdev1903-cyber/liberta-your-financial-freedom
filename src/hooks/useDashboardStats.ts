import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    transactionCount: number;
    incomeChange: number;
    expenseChange: number;
    monthlyData: { month: string; income: number; expense: number }[];
    categoryBreakdown: { name: string; amount: number; color: string }[];
}

export function useDashboardStats() {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['dashboard-stats', user?.id],
        queryFn: async (): Promise<DashboardStats> => {
            if (!user) throw new Error('Not authenticated');

            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            // Current month range
            const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
            const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

            // Previous month range
            const startOfPrevMonth = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
            const endOfPrevMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

            // Current month transactions
            const { data: currentData } = await supabase
                .from('transactions')
                .select('amount, type, category_id, categories(name, color)')
                .eq('user_id', user.id)
                .gte('date', startOfMonth)
                .lte('date', endOfMonth);

            // Previous month transactions
            const { data: prevData } = await supabase
                .from('transactions')
                .select('amount, type')
                .eq('user_id', user.id)
                .gte('date', startOfPrevMonth)
                .lte('date', endOfPrevMonth);

            // Last 6 months for chart
            const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1).toISOString().split('T')[0];
            const { data: chartData } = await supabase
                .from('transactions')
                .select('amount, type, date')
                .eq('user_id', user.id)
                .gte('date', sixMonthsAgo)
                .lte('date', endOfMonth);

            const transactions = currentData || [];
            const prevTransactions = prevData || [];

            const totalIncome = transactions
                .filter((t) => t.type === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const totalExpenses = transactions
                .filter((t) => t.type === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const prevIncome = prevTransactions
                .filter((t) => t.type === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const prevExpenses = prevTransactions
                .filter((t) => t.type === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const incomeChange = prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : 0;
            const expenseChange = prevExpenses > 0 ? ((totalExpenses - prevExpenses) / prevExpenses) * 100 : 0;

            // Category breakdown (expenses)
            const categoryMap = new Map<string, { amount: number; color: string }>();
            transactions
                .filter((t) => t.type === 'expense')
                .forEach((t) => {
                    const cat = t.categories as unknown as { name: string; color: string } | null;
                    const name = cat?.name || 'Sem categoria';
                    const color = cat?.color || '#78716c';
                    const existing = categoryMap.get(name);
                    categoryMap.set(name, {
                        amount: (existing?.amount || 0) + Number(t.amount),
                        color,
                    });
                });

            const categoryBreakdown = Array.from(categoryMap.entries())
                .map(([name, { amount, color }]) => ({ name, amount, color }))
                .sort((a, b) => b.amount - a.amount);

            // Monthly chart data
            const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const monthlyMap = new Map<string, { income: number; expense: number }>();

            for (let i = 5; i >= 0; i--) {
                const m = new Date(currentYear, currentMonth - i, 1);
                const key = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`;
                monthlyMap.set(key, { income: 0, expense: 0 });
            }

            (chartData || []).forEach((t) => {
                const d = new Date(t.date);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                const entry = monthlyMap.get(key);
                if (entry) {
                    if (t.type === 'income') entry.income += Number(t.amount);
                    else entry.expense += Number(t.amount);
                }
            });

            const monthlyData = Array.from(monthlyMap.entries()).map(([key, values]) => ({
                month: monthNames[parseInt(key.split('-')[1]) - 1],
                ...values,
            }));

            return {
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses,
                transactionCount: transactions.length,
                incomeChange: Math.round(incomeChange),
                expenseChange: Math.round(expenseChange),
                monthlyData,
                categoryBreakdown,
            };
        },
        enabled: !!user,
    });
}
