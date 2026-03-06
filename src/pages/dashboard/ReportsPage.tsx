import { useMemo } from "react";
import { motion } from "framer-motion";
import {
    BarChart3, TrendingUp, TrendingDown, PieChart as PieChartIcon,
    ArrowUpRight, ArrowDownRight, Activity, Download, FileText, Table as TableIcon, LineChart as LineChartIcon,
    Calculator, Percent
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useTransactions } from "@/hooks/useTransactions";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, Legend, LineChart, Line
} from "recharts";
import { cn } from "@/lib/utils";
import { useDashboardFilters } from "@/contexts/DashboardFiltersContext";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#84cc16'];

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

    const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handleExportPDF = () => {
        if (transactions && stats) {
            exportToPDF(transactions, stats as any);
        }
    };

    const handleExportExcel = () => {
        if (transactions) {
            exportToExcel(transactions);
        }
    };

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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-primary" /> Relatórios Avançados
                    </h1>
                    <p className="text-sm text-muted-foreground">Análise profunda e exportação de dados</p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="hero" className="shadow-glow-sm">
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Relatório
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-strong border-border/50">
                        <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer gap-2">
                            <FileText className="w-4 h-4 text-red-500" /> PDF (.pdf)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer gap-2">
                            <TableIcon className="w-4 h-4 text-green-500" /> Excel (.xlsx)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="glass-subtle border-border/40 p-1.5 rounded-2xl">
                    <TabsTrigger value="overview" className="rounded-xl px-4 sm:px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Visão Geral</TabsTrigger>
                    <TabsTrigger value="categories" className="rounded-xl px-4 sm:px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Categorias</TabsTrigger>
                    <TabsTrigger value="projections" className="rounded-xl px-4 sm:px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Evolução</TabsTrigger>
                    <TabsTrigger value="dre" className="rounded-xl px-4 sm:px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">DRE</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-0">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Receitas', value: formatCurrency(stats?.totalIncome || 0), change: stats?.incomeChange || 0, color: 'text-green-500', bg: 'bg-green-500/10', icon: TrendingUp },
                            { label: 'Despesas', value: formatCurrency(stats?.totalExpenses || 0), change: stats?.expenseChange || 0, color: 'text-red-500', bg: 'bg-red-500/10', icon: TrendingDown },
                            { label: 'Saldo', value: formatCurrency(stats?.balance || 0), change: null, color: (stats?.balance || 0) >= 0 ? 'text-green-500' : 'text-red-500', bg: 'bg-primary/10', icon: Activity },
                            { label: 'Taxa de Poupança', value: `${savingRate}% `, change: null, color: savingRate >= 20 ? 'text-green-500' : savingRate >= 10 ? 'text-yellow-500' : 'text-red-500', bg: 'bg-yellow-500/10', icon: PieChartIcon },
                        ].map((card, i) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-strong rounded-[2rem] p-5 border-border/40 card-hover"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{card.label}</span>
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.bg)}>
                                        <card.icon className={cn("w-5 h-5", card.color)} />
                                    </div>
                                </div>
                                <p className={cn("text-2xl font-black tracking-tight", card.color)}>{card.value}</p>
                                {card.change !== null && (
                                    <div className="flex items-center gap-1.5 mt-2">
                                        {card.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 text-green-500" /> : <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
                                        <span className="text-xs text-muted-foreground font-bold">{Math.abs(card.change)}% vs mês anterior</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <motion.div
                            className="glass-strong rounded-[2rem] p-6 border-border/40"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                                <BarChart3 className="w-5 h-5 text-primary" /> Receitas vs Despesas (6 meses)
                            </h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats?.monthlyData || []}>
                                        <defs>
                                            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.2)" vertical={false} />
                                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)} k`} axisLine={false} tickLine={false} />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '16px', fontSize: '13px', padding: '12px' }}
                                            formatter={(v: number) => [formatCurrency(v), ""]}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
                                        <Area type="monotone" dataKey="income" name="Receitas" stroke="#22c55e" fill="url(#incomeGrad)" strokeWidth={3} activeDot={{ r: 6 }} />
                                        <Area type="monotone" dataKey="expense" name="Despesas" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={3} activeDot={{ r: 6 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <motion.div
                            className="glass-strong rounded-[2rem] p-6 border-border/40"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="font-bold mb-6 text-lg">📊 Comparativo Rápido</h3>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats?.monthlyData || []} barGap={4}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.2)" vertical={false} />
                                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)} k`} axisLine={false} tickLine={false} />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '16px', fontSize: '13px', padding: '12px' }}
                                            formatter={(v: number) => [formatCurrency(v), ""]}
                                        />
                                        <Bar dataKey="income" name="Receitas" fill="#22c55e" radius={[6, 6, 0, 0]} maxBarSize={40} />
                                        <Bar dataKey="expense" name="Despesas" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-6 mt-0">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Expense Categories */}
                        <motion.div className="glass-strong rounded-[2rem] p-6 border-border/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                                <PieChartIcon className="w-5 h-5 text-red-500" /> Despesas por Categoria
                            </h3>
                            {stats && stats.categoryBreakdown.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={stats.categoryBreakdown}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={80}
                                                    dataKey="amount"
                                                    stroke="hsl(var(--card))"
                                                    strokeWidth={2}
                                                    cornerRadius={6}
                                                >
                                                    {stats.categoryBreakdown.map((entry, index) => (
                                                        <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    formatter={(v: number) => formatCurrency(v)}
                                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-3">
                                        {stats.categoryBreakdown.map((cat, i) => {
                                            const total = stats.categoryBreakdown.reduce((s, c) => s + c.amount, 0);
                                            const pct = total > 0 ? Math.round((cat.amount / total) * 100) : 0;
                                            return (
                                                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/30 transition-colors">
                                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color || COLORS[i] }} />
                                                    <span className="text-sm font-semibold flex-1 truncate">{cat.name}</span>
                                                    <span className="text-xs text-muted-foreground font-bold">{pct}%</span>
                                                    <span className="text-sm font-black">{formatCurrency(cat.amount)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Sem dados de despesas.</div>
                            )}
                        </motion.div>

                        {/* Income Categories */}
                        <motion.div className="glass-strong rounded-[2rem] p-6 border-border/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                                <PieChartIcon className="w-5 h-5 text-green-500" /> Receitas por Categoria
                            </h3>
                            {stats && stats.incomeCategoryBreakdown?.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={stats.incomeCategoryBreakdown}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={50}
                                                    outerRadius={80}
                                                    dataKey="amount"
                                                    stroke="hsl(var(--card))"
                                                    strokeWidth={2}
                                                    cornerRadius={6}
                                                >
                                                    {stats.incomeCategoryBreakdown.map((entry, index) => (
                                                        <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    formatter={(v: number) => formatCurrency(v)}
                                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-3">
                                        {stats.incomeCategoryBreakdown.map((cat, i) => {
                                            const total = stats.incomeCategoryBreakdown.reduce((s, c) => s + c.amount, 0);
                                            const pct = total > 0 ? Math.round((cat.amount / total) * 100) : 0;
                                            return (
                                                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/30 transition-colors">
                                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color || COLORS[i] }} />
                                                    <span className="text-sm font-semibold flex-1 truncate">{cat.name}</span>
                                                    <span className="text-xs text-muted-foreground font-bold">{pct}%</span>
                                                    <span className="text-sm font-black">{formatCurrency(cat.amount)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Sem dados de receitas.</div>
                            )}
                        </motion.div>
                    </div>
                </TabsContent>

                <TabsContent value="projections" className="space-y-6 mt-0">
                    <motion.div className="glass-strong rounded-[2rem] p-6 border-border/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="font-bold mb-2 flex items-center gap-2 text-lg">
                            <LineChartIcon className="w-5 h-5 text-primary" /> Fluxo de Caixa Diário
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">Evolução do seu saldo (Lançamentos somados sequencialmente neste período)</p>

                        {stats && stats.cashFlowData?.length > 0 ? (
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.cashFlowData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.2)" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                            tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                                            axisLine={false}
                                            tickLine={false}
                                            minTickGap={30}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)} k`}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '16px', fontSize: '13px', padding: '12px' }}
                                            formatter={(v: number) => [formatCurrency(v), "Saldo Corrente"]}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
                                        />
                                        <Line
                                            type="stepAfter"
                                            dataKey="balance"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={3}
                                            dot={false}
                                            activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Sem transações no período selecionado.</div>
                        )}
                    </motion.div>
                </TabsContent>

                <TabsContent value="dre" className="space-y-6 mt-0">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: 'Margem Operacional', value: `${(stats?.dre?.operatingMargin || 0).toFixed(1)}% `, icon: Activity, color: 'text-primary' },
                            { label: 'Margem Líquida', value: `${(stats?.dre?.netMargin || 0).toFixed(1)}% `, icon: Percent, color: 'text-green-500' },
                            { label: 'EBITDA (Operacional)', value: formatCurrency(stats?.dre?.ebitda || 0), icon: Calculator, color: 'text-blue-500' },
                            { label: 'Resultado Líquido', value: formatCurrency(stats?.dre?.netIncome || 0), icon: TrendingUp, color: (stats?.dre?.netIncome || 0) >= 0 ? 'text-green-500' : 'text-red-500' },
                        ].map((kpi, i) => (
                            <motion.div key={i} className="glass-strong rounded-2xl p-5 border-border/40" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                                <div className="flex items-center gap-3 mb-2">
                                    <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                                    <span className="text-xs font-bold uppercase text-muted-foreground">{kpi.label}</span>
                                </div>
                                <p className={cn("text-2xl font-black", kpi.color)}>{kpi.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div className="glass-strong rounded-[2rem] p-6 sm:p-8 border-border/40" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h3 className="font-bold mb-6 text-xl border-b border-border/40 pb-4">Demonstrativo de Resultados do Exercício (DRE)</h3>

                        {stats && stats.dre ? (
                            <div className="space-y-1 text-sm sm:text-base">
                                {/* Receita Bruta */}
                                <div className="flex justify-between p-3 rounded-lg bg-secondary/10 font-bold text-green-500">
                                    <span>(=) Receita Bruta</span>
                                    <span>{formatCurrency(stats.dre.grossRevenue)}</span>
                                </div>

                                {/* Deduções */}
                                <div className="flex justify-between p-3 pl-8 text-muted-foreground">
                                    <span>(-) Impostos e Deduções</span>
                                    <span className="text-red-400">{formatCurrency(stats.dre.taxesAndDeductions)}</span>
                                </div>

                                {/* Receita Líquida */}
                                <div className="flex justify-between p-3 rounded-lg bg-secondary/10 font-bold mt-2">
                                    <span>(=) Receita Líquida</span>
                                    <span>{formatCurrency(stats.dre.netRevenue)}</span>
                                </div>

                                {/* Custos Operacionais */}
                                <div className="flex justify-between p-3 pl-8 text-muted-foreground">
                                    <span>(-) Despesas Fixas</span>
                                    <span className="text-red-400">{formatCurrency(stats.dre.fixedCosts)}</span>
                                </div>
                                <div className="flex justify-between p-3 pl-8 text-muted-foreground">
                                    <span>(-) Despesas Variáveis</span>
                                    <span className="text-red-400">{formatCurrency(stats.dre.variableCosts)}</span>
                                </div>

                                {/* Resultado Operacional (EBITDA) */}
                                <div className="flex justify-between p-3 rounded-lg bg-secondary/10 font-bold mt-2 text-blue-500">
                                    <span>(=) Resultado Operacional (EBITDA)</span>
                                    <span>{formatCurrency(stats.dre.ebitda)}</span>
                                </div>

                                {/* Resultado Financeiro */}
                                <div className="flex justify-between p-3 pl-8 text-muted-foreground">
                                    <span>(+/-) Resultado Financeiro</span>
                                    <span className={stats.dre.financialResult >= 0 ? "text-green-400" : "text-red-400"}>
                                        {formatCurrency(stats.dre.financialResult)}
                                    </span>
                                </div>

                                {/* Resultado Líquido */}
                                <div className={cn("flex justify-between p-4 rounded-xl font-black text-lg mt-4", stats.dre.netIncome >= 0 ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20")}>
                                    <span>(=) Resultado Líquido</span>
                                    <span>{formatCurrency(stats.dre.netIncome)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">Carregando dados estruturados...</div>
                        )}
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
