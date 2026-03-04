import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, AlertCircle, Award, Wallet, Target, Zap } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { cn } from '@/lib/utils';

interface ScoreFactor {
    label: string;
    value: number;
    max: number;
    icon: React.ElementType;
    tip: string;
    color: string;
}

export function FinancialScoreCard() {
    const { data: stats } = useDashboardStats();

    const factors = useMemo((): ScoreFactor[] => {
        if (!stats) return [];

        // Factor 1: Saving Rate
        let savingScore = 0;
        let savingTip = 'Comece a registrar receitas para calcular.';
        if (stats.totalIncome > 0) {
            const savingRate = ((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) * 100;
            if (savingRate >= 20) { savingScore = 200; savingTip = 'Excelente! Você poupa mais de 20%.'; }
            else if (savingRate >= 10) { savingScore = 100; savingTip = 'Bom! Tente chegar a 20% de poupança.'; }
            else if (savingRate > 0) { savingScore = 50; savingTip = 'Atenção: tente poupar pelo menos 10%.'; }
            else { savingScore = -100; savingTip = 'Alerta: seus gastos superam suas receitas!'; }
        }

        // Factor 2: Balance
        let balanceScore = 0;
        let balanceTip = 'Sem dados de saldo ainda.';
        if (stats.balance > 10000) { balanceScore = 150; balanceTip = 'Ótimo colchão financeiro!'; }
        else if (stats.balance > 5000) { balanceScore = 100; balanceTip = 'Bom saldo. Continue crescendo!'; }
        else if (stats.balance > 0) { balanceScore = 50; balanceTip = 'Saldo positivo. Tente aumentar sua reserva.'; }
        else if (stats.balance < 0) { balanceScore = -150; balanceTip = 'Saldo negativo — revise seus gastos urgente!'; }

        // Factor 3: Engagement
        let engagementScore = 0;
        let engagementTip = 'Registre seus lançamentos para ganhar pontos.';
        if (stats.transactionCount > 30) { engagementScore = 150; engagementTip = 'Super engajado! Controle total.'; }
        else if (stats.transactionCount > 10) { engagementScore = 75; engagementTip = 'Bom ritmo! Mais registros = mais controle.'; }
        else if (stats.transactionCount > 0) { engagementScore = 25; engagementTip = 'Registre mais para ter insights melhores.'; }

        return [
            { label: 'Taxa de Poupança', value: Math.max(0, savingScore), max: 200, icon: Wallet, tip: savingTip, color: '#22c55e' },
            { label: 'Saldo Geral', value: Math.max(0, balanceScore), max: 150, icon: Target, tip: balanceTip, color: '#3b82f6' },
            { label: 'Engajamento', value: Math.max(0, engagementScore), max: 150, icon: Zap, tip: engagementTip, color: '#f59e0b' },
        ];
    }, [stats]);

    const score = useMemo(() => {
        if (!stats) return 0;
        let s = 500;
        if (stats.totalIncome > 0) {
            const savingRate = ((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) * 100;
            if (savingRate >= 20) s += 200;
            else if (savingRate >= 10) s += 100;
            else if (savingRate > 0) s += 50;
            else s -= 100;
        }
        if (stats.balance > 10000) s += 150;
        else if (stats.balance > 5000) s += 100;
        else if (stats.balance > 0) s += 50;
        else if (stats.balance < 0) s -= 150;
        if (stats.transactionCount > 30) s += 150;
        else if (stats.transactionCount > 10) s += 75;
        return Math.min(Math.max(Math.round(s), 0), 1000);
    }, [stats]);

    const scoreCategory = useMemo(() => {
        if (score >= 800) return { label: 'Excelente', color: '#22c55e', icon: Award };
        if (score >= 600) return { label: 'Bom', color: '#10b981', icon: TrendingUp };
        if (score >= 400) return { label: 'Regular', color: '#f59e0b', icon: Activity };
        return { label: 'Atenção', color: '#ef4444', icon: AlertCircle };
    }, [score]);

    const data = [
        { value: score, color: scoreCategory.color },
        { value: 1000 - score, color: 'hsl(var(--secondary) / 0.5)' }
    ];

    return (
        <motion.div
            className="glass-subtle rounded-xl p-6 border-border/50 flex flex-col shadow-glow-sm card-hover relative overflow-hidden h-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10" />

            <div className="w-full flex items-center justify-between mb-2">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Score Financeiro
                </h2>
                <span className="text-xs font-medium px-2 py-1 rounded-full border" style={{ color: scoreCategory.color, borderColor: `${scoreCategory.color}40`, backgroundColor: `${scoreCategory.color}10` }}>
                    {scoreCategory.label}
                </span>
            </div>

            <div className="relative w-full h-32 flex justify-center items-end">
                <ResponsiveContainer width="100%" height="200%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={55}
                            outerRadius={72}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={5}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                    <motion.span
                        className="text-3xl font-black mb-0.5"
                        style={{ color: scoreCategory.color }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    >
                        {score}
                    </motion.span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">/ 1000</span>
                </div>
            </div>

            {/* Factor Breakdown */}
            <div className="mt-4 space-y-2.5">
                {factors.map((f, i) => (
                    <motion.div
                        key={f.label}
                        className="group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                    >
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="flex items-center gap-1.5 font-semibold">
                                <f.icon className="w-3 h-3" style={{ color: f.color }} />
                                {f.label}
                            </span>
                            <span className="text-muted-foreground font-bold">{f.value}/{f.max}</span>
                        </div>
                        <div className="relative h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 rounded-full"
                                style={{ backgroundColor: f.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(f.value / f.max) * 100}%` }}
                                transition={{ duration: 1, delay: 0.8 + i * 0.15 }}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            💡 {f.tip}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
