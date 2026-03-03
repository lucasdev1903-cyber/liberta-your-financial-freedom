import { motion } from "framer-motion";
import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Target,
    Bot,
    Trophy,
    Flame,
    Wallet
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useGamification } from "@/hooks/useGamification";
import { useAuth } from "@/contexts/AuthContext";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { FinancialScoreCard } from "@/components/dashboard/FinancialScoreCard";
import { cn } from "@/lib/utils";
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

export function OverviewPage() {
    const { user } = useAuth();
    const { data: stats, isLoading: isStatsLoading, isError: isStatsError } = useDashboardStats();
    const { profile, badges, isLoading: isGamificationLoading, isError: isGamificationError } = useGamification();

    const isLoading = isStatsLoading || isGamificationLoading;
    const isError = isStatsError || isGamificationError;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-secondary/10 rounded-xl animate-pulse flex flex-col p-5 gap-3">
                            <div className="flex justify-between">
                                <div className="w-20 h-3 bg-secondary/20 rounded-full" />
                                <div className="w-8 h-8 bg-secondary/20 rounded-lg" />
                            </div>
                            <div className="w-24 h-6 bg-secondary/20 rounded-full" />
                            <div className="w-12 h-3 bg-secondary/20 rounded-full" />
                        </div>
                    ))}
                </div>
                <div className="grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 h-80 bg-secondary/10 rounded-xl animate-pulse" />
                    <div className="lg:col-span-2 h-80 bg-secondary/10 rounded-xl animate-pulse" />
                </div>
            </div>
        );
    }

    // No error block — we fall through to show defaults gracefully

    // Default stats if none exist
    const defaultStats = {
        balance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        transactionCount: 0,
        incomeChange: 0,
        expenseChange: 0,
        monthlyData: [],
        categoryBreakdown: []
    };

    const displayStats = stats || defaultStats;

    const statCards = [
        {
            label: "Saldo Atual",
            value: displayStats.balance,
            icon: DollarSign,
            change: `${displayStats.incomeChange >= 0 ? '+' : ''}${displayStats.incomeChange}%`,
            positive: displayStats.balance >= 0
        },
        {
            label: "Receitas (Mês)",
            value: displayStats.totalIncome,
            icon: ArrowUpRight,
            change: `${displayStats.incomeChange >= 0 ? '+' : ''}${displayStats.incomeChange}%`,
            positive: true
        },
        {
            label: "Despesas (Mês)",
            value: displayStats.totalExpenses,
            icon: ArrowDownRight,
            change: `${displayStats.expenseChange >= 0 ? '+' : ''}${displayStats.expenseChange}%`,
            positive: false
        },
        {
            label: "Lançamentos (Mês)",
            value: displayStats.transactionCount,
            icon: Target,
            change: "transações",
            positive: true,
            isNumeric: true
        },
    ];

    const formatCurrency = (val: number) => {
        return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const CustomTooltipLine = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/90 border border-border p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="font-semibold mb-2">{label}</p>
                    {payload.map((entry: { color: string, name: string, value: number }, index: number) => (
                        <p key={index} className="text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-muted-foreground">{entry.name}:</span>
                            <span className="font-semibold">{formatCurrency(entry.value)}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const CustomTooltipPie = ({ active, payload }: { active?: boolean, payload?: any[] }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/90 border border-border p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
                        <span className="text-muted-foreground">{payload[0].name}:</span>
                        <span className="font-semibold">{formatCurrency(payload[0].value)}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        className="glass rounded-xl p-5 border-border/50 card-hover"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-muted-foreground">{stat.label}</span>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <stat.icon className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold mb-1">
                            {stat.isNumeric ? stat.value : formatCurrency(stat.value as number)}
                        </p>
                        <span className={`text-xs ${stat.positive ? "text-green-400" : "text-red-400"}`}>
                            {stat.change}
                        </span>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Financial Score */}
                <div className="lg:col-span-1">
                    <FinancialScoreCard />
                </div>

                {/* Chart area */}
                <motion.div
                    className="lg:col-span-2 glass-subtle rounded-xl p-6 border-border/50 card-hover shadow-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-semibold">Fluxo de Caixa (Últimos 6 meses)</h2>
                    </div>
                    <div className="h-64 mt-4 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={displayStats.monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#888' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#888' }}
                                    tickFormatter={(val) => `R$${val >= 1000 ? val / 1000 + 'k' : val}`}
                                />
                                <Tooltip content={<CustomTooltipLine />} cursor={{ fill: '#ffffff05' }} />
                                <Bar dataKey="income" name="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="expense" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Categories Breakdown */}
                <motion.div
                    className="lg:col-span-1 glass-subtle rounded-xl p-6 border-border/50 flex flex-col card-hover shadow-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="font-semibold mb-4">Despesas por Categoria</h2>
                    {displayStats.categoryBreakdown.length > 0 ? (
                        <div className="flex-1 flex flex-col justify-center items-center relative">
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={displayStats.categoryBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="amount"
                                            stroke="none"
                                        >
                                            {displayStats.categoryBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltipPie />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full mt-4 space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                {displayStats.categoryBreakdown.map((cat, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                            <span className="text-muted-foreground truncate max-w-[120px]" title={cat.name}>{cat.name}</span>
                                        </div>
                                        <span className="font-medium">{formatCurrency(cat.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-lg border-border/50 p-8 text-center bg-secondary/10">
                            <div>
                                <Wallet className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p>Sem despesas registradas no mês.</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent transactions */}
                <motion.div
                    className="lg:col-span-2 glass rounded-xl p-6 border-border/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold">Últimos Lançamentos</h2>
                        <Link to="/dashboard/transactions" className="text-xs text-primary hover:underline flex items-center gap-1">
                            Ver todos
                        </Link>
                    </div>
                    <TransactionTable limit={5} />
                </motion.div>

                {/* AI Insights */}
                <motion.div
                    className="glass rounded-xl p-6 border-primary/20 bg-primary/5 flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                            <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <h2 className="font-semibold">Insights da IA</h2>
                    </div>
                    <div className="space-y-4 flex-1">
                        {displayStats.expenseChange > 10 && (
                            <div className="bg-secondary/50 rounded-lg p-4 text-sm text-foreground leading-relaxed border border-red-500/20">
                                Seus gastos estão {displayStats.expenseChange}% maiores que o mês passado. Considere rever suas despesas.
                            </div>
                        )}
                        {displayStats.balance > 0 && displayStats.totalIncome > 0 ? (
                            <div className="bg-secondary/50 rounded-lg p-4 text-sm text-foreground leading-relaxed border border-green-500/20">
                                Ótimo mês! Você economizou {formatCurrency(displayStats.balance)}. Que tal investir parte desse valor? 🎯
                            </div>
                        ) : (
                            <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed italic">
                                Adicione seus primeiros lançamentos para receber insights personalizados da Lia.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Achievements Section */}
            <motion.div
                className="glass rounded-xl p-6 border-border/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <h2 className="font-semibold">Minhas Conquistas</h2>
                    </div>
                    {profile?.longest_streak && (
                        <span className="text-xs text-muted-foreground">
                            Recorde de Ofensiva: <strong>{profile.longest_streak} dias</strong> 🔥
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {badges.map((badge) => {
                        const details = {
                            streak_3: { label: "3 Dias Seguidos", icon: Flame, color: "text-orange-500" },
                            streak_7: { label: "1 Semana de Foco", icon: Flame, color: "text-orange-600" },
                            streak_30: { label: "Mês Imbatível", icon: Flame, color: "text-orange-700" },
                            first_entry: { label: "Primeiro Passo", icon: Target, color: "text-blue-500" },
                            saving_master: { label: "Mestre da Economia", icon: Trophy, color: "text-yellow-500" },
                        }[badge.badge_type] || { label: badge.badge_type, icon: Trophy, color: "text-muted-foreground" };

                        return (
                            <div key={badge.id} className="flex flex-col items-center p-4 rounded-2xl bg-secondary/20 border border-border/50 hover:border-primary/30 transition-all group">
                                <div className={cn("w-12 h-12 rounded-full mb-3 flex items-center justify-center bg-background shadow-glow-sm group-hover:scale-110 transition-transform", details.color)}>
                                    <details.icon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-bold text-center uppercase tracking-wider">{details.label}</span>
                                <span className="text-[8px] text-muted-foreground mt-1">
                                    {new Date(badge.achieved_at).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        );
                    })}
                    {badges.length === 0 && (
                        <div className="col-span-full py-8 text-center text-muted-foreground text-sm border border-dashed rounded-xl border-border/50">
                            Continue usando o Liberta para desbloquear novas medalhas! 🚀
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
