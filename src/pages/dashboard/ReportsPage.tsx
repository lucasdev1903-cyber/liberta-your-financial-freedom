import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useTransactions } from "@/hooks/useTransactions";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";
import { cn } from "@/lib/utils";

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

import { useDashboardFilters } from "@/contexts/DashboardFiltersContext";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";

export function ReportsPage() {
    const { filters } = useDashboardFilters();
    const { data: stats, isLoading } = useDashboardStats({
        dateRange: filters.mode === 'month' ? 'custom' : (filters.mode === 'all' ? 'all' : 'custom'),
        month: filters.month,
        year: filters.year,
        startDate: filters.startDate,
        endDate: filters.endDate
    });
    const { transactions } = useTransactions({
        month: filters.month,
        year: filters.year,
        startDate: filters.startDate,
        endDate: filters.endDate,
        dateRange: filters.mode === 'all' ? 'all' : undefined
    });

    const savingRate = useMemo(() => {
        if (!stats || stats.totalIncome === 0) return 0;
        return Math.round(((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) * 100);
    }, [stats]);

    const topExpenses = useMemo(() => {
        if (!stats) return [];
        return stats.categoryBreakdown.slice(0, 5);
    }, [stats]);

    const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-16 bg-secondary/10 rounded-2xl animate-pulse mb-8" />
                <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-secondary/30 rounded-xl animate-pulse" />)}
                </div>
                <div className="h-80 bg-secondary/30 rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <DashboardFilters />
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary" /> Relatórios
                </h1>
                <p className="text-sm text-muted-foreground">Análise completa das suas finanças</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Receitas', value: formatCurrency(stats?.totalIncome || 0), change: stats?.incomeChange || 0, color: 'text-green-500', bg: 'bg-green-500/10', icon: TrendingUp },
                    { label: 'Despesas', value: formatCurrency(stats?.totalExpenses || 0), change: stats?.expenseChange || 0, color: 'text-red-500', bg: 'bg-red-500/10', icon: TrendingDown },
                    { label: 'Saldo', value: formatCurrency(stats?.balance || 0), change: null, color: (stats?.balance || 0) >= 0 ? 'text-green-500' : 'text-red-500', bg: 'bg-primary/10', icon: Activity },
                    { label: 'Taxa de Poupança', value: `${savingRate}%`, change: null, color: savingRate >= 20 ? 'text-green-500' : savingRate >= 10 ? 'text-yellow-500' : 'text-red-500', bg: 'bg-yellow-500/10', icon: PieChartIcon },
                ].map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass rounded-xl p-4 border-border/50"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground font-bold uppercase">{card.label}</span>
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", card.bg)}>
                                <card.icon className={cn("w-4 h-4", card.color)} />
                            </div>
                        </div>
                        <p className={cn("text-xl font-black", card.color)}>{card.value}</p>
                        {card.change !== null && (
                            <div className="flex items-center gap-1 mt-1">
                                {card.change >= 0 ? <ArrowUpRight className="w-3 h-3 text-green-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                                <span className="text-[10px] text-muted-foreground font-bold">{Math.abs(card.change)}% vs mês anterior</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue vs Expenses Chart */}
                <motion.div
                    className="glass rounded-xl p-6 border-border/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-primary" /> Receitas vs Despesas (6 meses)
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.monthlyData || []}>
                                <defs>
                                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                                    formatter={(v: number) => formatCurrency(v)}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px' }} />
                                <Area type="monotone" dataKey="income" name="Receitas" stroke="#22c55e" fill="url(#incomeGrad)" strokeWidth={2} />
                                <Area type="monotone" dataKey="expense" name="Despesas" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Category Breakdown */}
                <motion.div
                    className="glass rounded-xl p-6 border-border/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <PieChartIcon className="w-4 h-4 text-primary" /> Top 5 Categorias de Gastos
                    </h3>
                    {topExpenses.length > 0 ? (
                        <div className="flex items-center gap-6">
                            <div className="w-40 h-40 shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={topExpenses}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={35}
                                            outerRadius={60}
                                            dataKey="amount"
                                            stroke="none"
                                            cornerRadius={3}
                                        >
                                            {topExpenses.map((entry, index) => (
                                                <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 space-y-2.5">
                                {topExpenses.map((cat, i) => {
                                    const total = topExpenses.reduce((s, c) => s + c.amount, 0);
                                    const pct = total > 0 ? Math.round((cat.amount / total) * 100) : 0;
                                    return (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color || COLORS[i] }} />
                                            <span className="text-xs font-semibold flex-1 truncate">{cat.name}</span>
                                            <span className="text-xs text-muted-foreground font-bold">{pct}%</span>
                                            <span className="text-xs font-bold">{formatCurrency(cat.amount)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                            Sem dados de categorias ainda.
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Monthly Comparison Bar Chart */}
            <motion.div
                className="glass rounded-xl p-6 border-border/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <h3 className="font-bold mb-4">📊 Comparativo Mensal</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.monthlyData || []} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                                formatter={(v: number) => formatCurrency(v)}
                            />
                            <Bar dataKey="income" name="Receitas" fill="#22c55e" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="expense" name="Despesas" fill="#ef4444" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
}
