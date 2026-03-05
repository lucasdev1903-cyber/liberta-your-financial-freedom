import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart3, TrendingUp, TrendingDown, PieChart as PieChartIcon, Activity,
    ArrowUpRight, ArrowDownRight, Flame, Calendar, DollarSign, Target,
    AlertTriangle, Zap, ArrowRight
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useTransactions, TransactionWithCategory } from "@/hooks/useTransactions";
import { useBudgets } from "@/hooks/useBudgets";
import { useGoals } from "@/hooks/useGoals";
import { DateRange as DateRangeType } from "@/hooks/useDashboardStats";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Sparkles, Printer } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, Legend, RadarChart, Radar,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ComposedChart, Line, Treemap
} from "recharts";
import { cn } from "@/lib/utils";

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];

const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatK = (v: number) => v >= 1000 ? `R$${(v / 1000).toFixed(1)}k` : `R$${v.toFixed(0)}`;

const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '12px',
    fontSize: '11px',
    padding: '8px 12px',
};

export function ReportsPage() {
    const [dateRange, setDateRange] = useState<DateRangeType>('this_month');
    const { data: stats, isLoading: statsLoading } = useDashboardStats(dateRange);
    const { transactions, isLoading: txLoading } = useTransactions({ dateRange });
    const { budgets } = useBudgets();
    const { goals } = useGoals();
    const [activeTab, setActiveTab] = useState<'overview' | 'spending' | 'trends' | 'goals'>('overview');

    // ═══════════════ COMPUTED ANALYTICS ═══════════════

    const savingRate = useMemo(() => {
        if (!stats || stats.totalIncome === 0) return 0;
        return Math.round(((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) * 100);
    }, [stats]);

    const avgDailySpend = useMemo(() => {
        if (!transactions.length) return 0;
        const now = new Date();
        const dayOfMonth = now.getDate();
        const monthExpenses = transactions
            .filter((t: any) => {
                const d = new Date(t.date);
                return t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            })
            .reduce((s: number, t: any) => s + Number(t.amount), 0);
        return dayOfMonth > 0 ? monthExpenses / dayOfMonth : 0;
    }, [transactions]);

    const projectedMonthEnd = useMemo(() => {
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        return avgDailySpend * daysInMonth;
    }, [avgDailySpend]);

    // Day-of-week spending pattern
    const weekdaySpending = useMemo(() => {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const dayMap = new Map<number, { total: number; count: number }>();
        days.forEach((_, i) => dayMap.set(i, { total: 0, count: 0 }));

        transactions.filter((t: any) => t.type === 'expense').forEach((t: any) => {
            const d = new Date(t.date).getDay();
            const entry = dayMap.get(d)!;
            entry.total += Number(t.amount);
            entry.count += 1;
        });

        return days.map((name, i) => {
            const entry = dayMap.get(i)!;
            return { name, total: Math.round(entry.total), avg: entry.count > 0 ? Math.round(entry.total / entry.count) : 0 };
        });
    }, [transactions]);

    // Top 5 biggest single expenses
    const topExpenses = useMemo(() => {
        return [...transactions]
            .filter((t: any) => t.type === 'expense')
            .sort((a: any, b: any) => Number(b.amount) - Number(a.amount))
            .slice(0, 5)
            .map((t: any) => ({
                description: t.description || 'Sem descrição',
                amount: Number(t.amount),
                date: new Date(t.date).toLocaleDateString('pt-BR'),
                category: t.categories?.name || 'Outros',
                color: t.categories?.color || '#78716c',
            }));
    }, [transactions]);

    // Category treemap data
    const categoryTreemap = useMemo(() => {
        if (!stats?.categoryBreakdown?.length) return [];
        return stats.categoryBreakdown.map((c, i) => ({
            name: c.name,
            size: c.amount,
            fill: c.color || COLORS[i % COLORS.length],
        }));
    }, [stats]);

    // Budget radar data
    const budgetRadar = useMemo(() => {
        if (!budgets.length) return [];
        return budgets.map(b => ({
            category: b.categories?.name || 'Cat',
            utilizado: Math.min(Math.round((b.spent / b.amount_limit) * 100), 100),
            limite: 100,
        }));
    }, [budgets]);

    // Cumulative cashflow
    const cumulativeCashflow = useMemo(() => {
        if (!stats?.monthlyData?.length) return [];
        let cumulative = 0;
        return stats.monthlyData.map(m => {
            cumulative += (m.income - m.expense);
            return { month: m.month, income: m.income, expense: m.expense, cashflow: cumulative };
        });
    }, [stats]);

    // Goal progress summary
    const goalsSummary = useMemo(() => {
        if (!goals?.length) return { total: 0, completed: 0, inProgress: 0, totalTarget: 0, totalCurrent: 0 };
        const completed = goals.filter((g: any) => g.current_amount >= g.target_amount).length;
        return {
            total: goals.length,
            completed,
            inProgress: goals.length - completed,
            totalTarget: goals.reduce((s: number, g: any) => s + Number(g.target_amount), 0),
            totalCurrent: goals.reduce((s: number, g: any) => s + Number(g.current_amount), 0),
        };
    }, [goals]);

    // Expense concentration (Pareto)
    const paretoData = useMemo(() => {
        if (!stats?.categoryBreakdown?.length) return [];
        const total = stats.categoryBreakdown.reduce((s, c) => s + c.amount, 0);
        let cumPct = 0;
        return stats.categoryBreakdown.map((c, i) => {
            cumPct += (c.amount / total) * 100;
            return { name: c.name, amount: c.amount, cumulative: Math.round(cumPct), fill: c.color || COLORS[i] };
        });
    }, [stats]);

    // Waterfall data
    const waterfallData = useMemo(() => {
        if (!stats) return [];
        return [
            { name: 'Receitas', value: stats.totalIncome, fill: '#22c55e' },
            { name: 'Despesas', value: -stats.totalExpenses, fill: '#ef4444' },
            { name: 'Saldo', value: stats.totalIncome - stats.totalExpenses, fill: (stats.totalIncome - stats.totalExpenses) >= 0 ? '#6366f1' : '#f59e0b' }
        ];
    }, [stats]);

    // Lia AI Insights
    const liaInsights = useMemo(() => {
        if (!stats || stats.totalIncome === 0) return "Ainda não tenho dados suficientes no período selecionado para gerar insights precisos. Registre suas receitas e despesas para começarmos!";

        let insight = `Neste período, você movimentou R$ ${stats.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em receitas e R$ ${stats.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em despesas. `;

        if (savingRate >= 20) {
            insight += "Excelente trabalho! Você está poupando uma ótima margem de segurança. Continue mantendo esse padrão para acelerar sua liberdade financeira.";
        } else if (savingRate > 0) {
            insight += "Você fechou no azul, mas sua taxa de poupança ainda tem espaço para crescer. Tente reduzir gastos de categorias secundárias no seu Pareto.";
        } else {
            insight += "Atenção: Você gastou mais do que ganhou neste período! Revise urgentemente seus maiores gastos na aba de Análise para reequilibrar o orçamento.";
        }
        return insight;
    }, [stats, savingRate]);

    const isLoading = statsLoading || txLoading;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-secondary/30 rounded animate-pulse" />
                <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-secondary/30 rounded-xl animate-pulse" />)}
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {[1, 2].map(i => <div key={i} className="h-72 bg-secondary/30 rounded-xl animate-pulse" />)}
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview' as const, label: 'Visão Geral', icon: BarChart3 },
        { id: 'spending' as const, label: 'Análise de Gastos', icon: PieChartIcon },
        { id: 'trends' as const, label: 'Tendências', icon: TrendingUp },
        { id: 'goals' as const, label: 'Metas & Orçamentos', icon: Target },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-primary" /> Relatórios & Análises
                    </h1>
                    <p className="text-sm text-muted-foreground">Insights avançados sobre suas finanças</p>
                </div>

                {/* Global Filters */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.print()}
                        className="h-10 px-3 bg-secondary/50 hover:bg-secondary rounded-lg transition-colors border border-border/50 hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Exportar PDF</span>
                    </button>
                    <Select value={dateRange} onValueChange={(val) => setDateRange(val as DateRangeType)}>
                        <SelectTrigger className="w-[160px] sm:w-[180px] bg-background">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this_month">Este Mês</SelectItem>
                            <SelectItem value="last_month">Mês Passado</SelectItem>
                            <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                            <SelectItem value="this_year">Este Ano</SelectItem>
                            <SelectItem value="all">Todo o Período</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-secondary/20 rounded-xl p-1 border border-border/50 overflow-x-auto overflow-y-hidden pb-1 snap-x scrollbar-hide w-full max-w-full">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 justify-center whitespace-nowrap snap-start shrink-0",
                            activeTab === tab.id
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        )}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* ═══════════════ TAB: OVERVIEW ═══════════════ */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Receitas', value: formatCurrency(stats?.totalIncome || 0), change: stats?.incomeChange || 0, icon: TrendingUp, color: 'text-green-500', bg: 'from-green-500/10 to-emerald-500/5' },
                            { label: 'Despesas', value: formatCurrency(stats?.totalExpenses || 0), change: stats?.expenseChange || 0, icon: TrendingDown, color: 'text-red-500', bg: 'from-red-500/10 to-rose-500/5' },
                            { label: 'Taxa de Poupança', value: `${savingRate}%`, change: null, icon: DollarSign, color: savingRate >= 20 ? 'text-green-500' : savingRate >= 10 ? 'text-yellow-500' : 'text-red-500', bg: 'from-blue-500/10 to-indigo-500/5' },
                            { label: 'Gasto Médio/Dia', value: formatCurrency(avgDailySpend), change: null, icon: Flame, color: 'text-orange-500', bg: 'from-orange-500/10 to-amber-500/5' },
                        ].map((card, i) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className={cn("glass rounded-xl p-5 border-border/50 bg-gradient-to-br", card.bg)}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{card.label}</span>
                                    <card.icon className={cn("w-4 h-4", card.color)} />
                                </div>
                                <p className={cn("text-2xl font-black", card.color)}>{card.value}</p>
                                {card.change !== null && (
                                    <div className="flex items-center gap-1 mt-2">
                                        {card.change >= 0 ? <ArrowUpRight className="w-3 h-3 text-green-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                                        <span className="text-[10px] text-muted-foreground font-bold">{Math.abs(card.change)}% vs mês anterior</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Lia AI Insights */}
                    <motion.div className="glass rounded-xl p-5 border-border/50 relative overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shrink-0 shadow-lg shadow-primary/20">
                                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">Lia <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">AI Insight</span></h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{liaInsights}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Cashflow Evolution (Composed Chart) */}
                    <motion.div className="glass rounded-xl p-4 sm:p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h3 className="font-bold mb-1 flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Fluxo de Caixa Acumulado</h3>
                        <p className="text-xs text-muted-foreground mb-4">Receitas, despesas e saldo acumulado dos últimos 6 meses</p>
                        <div className="h-64 sm:h-72 w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={cumulativeCashflow}>
                                    <defs>
                                        <linearGradient id="cashflowGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatK} />
                                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                                    <Bar dataKey="income" name="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} opacity={0.8} />
                                    <Bar dataKey="expense" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.8} />
                                    <Area type="monotone" dataKey="cashflow" name="Saldo Acumulado" stroke="#6366f1" fill="url(#cashflowGrad)" strokeWidth={2.5} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Projection Card */}
                    <motion.div className="glass rounded-xl p-6 border-border/50 bg-gradient-to-r from-orange-500/5 to-red-500/5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold flex items-center gap-2 mb-1"><Flame className="w-4 h-4 text-orange-500" /> Projeção de Gastos</h3>
                                <p className="text-xs text-muted-foreground">Baseado no seu ritmo atual de gastos este mês</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-orange-500">{formatCurrency(projectedMonthEnd)}</p>
                                <p className="text-[10px] text-muted-foreground">estimativa até o fim do mês</p>
                            </div>
                        </div>
                        {stats && projectedMonthEnd > stats.totalIncome && stats.totalIncome > 0 && (
                            <div className="mt-3 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                                <span className="text-xs text-red-500 font-bold">⚠️ Alerta: projeção de gastos supera sua receita em {formatCurrency(projectedMonthEnd - stats.totalIncome)}</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {/* ═══════════════ TAB: SPENDING ═══════════════ */}
            {activeTab === 'spending' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pareto (Category Concentration) */}
                        <motion.div className="glass rounded-xl p-4 sm:p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h3 className="font-bold mb-1 flex items-center gap-2"><PieChartIcon className="w-4 h-4 text-primary" /> Concentração de Gastos (Pareto)</h3>
                            <p className="text-xs text-muted-foreground mb-4">Quais categorias concentram a maior parte dos seus gastos</p>
                            {paretoData.length > 0 ? (
                                <div className="h-64 sm:h-72 w-full min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={paretoData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                                            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatK} />
                                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v}%`} />
                                            <Tooltip contentStyle={tooltipStyle} />
                                            <Bar yAxisId="left" dataKey="amount" name="Valor" radius={[4, 4, 0, 0]}>
                                                {paretoData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                            </Bar>
                                            <Line yAxisId="right" type="monotone" dataKey="cumulative" name="% Acumulado" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 3 }} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : <p className="text-sm text-muted-foreground text-center py-12">Sem dados suficientes.</p>}
                        </motion.div>

                        {/* Category Treemap */}
                        <motion.div className="glass rounded-xl p-4 sm:p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <h3 className="font-bold mb-1 flex items-center gap-2"><PieChartIcon className="w-4 h-4 text-primary" /> Mapa de Categorias</h3>
                            <p className="text-xs text-muted-foreground mb-4">Proporção visual dos seus gastos por categoria</p>
                            {categoryTreemap.length > 0 ? (
                                <div className="h-64 sm:h-72 w-full min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <Treemap
                                            data={categoryTreemap}
                                            dataKey="size"
                                            aspectRatio={4 / 3}
                                            stroke="hsl(var(--background))"
                                            content={((props: any) => {
                                                const { x, y, width, height, name, fill } = props;
                                                if (width < 40 || height < 30) return null;
                                                return (
                                                    <g>
                                                        <rect x={x} y={y} width={width} height={height} fill={fill} rx={6} opacity={0.85} />
                                                        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={width > 80 ? 11 : 9} fontWeight="bold">
                                                            {name}
                                                        </text>
                                                    </g>
                                                );
                                            }) as any}
                                        />
                                    </ResponsiveContainer>
                                </div>
                            ) : <p className="text-sm text-muted-foreground text-center py-12">Sem dados suficientes.</p>}
                        </motion.div>
                    </div>

                    {/* Day-of-Week Pattern */}
                    <motion.div className="glass rounded-xl p-4 sm:p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h3 className="font-bold mb-1 flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Padrão de Gastos por Dia da Semana</h3>
                        <p className="text-xs text-muted-foreground mb-4">Em quais dias você tende a gastar mais</p>
                        <div className="h-48 sm:h-56 w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weekdaySpending}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatK} />
                                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                                    <Bar dataKey="total" name="Total gasto" radius={[6, 6, 0, 0]}>
                                        {weekdaySpending.map((entry, i) => {
                                            const max = Math.max(...weekdaySpending.map(d => d.total));
                                            const intensity = max > 0 ? entry.total / max : 0;
                                            return <Cell key={i} fill={intensity > 0.7 ? '#ef4444' : intensity > 0.4 ? '#f59e0b' : '#22c55e'} />;
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Top 5 Expenses */}
                    <motion.div className="glass rounded-xl p-4 sm:p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h3 className="font-bold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Top 5 Maiores Despesas</h3>
                        {topExpenses.length > 0 ? (
                            <div className="space-y-3">
                                {topExpenses.map((tx, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/10 border border-border/30 hover:border-primary/20 transition-all">
                                        <span className="text-lg font-black text-muted-foreground w-6 text-center">{i + 1}</span>
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tx.color }} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{tx.description}</p>
                                            <p className="text-[10px] text-muted-foreground">{tx.category} • {tx.date}</p>
                                        </div>
                                        <span className="text-sm font-black text-red-500">{formatCurrency(tx.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-sm text-muted-foreground text-center py-8">Nenhuma despesa registrada ainda.</p>}
                    </motion.div>
                </div>
            )}

            {/* ═══════════════ TAB: TRENDS ═══════════════ */}
            {activeTab === 'trends' && (
                <div className="space-y-6">
                    {/* Revenue vs Expense Area Chart */}
                    <motion.div className="glass rounded-xl p-4 sm:p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="font-bold mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Evolução Receitas vs Despesas</h3>
                        <p className="text-xs text-muted-foreground mb-4">Comparação mensal dos últimos 6 meses</p>
                        <div className="h-64 sm:h-72 w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.monthlyData || []}>
                                    <defs>
                                        <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatK} />
                                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                                    <Area type="monotone" dataKey="income" name="Receitas" stroke="#22c55e" fill="url(#incG)" strokeWidth={2.5} />
                                    <Area type="monotone" dataKey="expense" name="Despesas" stroke="#ef4444" fill="url(#expG)" strokeWidth={2.5} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Cashflow Waterfall Chart */}
                    <motion.div className="glass rounded-xl p-4 sm:p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <h3 className="font-bold mb-1 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> Diagrama de Fluxo de Caixa (Waterfall)</h3>
                        <p className="text-xs text-muted-foreground mb-4">Entradas, saídas e saldo do período selecionado</p>
                        <div className="h-64 sm:h-72 w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatK} />
                                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(Math.abs(v))} />
                                    <Bar dataKey="value" name="Valor" radius={[6, 6, 6, 6]}>
                                        {waterfallData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Monthly Saving Rate */}
                    <motion.div className="glass rounded-xl p-4 sm:p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <h3 className="font-bold mb-1 flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /> Taxa de Poupança Mensal</h3>
                        <p className="text-xs text-muted-foreground mb-4">Quanto você poupou em relação à receita a cada mês</p>
                        <div className="h-48 sm:h-56 w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={(stats?.monthlyData || []).map(m => ({
                                    month: m.month,
                                    rate: m.income > 0 ? Math.round(((m.income - m.expense) / m.income) * 100) : 0,
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis domain={[-50, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v}%`} />
                                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                                    <Bar dataKey="rate" name="Taxa de Poupança" radius={[6, 6, 0, 0]}>
                                        {(stats?.monthlyData || []).map((m, i) => {
                                            const rate = m.income > 0 ? ((m.income - m.expense) / m.income) * 100 : 0;
                                            return <Cell key={i} fill={rate >= 20 ? '#22c55e' : rate >= 0 ? '#f59e0b' : '#ef4444'} />;
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> ≥ 20% (Excelente)</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> 0-19% (Regular)</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Negativo</span>
                        </div>
                    </motion.div>

                    {/* Monthly Comparison */}
                    <motion.div className="glass rounded-xl p-4 sm:p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h3 className="font-bold mb-4">📊 Comparativo Mensal</h3>
                        <div className="h-48 sm:h-56 w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.monthlyData || []} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={formatK} />
                                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                                    <Bar dataKey="income" name="Receitas" fill="#22c55e" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="expense" name="Despesas" fill="#ef4444" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* ═══════════════ TAB: GOALS & BUDGETS ═══════════════ */}
            {activeTab === 'goals' && (
                <div className="space-y-6">
                    {/* Budget Radar */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <motion.div className="glass rounded-xl p-4 sm:p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h3 className="font-bold mb-1 flex items-center gap-2"><PieChartIcon className="w-4 h-4 text-primary" /> Radar de Orçamentos</h3>
                            <p className="text-xs text-muted-foreground mb-4">Utilização dos seus limites por categoria</p>
                            {budgetRadar.length > 0 ? (
                                <div className="h-64 sm:h-72 w-full min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={budgetRadar}>
                                            <PolarGrid stroke="hsl(var(--border) / 0.5)" />
                                            <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                                            <Radar name="Utilizado %" dataKey="utilizado" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
                                            <Radar name="Limite" dataKey="limite" stroke="#ef4444" fill="none" strokeWidth={1} strokeDasharray="4 4" />
                                            <Tooltip contentStyle={tooltipStyle} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <PieChartIcon className="w-8 h-8 mb-2 opacity-30" />
                                    <p className="text-sm">Crie orçamentos para ver o radar.</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Goals Summary */}
                        <motion.div className="glass rounded-xl p-4 sm:p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <h3 className="font-bold mb-1 flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Resumo de Metas</h3>
                            <p className="text-xs text-muted-foreground mb-6">Progresso geral das suas metas financeiras</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-secondary/20 rounded-xl p-4 text-center border border-border/30">
                                    <p className="text-3xl font-black text-primary">{goalsSummary.total}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Total de Metas</p>
                                </div>
                                <div className="bg-green-500/10 rounded-xl p-4 text-center border border-green-500/20">
                                    <p className="text-3xl font-black text-green-500">{goalsSummary.completed}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Conquistadas 🏆</p>
                                </div>
                            </div>

                            {goalsSummary.totalTarget > 0 && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-semibold">Progresso Global</span>
                                        <span className="font-bold text-primary">{Math.round((goalsSummary.totalCurrent / goalsSummary.totalTarget) * 100)}%</span>
                                    </div>
                                    <div className="relative h-4 bg-secondary/50 rounded-full overflow-hidden">
                                        <motion.div
                                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-green-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, (goalsSummary.totalCurrent / goalsSummary.totalTarget) * 100)}%` }}
                                            transition={{ duration: 1.5, ease: 'easeOut' }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-muted-foreground">
                                        <span>Guardado: {formatCurrency(goalsSummary.totalCurrent)}</span>
                                        <span>Objetivo: {formatCurrency(goalsSummary.totalTarget)}</span>
                                    </div>
                                </div>
                            )}

                            {goalsSummary.total === 0 && (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                    <Target className="w-8 h-8 mb-2 opacity-30" />
                                    <p className="text-sm">Crie metas para ver o resumo.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Budget Details List */}
                    {budgets.length > 0 && (
                        <motion.div className="glass rounded-xl p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <h3 className="font-bold mb-4">📋 Detalhamento de Orçamentos</h3>
                            <div className="space-y-3">
                                {budgets.map((b, i) => {
                                    const pct = b.amount_limit > 0 ? Math.round((b.spent / b.amount_limit) * 100) : 0;
                                    return (
                                        <div key={b.id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/10 border border-border/30">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.categories?.color || COLORS[i] }} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold">{b.categories?.name || 'Categoria'}</p>
                                                <div className="relative h-2 bg-secondary/50 rounded-full overflow-hidden mt-1">
                                                    <div
                                                        className={cn("absolute inset-y-0 left-0 rounded-full transition-all",
                                                            pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                                        )}
                                                        style={{ width: `${Math.min(pct, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-black">{formatCurrency(b.spent)} <span className="text-muted-foreground font-normal">/ {formatCurrency(b.amount_limit)}</span></p>
                                                <p className={cn("text-[10px] font-bold", pct >= 90 ? 'text-red-500' : pct >= 70 ? 'text-yellow-500' : 'text-green-500')}>
                                                    {pct}% utilizado
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Goals Individual Progress */}
                    {goals && goals.length > 0 && (
                        <motion.div className="glass rounded-xl p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h3 className="font-bold mb-4">🎯 Progresso Individual das Metas</h3>
                            <div className="space-y-3">
                                {goals.map((g: any, i: number) => {
                                    const pct = Math.min(100, Math.round((g.current_amount / g.target_amount) * 100));
                                    return (
                                        <div key={g.id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/10 border border-border/30">
                                            <span className="text-xl">{pct >= 100 ? '🏆' : '🎯'}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate">{g.title}</p>
                                                <div className="relative h-2 bg-secondary/50 rounded-full overflow-hidden mt-1">
                                                    <motion.div
                                                        className={cn("absolute inset-y-0 left-0 rounded-full",
                                                            pct >= 100 ? 'bg-green-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-primary'
                                                        )}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-black">{pct}%</p>
                                                <p className="text-[10px] text-muted-foreground">{formatCurrency(g.current_amount)} / {formatCurrency(g.target_amount)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
