import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
    Wallet,
    Target,
    Zap,
    Award,
    TrendingUp,
    Activity,
    AlertCircle
} from 'lucide-react';
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
        <>
            <motion.div
                onClick={() => setIsOpen(true)}
                className="glass-subtle rounded-xl p-6 border-border/50 flex flex-col shadow-glow-sm cursor-pointer relative overflow-hidden h-full group transition-all duration-300 hover:border-primary/20 hover:bg-primary/5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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

                <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-center gap-2 text-[10px] text-primary font-bold uppercase tracking-tighter transition-opacity">
                    Clique para Check-up Completo <Activity className="w-3 h-3" />
                </div>
            </motion.div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px] border-border/50 bg-card/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Activity className="w-5 h-5 text-primary" />
                            Check-up Financeiro
                        </DialogTitle>
                        <DialogDescription>Análise da sua saúde financeira atual.</DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-2 mt-2">
                        <div className="grid gap-3">
                            {/* Taxa de Poupança */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/50">
                                <div>
                                    <span className="text-xs font-bold uppercase text-muted-foreground">Taxa de Poupança</span>
                                    <p className="text-[10px] text-muted-foreground">Ideal: acima de 20%</p>
                                </div>
                                <span className={cn("text-lg font-black", getMetricColor(savingsRate, 20, 0))}>
                                    {savingsRate.toFixed(1)}%
                                </span>
                            </div>

                            {/* Endividamento */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/50">
                                <div>
                                    <span className="text-xs font-bold uppercase text-muted-foreground">Endividamento</span>
                                    <p className="text-[10px] text-muted-foreground">Ideal: menor que 30%</p>
                                </div>
                                <span className={cn("text-lg font-black", getMetricColor(100 - debtRatio, 70, 50))}>
                                    {debtRatio.toFixed(1)}%
                                </span>
                            </div>

                            {/* Reserva de Emergência */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/50">
                                <div>
                                    <span className="text-xs font-bold uppercase text-muted-foreground">Reserva de Emergência</span>
                                    <p className="text-[10px] text-muted-foreground">Ideal: 6+ meses</p>
                                </div>
                                <span className={cn("text-lg font-black", getMetricColor(emergencyFundMonths, 6, 1))}>
                                    {emergencyFundMonths.toFixed(1)} <span className="text-xs font-normal">meses</span>
                                </span>
                            </div>

                            {/* Índice de Liquidez */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/50">
                                <div>
                                    <span className="text-xs font-bold uppercase text-muted-foreground">Índice de Liquidez</span>
                                    <p className="text-[10px] text-muted-foreground">Ideal: 20%+</p>
                                </div>
                                <span className={cn("text-lg font-black", getMetricColor(liquidityRatio, 25, 10))}>
                                    {liquidityRatio.toFixed(1)}%
                                </span>
                            </div>
                        </div>

                        <div className="mt-2 p-4 rounded-xl bg-primary/10 border border-primary/20">
                            <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                                <Award className="w-4 h-4 text-primary" /> Diagnóstico da Lia
                            </h4>
                            <p className="text-xs leading-relaxed text-muted-foreground italic">
                                "{score > 800 ? "Sua estrutura é sólida e permite maximizar rendimentos com segurança." :
                                    score > 500 ? "Bom caminho! Foco em melhorar a liquidez e construir sua reserva de emergência completa." :
                                        "Atenção imediata: Priorize quitar dívidas de juros altos e estabilizar o fluxo de caixa."}"
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
