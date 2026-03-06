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
    incomeCategoryBreakdown: { name: string; amount: number; color: string }[];
    cashFlowData: { date: string; balance: number }[];
    dre: {
        totalIncome: number;
        deductions: number;
        netIncome: number;
        essentialExpenses: number;
        lifestyleExpenses: number;
        operatingBalance: number;
        financialExpenses: number;
        financialIncome: number;
        savingsCapacity: number;
        essentialCommitmentRate: number;
        savingsRate: number;
    };
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

            // Category breakdown (expenses & income)
            const expenseCategoryMap = new Map<string, { amount: number; color: string }>();
            const incomeCategoryMap = new Map<string, { amount: number; color: string }>();

            transactions.forEach((t) => {
                const cat = t.categories as unknown as { name: string; color: string } | null;
                const name = cat?.name || 'Sem categoria';
                const color = cat?.color || (t.type === 'income' ? '#22c55e' : '#78716c');
                const amount = Number(t.amount);

                if (t.type === 'expense') {
                    const existing = expenseCategoryMap.get(name);
                    expenseCategoryMap.set(name, { amount: (existing?.amount || 0) + amount, color });
                } else {
                    const existing = incomeCategoryMap.get(name);
                    incomeCategoryMap.set(name, { amount: (existing?.amount || 0) + amount, color });
                }
            });

            const categoryBreakdown = Array.from(expenseCategoryMap.entries())
                .map(([name, { amount, color }]) => ({ name, amount, color }))
                .sort((a, b) => b.amount - a.amount);

            const incomeCategoryBreakdown = Array.from(incomeCategoryMap.entries())
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

            // --- DRE Pessoal (Demonstrativo de Resultados) Calculations ---
            let dreTotalIncome = 0;
            let deductions = 0;
            let essentialExpenses = 0;
            let lifestyleExpenses = 0;
            let financialExpenses = 0;
            let dreFinancialIncome = 0;

            const deducoesKeywords = ['imposto', 'taxa', 'darf', 'simples', 'iss', 'irrf', 'inss', 'dedução', 'tributo'];
            const essenciaisKeywords = ['aluguel', 'condomínio', 'condominio', 'luz', 'energia', 'água', 'agua', 'internet', 'telefone', 'celular', 'mercado', 'supermercado', 'açougue', 'padaria', 'farmácia', 'farmacia', 'saúde', 'saude', 'médico', 'medico', 'escola', 'faculdade', 'educação', 'educacao', 'transporte', 'gasolina', 'combustível', 'combustivel', 'uber', 'ônibus', 'onibus'];
            const financeirosKeywords = ['juros', 'empréstimo', 'emprestimo', 'financiamento', 'tarifa', 'iof', 'multa', 'rendimento', 'dividendo', 'investimento', 'cdb', 'selic', 'fii', 'ações', 'acoes'];

            transactions.forEach(t => {
                const amount = Number(t.amount);
                const isIncome = t.type === 'income';
                const catName = ((t.categories as any)?.name || '').toLowerCase();
                const desc = (t.description || '').toLowerCase();
                const searchStr = `${catName} ${desc}`;

                if (isIncome) {
                    if (financeirosKeywords.some(k => searchStr.includes(k))) {
                        dreFinancialIncome += amount;
                    } else {
                        dreTotalIncome += amount;
                    }
                } else {
                    if (deducoesKeywords.some(k => searchStr.includes(k))) {
                        deductions += amount;
                    } else if (financeirosKeywords.some(k => searchStr.includes(k))) {
                        financialExpenses += amount;
                    } else if (essenciaisKeywords.some(k => searchStr.includes(k))) {
                        essentialExpenses += amount;
                    } else {
                        lifestyleExpenses += amount; // Tudo que não é essencial, dedução ou financeiro, vira estilo de vida
                    }
                }
            });

            const netIncomeForDre = dreTotalIncome - deductions;
            const operatingBalance = netIncomeForDre - (essentialExpenses + lifestyleExpenses);
            const savingsCapacity = operatingBalance + dreFinancialIncome - financialExpenses;

            const dre = {
                totalIncome: dreTotalIncome,
                deductions,
                netIncome: netIncomeForDre,
                essentialExpenses,
                lifestyleExpenses,
                operatingBalance,
                financialExpenses,
                financialIncome: dreFinancialIncome,
                savingsCapacity,
                essentialCommitmentRate: netIncomeForDre > 0 ? (essentialExpenses / netIncomeForDre) * 100 : 0,
                savingsRate: netIncomeForDre > 0 ? (savingsCapacity / netIncomeForDre) * 100 : 0,
            };

            // Cash flow data
            const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            let runningBalance = 0;
            const cashFlowMap = new Map<string, number>();

            sortedTx.forEach(t => {
                const amount = Number(t.amount);
                if (t.type === 'income') runningBalance += amount;
                else runningBalance -= amount;

                // Keep the last running balance of each day
                cashFlowMap.set(t.date, runningBalance);
            });

            const cashFlowData = Array.from(cashFlowMap.entries()).map(([date, balance]) => ({
                date,
                balance
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
                incomeCategoryBreakdown,
                cashFlowData,
                dre,
                goals
            };
        },
        enabled: !!user,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 min cache
    });
}
