import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, AlertCircle, Award } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';

export function FinancialScoreCard() {
    const { data: stats } = useDashboardStats();

    const score = useMemo(() => {
        if (!stats) return 0;

        let currentScore = 500; // Base score

        // Fator 1: Receita vs Despesa
        if (stats.totalIncome > 0) {
            const savingRate = ((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) * 100;
            if (savingRate >= 20) currentScore += 200;
            else if (savingRate >= 10) currentScore += 100;
            else if (savingRate > 0) currentScore += 50;
            else currentScore -= 100;
        }

        // Fator 2: Saldo Positivo
        if (stats.balance > 10000) currentScore += 150;
        else if (stats.balance > 5000) currentScore += 100;
        else if (stats.balance > 0) currentScore += 50;
        else if (stats.balance < 0) currentScore -= 150;

        // Fator 3: Engajamento (quantidade de movimentações no mês como alias para "uso do app")
        if (stats.transactionCount > 30) currentScore += 150;
        else if (stats.transactionCount > 10) currentScore += 75;

        // Limites de Segurança
        return Math.min(Math.max(Math.round(currentScore), 0), 1000);
    }, [stats]);

    const scoreCategory = useMemo(() => {
        if (score >= 800) return { label: 'Excelente', color: '#22c55e', text: 'Sua saúde financeira está incrível! Continue assim.', icon: Award };
        if (score >= 600) return { label: 'Bom', color: '#10b981', text: 'Você está no caminho certo. Dá pra melhorar um pouco.', icon: TrendingUp };
        if (score >= 400) return { label: 'Regular', color: '#f59e0b', text: 'Atenção aos seus gastos. Tente poupar mais.', icon: Activity };
        return { label: 'Atenção', color: '#ef4444', text: 'Suas finanças precisam de cuidados urgentes.', icon: AlertCircle };
    }, [score]);

    // Dados para o Gráfico de Meia-Lua (Gauge)
    const data = [
        { value: score, color: scoreCategory.color },
        { value: 1000 - score, color: 'hsl(var(--secondary) / 0.5)' }
    ];

    return (
        <motion.div
            className="glass-subtle rounded-xl p-6 border-border/50 flex flex-col items-center justify-between shadow-glow-sm card-hover relative overflow-hidden h-full"
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

            <div className="relative w-full h-40 flex justify-center items-end mt-4">
                <ResponsiveContainer width="100%" height="200%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={70}
                            outerRadius={90}
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
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                    <span className="text-4xl font-black mb-1 text-glow" style={{ color: scoreCategory.color }}>
                        {score}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">/ 1000</span>
                </div>
            </div>

            <div className="mt-6 w-full flex gap-3 items-start bg-secondary/20 p-3 rounded-lg border border-border/50">
                <scoreCategory.icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: scoreCategory.color }} />
                <p className="text-sm text-foreground/80 leading-snug">
                    {scoreCategory.text}
                </p>
            </div>
        </motion.div>
    );
}
