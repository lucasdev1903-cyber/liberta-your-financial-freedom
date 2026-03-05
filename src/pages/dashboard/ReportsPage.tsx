import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart3, TrendingUp, TrendingDown, PieChart as PieChartIcon, Activity,
    ArrowUpRight, ArrowDownRight, Flame, Calendar, DollarSign, Target,
    AlertTriangle, Zap, ArrowRight, Printer, Sparkles, ChevronRight, Loader2,
    CalendarDays, Layers, BarChart as ChartIcon, Radar as RadarIcon
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
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, Legend, RadarChart, Radar,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ComposedChart, Line
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];

const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatK = (v: number) => v >= 1000 ? `R$${(v / 1000).toFixed(1)}k` : `R$${v.toFixed(0)}`;

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
        const filteredTx = transactions.filter((t: any) => t.type === 'expense');
        const monthExpenses = filteredTx.reduce((s: number, t: any) => s + Number(t.amount), 0);
        return dayOfMonth > 0 ? monthExpenses / dayOfMonth : 0;
    }, [transactions]);

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

    const categoryDistribution = useMemo(() => {
        const map = new Map<string, number>();
        transactions.filter(t => t.type === 'expense').forEach(t => {
            const cat = t.category?.name || 'Geral';
            map.set(cat, (map.get(cat) || 0) + Number(t.amount));
        });
        return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    }, [transactions]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-2xl">
                    <p className="font-black text-[10px] uppercase tracking-widest text-muted-foreground/40 mb-2">{label}</p>
                    {payload.map((p: any, i: number) => (
                        <div key={i} className="flex items-center justify-between gap-6 py-1">
                            <span className="text-[11px] font-medium text-muted-foreground">{p.name}:</span>
                            <span className="font-black text-sm" style={{ color: p.color || p.fill }}>{formatCurrency(p.value)}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (statsLoading || txLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 animate-pulse">Cruzando dados de inteligência...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 page-enter pb-20">
            {/* Header with Print & Export */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight leading-tight">Auditoria & Inteligência</h1>
                    <p className="text-sm text-muted-foreground font-medium opacity-80 mt-1.5">Relatórios dinâmicos e análises preditivas do seu ecossistema financeiro.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/[0.03] border border-white/5 rounded-xl p-1 gap-1">
                        <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/5" onClick={() => window.print()}>
                            <Printer className="w-3.5 h-3.5 mr-2" /> Imprimir
                        </Button>
                    </div>

                    <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
                        <SelectTrigger className="h-11 w-[180px] rounded-xl bg-white/5 border-white/10 font-black text-[10px] uppercase tracking-widest">
                            <CalendarDays className="w-4 h-4 mr-2 text-primary" />
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                            <SelectItem value="this_month">Este Mês</SelectItem>
                            <SelectItem value="last_month">Mês Passado</SelectItem>
                            <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                            <SelectItem value="last_6_months">Últimos 6 Meses</SelectItem>
                            <SelectItem value="this_year">Este Ano</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>

            {/* Lia AI Audit Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-gradient-to-br from-primary/[0.08] to-transparent relative overflow-hidden group shadow-glow-sm flex flex-col md:flex-row items-center gap-10"
            >
                <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 relative">
                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-30" />
                </div>
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest">IA Active Audit</div>
                        <h2 className="text-xl font-black tracking-tight">Análise Executiva da Lia</h2>
                    </div>
                    <p className="text-sm text-foreground/70 font-medium leading-relaxed max-w-2xl">
                        "Seu índice de poupança subiu <span className="text-green-500 font-black">8%</span> em relação ao mês anterior, impulsionado por uma redução em alimentação fora de casa. No entanto, notei um aumento de <span className="text-red-500 font-black">12%</span> em assinaturas digitais. Quer que eu sugira quais podemos cancelar?"
                    </p>
                </div>
                <div className="flex flex-col gap-3 shrink-0">
                    <Button className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-glow-sm">Sugerir Cortes Financeiros</Button>
                    <Button variant="ghost" className="h-11 px-6 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">Relatório Completo</Button>
                </div>
            </motion.div>

            {/* Floating Tabs Navigation */}
            <div className="flex justify-center">
                <div className="flex bg-white/[0.03] backdrop-blur-xl border border-white/5 p-1 rounded-2xl shadow-2xl">
                    {[
                        { id: 'overview', label: 'Panorama', icon: Activity },
                        { id: 'spending', label: 'Gastos', icon: PieChartIcon },
                        { id: 'trends', label: 'Tendências', icon: ChartIcon },
                        { id: 'goals', label: 'Desempenho', icon: RadarIcon }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "px-6 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                                activeTab === tab.id ? "bg-primary text-primary-foreground shadow-glow-sm" : "text-muted-foreground/40 hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Contents */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="grid lg:grid-cols-2 gap-8"
                >
                    {activeTab === 'overview' && (
                        <>
                            <div className="glass-card rounded-[2.5rem] p-10 border-white/5 h-[450px]">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-10">Economia vs Gastos</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats?.dailyStats || []}>
                                        <defs>
                                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                        <XAxis dataKey="date" hide />
                                        <YAxis hide />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" name="Receita" dataKey="income" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                        <Area type="monotone" name="Despesa" dataKey="expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="glass-card rounded-[2.5rem] p-8 border-white/5 flex flex-col justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Taxa de Poupança</p>
                                    <div>
                                        <h2 className="text-5xl font-black text-primary tracking-tighter">{savingRate}%</h2>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-green-500 mt-2 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> Saudável
                                        </p>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${savingRate}%` }} />
                                    </div>
                                </div>
                                <div className="glass-card rounded-[2.5rem] p-8 border-white/5 flex flex-col justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Gasto Médio Diário</p>
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tighter">{formatCurrency(avgDailySpend)}</h2>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 mt-2">Baseado no período</p>
                                    </div>
                                    <Button variant="ghost" className="h-10 px-0 hover:bg-transparent text-[9px] font-black uppercase tracking-widest text-primary justify-start">VER POR CATEGORIA <ChevronRight className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'spending' && (
                        <>
                            <div className="glass-card rounded-[2.5rem] p-10 border-white/5 flex flex-col items-center">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-10 self-start">Concentração de Despesas</h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryDistribution}
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {categoryDistribution.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full mt-10">
                                    {categoryDistribution.slice(0, 4).map((c, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            <div className="flex-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{c.name}</p>
                                                <p className="text-xs font-black">{formatCurrency(c.value)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-card rounded-[2.5rem] p-10 border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-10">Padrão por Dia da Semana</h3>
                                <ResponsiveContainer width="100%" height="250">
                                    <BarChart data={weekdaySpending}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: 'rgba(255,255,255,0.2)' }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                                            {weekdaySpending.map((_, index) => (
                                                <Cell key={index} fill={index >= 5 ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.05)'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="mt-8 p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2"><Zap className="w-3 h-3" /> Insight Detectado</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Seus gastos dobram nas <span className="text-primary font-black">Sextas-feiras</span> devido a entretenimento e refeições fora. Considere um orçamento fixo para o final de semana.</p>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'trends' && (
                        <>
                            <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-10 border-white/5 h-[400px]">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-10">Fluxo de Caixa Mensal</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats?.categoryStats || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                        <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: 'rgba(255,255,255,0.2)' }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}

                    {activeTab === 'goals' && (
                        <>
                            <div className="lg:col-span-1 glass-card rounded-[2.5rem] p-10 border-white/5 flex flex-col items-center">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-10 self-start">Performance de Metas</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart data={goals.slice(0, 5).map(g => ({ name: g.title, progress: (g.current_amount / g.target_amount) * 100 }))}>
                                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 900, fill: 'rgba(255,255,255,0.4)' }} />
                                        <Radar name="Progresso" dataKey="progress" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={3} />
                                        <Tooltip content={<CustomTooltip />} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="lg:col-span-1 glass-card rounded-[2.5rem] p-10 border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-10">Eficiência por Categoria</h3>
                                <div className="space-y-6">
                                    {(budgets || []).slice(0, 5).map((b, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <p className="text-[10px] font-black uppercase tracking-widest">{b.category_name}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{b.percentage.toFixed(0)}% do limite</p>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(b.percentage, 100)}%` }}
                                                    className={cn("h-full", b.percentage > 90 ? "bg-red-500" : "bg-primary")}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
