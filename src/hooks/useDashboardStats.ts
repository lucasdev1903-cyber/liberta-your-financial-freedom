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
    goals: any[];
}

export type DateRange = 'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'all' | 'custom';

export function useDashboardStats(options: {
    dateRange?: DateRange;
    month?: number;
    year?: number;
    startDate?: string;
    endDate?: string;
} = {}) {
    const { user } = useAuth();
    const { dateRange = 'this_month', month, year, startDate: customStart, endDate: customEnd } = options;

    return useQuery({
        queryKey: ['dashboard-stats', user?.id, dateRange, month, year, customStart, customEnd],
        queryFn: async (): Promise<DashboardStats> => {
            if (!user) throw new Error('Not authenticated');

            const now = new Date();
            const currentMonth = month !== undefined ? month : now.getMonth();
            const currentYear = year !== undefined ? year : now.getFullYear();

            let startDate: string;
            let endDate: string;
            let prevStartDate: string;
            let prevEndDate: string;

            if (customStart && customEnd) {
                startDate = customStart;
                endDate = customEnd;
                // For comparison, get the same period length before start
                const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
                prevStartDate = new Date(new Date(startDate).getTime() - diff).toISOString().split('T')[0];
                prevEndDate = new Date(new Date(startDate).getTime() - 1).toISOString().split('T')[0];
            } else if (dateRange === 'custom' || (month !== undefined && year !== undefined)) {
                startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
                endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

                const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
                prevStartDate = prevMonthDate.toISOString().split('T')[0];
                prevEndDate = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];
            } else if (dateRange === 'this_month') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
                prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
                prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
            } else if (dateRange === 'last_month') {
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
                endDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
                prevStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().split('T')[0];
                prevEndDate = new Date(now.getFullYear(), now.getMonth() - 1, 0).toISOString().split('T')[0];
            } else if (dateRange === 'last_3_months') {
                startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().split('T')[0];
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
                prevStartDate = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().split('T')[0];
                prevEndDate = new Date(now.getFullYear(), now.getMonth() - 2, 0).toISOString().split('T')[0];
            } else if (dateRange === 'this_year') {
                startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                endDate = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
                prevStartDate = new Date(now.getFullYear() - 1, 0, 1).toISOString().split('T')[0];
                prevEndDate = new Date(now.getFullYear() - 1, 11, 31).toISOString().split('T')[0];
            } else { // all
                startDate = new Date(2000, 0, 1).toISOString().split('T')[0];
                endDate = new Date(2100, 0, 1).toISOString().split('T')[0];
                prevStartDate = startDate;
                prevEndDate = startDate;
            }

            const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1).toISOString().split('T')[0];

            const [currentRes, prevRes, chartRes, goalsRes] = await Promise.all([
                supabase
                    .from('transactions')
                    .select('amount, type, category_id, categories(name, color)')
                    .eq('user_id', user.id)
                    .gte('date', startDate)
                    .lte('date', endDate),
                supabase
                    .from('transactions')
                    .select('amount, type')
                    .eq('user_id', user.id)
                    .gte('date', prevStartDate)
                    .lte('date', prevEndDate),
                supabase
                    .from('transactions')
                    .select('amount, type, date')
                    .eq('user_id', user.id)
                    .gte('date', sixMonthsAgo)
                    .lte('date', endDate),
                supabase
                    .from('goals')
                    .select('*')
                    .eq('user_id', user.id)
            ]);

            const transactions = (currentRes.data || []) as any[];
            const prevTransactions = (prevRes.data || []) as any[];
            const chartTransactions = (chartRes.data || []) as any[];
            const goals = (goalsRes.data || []) as any[];

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

            chartTransactions.forEach((t) => {
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
                goals
            };
        },
        enabled: !!user,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
}
