import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useNetWorth } from '@/hooks/useNetWorth';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';

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
    const { totalAssets, totalLiabilities, netWorth, assets } = useNetWorth();
    const [isOpen, setIsOpen] = useState(false);

    // 1. Savings Rate
    const savingsRate = useMemo(() => {
        if (!stats || stats.totalIncome <= 0) return 0;
        return Math.max(0, ((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) * 100);
    }, [stats]);

    // 2. Debt-to-Asset Ratio
    const debtRatio = useMemo(() => {
        if (totalAssets <= 0) return 0;
        return (totalLiabilities / totalAssets) * 100;
    }, [totalAssets, totalLiabilities]);

    // 3. Emergency Fund (Months)
    const emergencyFundMonths = useMemo(() => {
        if (!stats || stats.totalExpenses <= 0) return 0;
        return stats.balance / (stats.totalExpenses / 1); // Simplification: current balance / current expenses
    }, [stats]);

    // 4. Liquidity Ratio (Cash, Stocks, Crypto vs Total)
    const liquidAssets = useMemo(() => {
        return assets
            .filter(a => ['cash', 'crypto', 'stock', 'investment'].includes(a.type))
            .reduce((sum, a) => sum + (a.totalValue || a.value), 0);
    }, [assets]);
    const liquidityRatio = totalAssets > 0 ? (liquidAssets / totalAssets) * 100 : 0;

    const factors = useMemo((): ScoreFactor[] => {
        if (!stats) return [];

        let savingScore = 0;
        let savingTip = 'Comece a registrar receitas para calcular.';
        if (stats.totalIncome > 0) {
            if (savingsRate >= 20) { savingScore = 200; savingTip = 'Excelente! Você poupa mais de 20%.'; }
            else if (savingsRate >= 10) { savingScore = 100; savingTip = 'Bom! Tente chegar a 20% de poupança.'; }
            else if (savingsRate > 0) { savingScore = 50; savingTip = 'Atenção: tente poupar pelo menos 10%.'; }
            else { savingScore = -100; savingTip = 'Alerta: seus gastos superam suas receitas!'; }
        }

        let balanceScore = 0;
        let balanceTip = 'Sem dados de saldo ainda.';
        if (stats.balance > 10000) { balanceScore = 150; balanceTip = 'Ótimo colchão financeiro!'; }
        else if (stats.balance > 5000) { balanceScore = 100; balanceTip = 'Bom saldo. Continue crescendo!'; }
        else if (stats.balance > 0) { balanceScore = 50; balanceTip = 'Saldo positivo. Tente aumentar sua reserva.'; }
        else if (stats.balance < 0) { balanceScore = -150; balanceTip = 'Saldo negativo — revise seus gastos urgente!'; }

        let engagementScore = 0;
        let engagementTip = 'Registre seus lançamentos para ganhar pontos.';
        if (stats.transactionCount > 20) { engagementScore = 150; engagementTip = 'Super engajado! Controle total.'; }
        else if (stats.transactionCount > 5) { engagementScore = 75; engagementTip = 'Bom ritmo! Mais registros = mais controle.'; }
        else if (stats.transactionCount > 0) { engagementScore = 25; engagementTip = 'Registre mais para ter insights melhores.'; }

        return [
            { label: 'Taxa de Poupança', value: Math.max(0, savingScore), max: 200, icon: Wallet, tip: savingTip, color: '#22c55e' },
            { label: 'Saldo Geral', value: Math.max(0, balanceScore), max: 150, icon: Target, tip: balanceTip, color: '#3b82f6' },
            { label: 'Engajamento', value: Math.max(0, engagementScore), max: 150, icon: Zap, tip: engagementTip, color: '#f59e0b' },
        ];
    }, [stats, savingsRate]);

    const score = useMemo(() => {
        if (!stats) return 0;
        let s = 500;
        s += factors.reduce((acc, f) => acc + f.value, 0);
        // Adjustment for liabilities
        if (debtRatio > 50) s -= 100;
        else if (debtRatio > 30) s -= 50;
        else if (debtRatio < 10 && totalAssets > 0) s += 50;

        return Math.min(Math.max(Math.round(s), 0), 1000);
    }, [stats, factors, debtRatio, totalAssets]);

    const scoreCategory = useMemo(() => {
        if (score >= 850) return { label: 'Excelente', color: '#22c55e', icon: Award, desc: 'Você dominou suas finanças!' };
        if (score >= 700) return { label: 'Bom', color: '#10b981', icon: TrendingUp, desc: 'Caminho certo para a liberdade.' };
        if (score >= 500) return { label: 'Regular', color: '#f59e0b', icon: Activity, desc: 'Precisa de alguns ajustes.' };
        return { label: 'Crítico', color: '#ef4444', icon: AlertCircle, desc: 'Atenção imediata necessária.' };
    }, [score]);

    const pieData = [
        { value: score, color: scoreCategory.color },
        { value: 1000 - score, color: 'hsl(var(--secondary) / 0.5)' }
    ];

    const getMetricColor = (val: number, good: number, bad: number) => {
        if (val >= good) return 'text-green-500';
        if (val <= bad) return 'text-red-500';
        return 'text-yellow-500';
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <motion.div
                    className="glass-subtle rounded-xl p-6 border-border/50 flex flex-col shadow-glow-sm cursor-pointer card-hover relative overflow-hidden h-full group"
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
                        <Badge variant="outline" className="border-border/50" style={{ color: scoreCategory.color, backgroundColor: `${scoreCategory.color}10` }}>
                            {scoreCategory.label}
                        </Badge>
                    </div>

                    <div className="relative w-full h-32 flex justify-center items-end">
                        <ResponsiveContainer width="100%" height="200%">
                            <PieChart>
                                <Pie
                                    data={pieData}
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
                                    {pieData.map((entry, index) => (
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
                    <div className="mt-4 space-y-3">
                        {factors.map((f, i) => (
                            <div key={f.label}>
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
                                        <f.icon className="w-3 h-3" style={{ color: f.color }} />
                                        {f.label}
                                    </span>
                                    <span className="font-bold">{f.value}/{f.max}</span>
                                </div>
                                <Progress value={(f.value / f.max) * 100} className="h-1" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-center gap-2 text-[10px] text-primary font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                        Clique para Check-up Completo <Activity className="w-3 h-3" />
                    </div>
                </motion.div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] glass border-border/50 bg-card/95 backdrop-blur-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black">Check-up Financeiro</DialogTitle>
                            <DialogDescription>Uma análise profunda da sua saúde financeira atual.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Taxa de Poupança</span>
                        <p className={cn("text-2xl font-black mt-1", getMetricColor(savingsRate, 20, 0))}>
                            {savingsRate.toFixed(1)}%
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-2">Ideial: acima de 20%</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Endividamento</span>
                        <p className={cn("text-2xl font-black mt-1", getMetricColor(100 - debtRatio, 70, 50))}>
                            {debtRatio.toFixed(1)}%
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-2">Dívida vs Ativos. Ideal: &lt; 30%</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Reserva de Emergência</span>
                        <p className={cn("text-2xl font-black mt-1", getMetricColor(emergencyFundMonths, 6, 1))}>
                            {emergencyFundMonths.toFixed(1)} <span className="text-xs">meses</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-2">Cobertura de gastos. Ideal: 6+</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Índice de Liquidez</span>
                        <p className={cn("text-2xl font-black mt-1", getMetricColor(liquidityRatio, 25, 10))}>
                            {liquidityRatio.toFixed(1)}%
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-2">Conversão em caixa. Ideal: 20%+</p>
                    </div>
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                    <h4 className="font-bold flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" /> Diagnóstico da Lia
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground italic">
                        "{score > 800 ? "Parabéns! Sua estrutura financeira é extremamente sólida. Você tem capital disponível para focar agora na maximização dos rendimentos." :
                            score > 500 ? "Você está no caminho certo, mas recomendo focar em aumentar sua liquidez e garantir que sua reserva de emergência cubra pelo menos 6 meses de gastos fixos." :
                                "Cuidado! Sua exposição ao risco está elevada. Priorize a quitação de dívidas de juros altos e o corte de gastos supérfluos para equilibrar seu fluxo de caixa."}"
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
