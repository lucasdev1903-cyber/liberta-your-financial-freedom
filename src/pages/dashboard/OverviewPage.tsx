import { motion } from "framer-motion";
import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Target,
    Bot,
    Trophy,
    Flame,
    Wallet,
    TrendingUp,
    Zap,
    Sparkles,
    ChevronRight,
    Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useGamification } from "@/hooks/useGamification";
import { useAuth } from "@/contexts/AuthContext";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { FinancialScoreCard } from "@/components/dashboard/FinancialScoreCard";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Button } from "@/components/ui/button";

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-2xl">
                <p className="font-black text-[10px] uppercase tracking-widest text-muted-foreground/40 mb-2">{label}</p>
                {payload.map((entry: any, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-6 mb-1">
                        <span className="text-muted-foreground font-medium text-[11px] capitalize">{entry.name}:</span>
                        <span className="font-black text-sm" style={{ color: entry.color }}>{entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function OverviewPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: stats, isLoading: isStatsLoading } = useDashboardStats();
    const { profile, badges, isLoading: isGamificationLoading } = useGamification();

    const isLoading = isStatsLoading || isGamificationLoading;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center animate-pulse">
                    Consolidando inteligência financeira...
                </p>
            </div>
        );
    }

    const displayStats = stats || {
        balance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        transactionCount: 0,
        incomeChange: 0,
        expenseChange: 0,
        monthlyData: [],
        categoryBreakdown: []
    };

    const statCards = [
        {
            label: "Patrimônio Líquido",
            value: displayStats.balance,
            icon: Wallet,
            change: `${displayStats.incomeChange >= 0 ? '+' : ''}${displayStats.incomeChange}%`,
            positive: displayStats.balance >= 0,
            color: "primary"
        },
        {
            label: "Entradas (Mês)",
            value: displayStats.totalIncome,
            icon: ArrowUpRight,
            change: `${displayStats.incomeChange >= 0 ? '+' : ''}${displayStats.incomeChange}%`,
            positive: true,
            color: "green-500"
        },
        {
            label: "Saídas (Mês)",
            value: displayStats.totalExpenses,
            icon: ArrowDownRight,
            change: `${displayStats.expenseChange >= 0 ? '+' : ''}${displayStats.expenseChange}%`,
            positive: false,
            color: "red-500"
        },
        {
            label: "Saúde Financeira",
            value: 840,
            icon: Trophy,
            change: "+15 pts",
            positive: true,
            color: "primary",
            isScore: true
        }
    ];

    return (
        <div className="space-y-8 page-enter pb-20">
            {/* Stat Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-7 rounded-[2rem] border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <card.icon className="w-16 h-16" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">{card.label}</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className={cn(
                                "text-3xl font-black tracking-tighter tabular-nums mb-2",
                                card.isScore ? "text-primary text-glow" : "text-foreground"
                            )}>
                                {card.isScore ? card.value : card.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                            <span className={cn(
                                "text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1",
                                card.positive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                            )}>
                                {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {card.change}
                            </span>
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-30 italic">vs mês anterior</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* Main Evolution Chart */}
                <div className="lg:col-span-3 glass-card rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight leading-none mb-2">Resumo Mensal</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Performance de fluxos financeiros</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[8px] font-black uppercase tracking-widest opacity-60">
                                <div className="w-2 h-2 rounded-full bg-primary" /> Receitas
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[8px] font-black uppercase tracking-widest opacity-60">
                                <div className="w-2 h-2 rounded-full bg-orange-500" /> Despesas
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={displayStats.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 900, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 900, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                                <Bar dataKey="income" name="Receita" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={20} opacity={0.6} />
                                <Bar dataKey="expense" name="Despesa" fill="#f97316" radius={[6, 6, 0, 0]} barSize={20} opacity={0.6} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Score & AI Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card rounded-[2.5rem] p-6 border-white/5 h-fit overflow-hidden relative shadow-glow-sm">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <FinancialScoreCard />
                    </div>

                    {/* Quick AI Action Card */}
                    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-gradient-to-br from-primary/[0.05] to-transparent relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Sparkles className="w-12 h-12 text-primary" />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Lia AI Analysis</span>
                            </div>
                            <h3 className="text-xl font-black tracking-tight leading-tight">Sugestão de Economia: <span className="text-primary">{displayStats.balance > 0 ? 'R$ 480,00' : 'R$ 0,00'}</span></h3>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-70">
                                Detectei gastos redundantes em entretenimento. Deseja otimizar sua assinatura para economizar este mês?
                            </p>
                            <Button
                                onClick={() => navigate('/dashboard/assistant')}
                                variant="ghost"
                                className="h-10 px-0 hover:bg-transparent hover:text-primary font-black uppercase text-[10px] tracking-widest group/btn"
                            >
                                ANALISAR COM LIA <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row - Transactions & category distribution */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Distributions */}
                <div className="lg:col-span-1 glass-card rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden flex flex-col items-center justify-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-8 self-start">Distribuição de Saídas</h3>
                    <div className="h-56 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={displayStats.categoryBreakdown.length > 0 ? displayStats.categoryBreakdown : [{ name: 'Nenhum dado', value: 1 }]}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {displayStats.categoryBreakdown.map((_, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Foco do</span>
                            <span className="text-xl font-black">Mês</span>
                        </div>
                    </div>
                    <div className="w-full space-y-3 mt-8">
                        {displayStats.categoryBreakdown.slice(0, 3).map((cat: any, i: number) => (
                            <div key={i} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="opacity-60">{cat.name}</span>
                                </div>
                                <span className="text-foreground">{((cat.value / (displayStats.totalExpenses || 1)) * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-1">Movimentações</h3>
                            <h2 className="text-xl font-black tracking-tight">Fluxo Recente</h2>
                        </div>
                        <Link to="/dashboard/transactions">
                            <Button variant="ghost" className="h-10 px-5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10">
                                VER TODAS <ChevronRight className="w-3 h-3 ml-2" />
                            </Button>
                        </Link>
                    </div>
                    <TransactionTable />
                </div>
            </div>
        </div>
    );
}
