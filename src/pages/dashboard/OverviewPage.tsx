import { motion } from "framer-motion";
import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Target,
    Bot
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAuth } from "@/contexts/AuthContext";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
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
    const { data: stats, isLoading } = useDashboardStats();

    if (isLoading || !stats) {
        return (
            <div className="space-y-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-secondary/20 rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 h-80 bg-secondary/20 rounded-xl animate-pulse" />
                    <div className="lg:col-span-2 h-80 bg-secondary/20 rounded-xl animate-pulse" />
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: "Saldo Atual",
            value: stats.balance,
            icon: DollarSign,
            change: `${stats.incomeChange >= 0 ? '+' : ''}${stats.incomeChange}%`,
            positive: stats.balance >= 0
        },
        {
            label: "Receitas (Mês)",
            value: stats.totalIncome,
            icon: ArrowUpRight,
            change: `${stats.incomeChange >= 0 ? '+' : ''}${stats.incomeChange}%`,
            positive: true
        },
        {
            label: "Despesas (Mês)",
            value: stats.totalExpenses,
            icon: ArrowDownRight,
            change: `${stats.expenseChange >= 0 ? '+' : ''}${stats.expenseChange}%`,
            positive: false
        },
        {
            label: "Lançamentos (Mês)",
            value: stats.transactionCount,
            icon: Target,
            change: "transações",
            positive: true,
            isNumeric: true
        },
    ];

    const formatCurrency = (val: number) => {
        return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const CustomTooltipLine = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/90 border border-border p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="font-semibold mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
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

    const CustomTooltipPie = ({ active, payload }: any) => {
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
                        className="glass rounded-xl p-5 border-border/50"
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

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Chart area */}
                <motion.div
                    className="lg:col-span-3 glass rounded-xl p-6 border-border/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-semibold">Fluxo de Caixa (Últimos 6 meses)</h2>
                    </div>
                    <div className="h-64 mt-4 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
                    className="lg:col-span-2 glass rounded-xl p-6 border-border/50 flex flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="font-semibold mb-4">Despesas por Categoria</h2>
                    {stats.categoryBreakdown.length > 0 ? (
                        <div className="flex-1 flex flex-col justify-center items-center relative">
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.categoryBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="amount"
                                            stroke="none"
                                        >
                                            {stats.categoryBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltipPie />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full mt-4 space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                {stats.categoryBreakdown.map((cat, i) => (
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
                        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-lg border-border/50">
                            Sem despesas registradas no mês.
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
                        {stats.expenseChange > 10 && (
                            <div className="bg-secondary/50 rounded-lg p-4 text-sm text-foreground leading-relaxed border border-red-500/20">
                                Seus gastos estão {stats.expenseChange}% maiores que o mês passado. Considere rever suas despesas.
                            </div>
                        )}
                        {stats.balance > 0 && stats.totalIncome > 0 && (
                            <div className="bg-secondary/50 rounded-lg p-4 text-sm text-foreground leading-relaxed border border-green-500/20">
                                Ótimo mês! Você economizou {formatCurrency(stats.balance)}. Que tal investir parte desse valor? 🎯
                            </div>
                        )}
                        {stats.categoryBreakdown.length > 0 && (
                            <div className="bg-secondary/50 rounded-lg p-4 text-sm text-foreground leading-relaxed">
                                A categoria <strong>{stats.categoryBreakdown[0].name}</strong> representa a maior parte dos seus gastos atuais ({formatCurrency(stats.categoryBreakdown[0].amount)}).
                            </div>
                        )}
                        {stats.transactionCount === 0 && (
                            <div className="bg-secondary/50 rounded-lg p-4 text-sm text-foreground leading-relaxed">
                                Olá {user?.user_metadata?.full_name?.split(' ')[0]}! Comece adicionando seus primeiros lançamentos para receber insights personalizados da IA.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
