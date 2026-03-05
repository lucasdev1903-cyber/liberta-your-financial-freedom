import { useState, useMemo } from "react";
import { TrendingUp, Calculator, Sparkles, Info, ArrowUpRight, Percent, Coins, Calendar, Table, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function InvestmentsPage() {
    const [initialAmount, setInitialAmount] = useState(1000);
    const [monthlyContribution, setMonthlyContribution] = useState(500);
    const [interestRate, setInterestRate] = useState(12); // Anual
    const [inflationRate, setInflationRate] = useState(4.5); // Anual
    const [years, setYears] = useState(10);
    const [considerInflation, setConsiderInflation] = useState(true);
    const [showTable, setShowTable] = useState(false);

    const simulation = useMemo(() => {
        let chartData = [];
        let tableData = [];
        let currentBalance = initialAmount;
        let totalInvested = initialAmount;

        // Rentabilidade real se considerar inflação
        // Fórmula de Fisher: (1 + r_real) = (1 + r_nominal) / (1 + i)
        const nominalRateYear = interestRate / 100;
        const inflationRateYear = inflationRate / 100;

        const effectiveRateYear = considerInflation
            ? ((1 + nominalRateYear) / (1 + inflationRateYear)) - 1
            : nominalRateYear;

        const monthlyRate = Math.pow(1 + effectiveRateYear, 1 / 12) - 1;

        for (let year = 0; year <= years; year++) {
            chartData.push({
                year: year === 0 ? "Início" : `${year} anos`,
                balance: Math.round(currentBalance),
                invested: Math.round(totalInvested),
                profit: Math.round(currentBalance - totalInvested),
            });

            if (year < years) {
                for (let month = 1; month <= 12; month++) {
                    currentBalance = (currentBalance + monthlyContribution) * (1 + monthlyRate);
                    totalInvested += monthlyContribution;

                    if (showTable && ((year * 12 + month) % 6 === 0 || year === years - 1)) {
                        tableData.push({
                            label: `Mês ${year * 12 + month}`,
                            balance: currentBalance,
                            invested: totalInvested,
                            profit: currentBalance - totalInvested
                        });
                    }
                }
            }
        }

        return { chartData, tableData, finalBalance: currentBalance, totalInvested, totalProfit: currentBalance - totalInvested };
    }, [initialAmount, monthlyContribution, interestRate, inflationRate, years, considerInflation, showTable]);

    const formatCurrency = (val: number) =>
        val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card/95 border border-border p-4 rounded-xl shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
                    <p className="font-bold mb-3 text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {label}
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-8">
                            <span className="text-xs text-muted-foreground font-medium">Patrimônio:</span>
                            <span className="text-sm font-black text-primary">{formatCurrency(payload[0].value)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-8 border-t border-border/50 pt-2">
                            <span className="text-xs text-muted-foreground font-medium">Investido:</span>
                            <span className="text-sm font-bold">{formatCurrency(payload[1].value)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-8 border-t border-border/50 pt-2">
                            <span className="text-xs text-muted-foreground font-medium text-green-500/80">Rendimento:</span>
                            <span className="text-sm font-bold text-green-500">{formatCurrency(payload[0].value - payload[1].value)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-3 tracking-tight">
                        <TrendingUp className="w-8 h-8 text-primary" />
                        Simulador de Liberdade
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">O poder dos juros compostos trabalhando para você</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-secondary/50 p-1.5 rounded-xl border border-border/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Projeção em Tempo Real</span>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass rounded-2xl p-6 border-border/50 shadow-glow-sm">
                        <h3 className="flex items-center gap-2 font-bold mb-6 text-lg">
                            <Calculator className="w-5 h-5 text-primary" /> Parâmetros
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Investimento Inicial</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">R$</span>
                                    <Input
                                        type="number"
                                        value={initialAmount}
                                        onChange={e => setInitialAmount(Number(e.target.value))}
                                        className="pl-10 bg-secondary/30 h-12 text-lg font-bold border-border/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Aporte Mensal</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">R$</span>
                                    <Input
                                        type="number"
                                        value={monthlyContribution}
                                        onChange={e => setMonthlyContribution(Number(e.target.value))}
                                        className="pl-10 bg-secondary/30 h-12 text-lg font-bold border-border/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Rentabilidade Anual</Label>
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-black">{interestRate}%</span>
                                </div>
                                <Slider
                                    value={[interestRate]}
                                    onValueChange={v => setInterestRate(v[0])}
                                    max={30} step={0.5}
                                    className="py-2"
                                />
                            </div>

                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Período (Anos)</Label>
                                    <span className="bg-secondary text-foreground px-2 py-0.5 rounded-md text-xs font-black">{years} anos</span>
                                </div>
                                <Slider
                                    value={[years]}
                                    onValueChange={v => setYears(v[0])}
                                    max={50} step={1}
                                    className="py-2"
                                />
                            </div>

                            <div className="pt-6 border-t border-border/50 space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/30">
                                    <div className="flex flex-col gap-0.5">
                                        <Label className="text-xs font-bold">Considerar Inflação</Label>
                                        <p className="text-[10px] text-muted-foreground">Cálculo de poder de compra real</p>
                                    </div>
                                    <Switch
                                        checked={considerInflation}
                                        onCheckedChange={setConsiderInflation}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>

                                {considerInflation && (
                                    <div className="space-y-4 px-1">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Inflação Média Anual</Label>
                                            <span className="text-[10px] font-bold text-orange-500">{inflationRate}%</span>
                                        </div>
                                        <Slider
                                            value={[inflationRate]}
                                            onValueChange={v => setInflationRate(v[0])}
                                            max={15} step={0.1}
                                            className="py-1"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6 border-border/50 flex flex-col gap-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl -z-10 group-hover:bg-primary/20 transition-colors" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <h4 className="font-bold">Insight</h4>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Com esses parâmetros, sua rentabilidade real será de <span className="text-primary font-black">
                                {(interestRate - (considerInflation ? inflationRate : 0)).toFixed(2)}%
                            </span> ao ano. Em {years} anos, os juros terão gerado <span className="font-black text-foreground">{formatCurrency(simulation.totalProfit)}</span> para seu bolso.
                        </p>
                    </div>
                </div>

                {/* Results & Charts */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Total Acumulado', value: simulation.finalBalance, icon: Coins, color: 'text-primary' },
                            { label: 'Total Investido', value: simulation.totalInvested, icon: ArrowUpRight, color: 'text-muted-foreground' },
                            { label: 'Total em Juros', value: simulation.totalProfit, icon: Percent, color: 'text-green-500' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-2xl p-5 border-border/50 relative overflow-hidden"
                            >
                                <stat.icon className={cn("w-4 h-4 absolute top-4 right-4 opacity-50", stat.color)} />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                                <p className={cn("text-2xl font-black truncate", stat.color === 'text-primary' ? 'text-gradient' : stat.color)}>
                                    {formatCurrency(stat.value)}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="glass rounded-3xl p-6 md:p-8 border-border/50 flex flex-col h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-black text-xl flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                Crescimento Patrimonial
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Acumulado</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-secondary-foreground/20" />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Investido</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={simulation.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                                    <XAxis
                                        dataKey="year"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
                                        tickFormatter={(val) => `R$${val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                                        dx={-10}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="balance"
                                        name="Saldo Final"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorBalance)"
                                        animationDuration={1500}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="invested"
                                        name="Investido"
                                        stroke="hsl(var(--muted-foreground) / 0.3)"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        fillOpacity={1}
                                        fill="url(#colorInvested)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Table Toggle */}
                    <div className="space-y-4">
                        <Button
                            variant="ghost"
                            className="w-full flex items-center justify-between p-6 glass border-border/50 hover:bg-secondary/30 rounded-2xl"
                            onClick={() => setShowTable(!showTable)}
                        >
                            <div className="flex items-center gap-3">
                                <Table className="w-5 h-5 text-primary" />
                                <span className="font-bold">Ver Tabela de Evolução</span>
                            </div>
                            {showTable ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </Button>

                        <AnimatePresence>
                            {showTable && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="glass rounded-2xl border-border/50 overflow-hidden">
                                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                            <table className="w-full border-collapse">
                                                <thead className="bg-secondary/50 sticky top-0 backdrop-blur-md z-10">
                                                    <tr>
                                                        <th className="text-left py-4 px-6 text-[10px] uppercase tracking-widest text-muted-foreground font-black">Período</th>
                                                        <th className="text-right py-4 px-6 text-[10px] uppercase tracking-widest text-muted-foreground font-black">Total Investido</th>
                                                        <th className="text-right py-4 px-6 text-[10px] uppercase tracking-widest text-muted-foreground font-black">Rendimento</th>
                                                        <th className="text-right py-4 px-6 text-[10px] uppercase tracking-widest text-muted-foreground font-black text-primary">Saldo Acumulado</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/50">
                                                    {simulation.tableData.map((row, i) => (
                                                        <tr key={i} className="hover:bg-primary/5 transition-colors group">
                                                            <td className="py-4 px-6 text-sm font-bold">{row.label}</td>
                                                            <td className="py-4 px-6 text-right text-sm text-muted-foreground font-medium">{formatCurrency(row.invested)}</td>
                                                            <td className="py-4 px-6 text-right text-sm text-green-500 font-bold">+{formatCurrency(row.profit)}</td>
                                                            <td className="py-4 px-6 text-right text-sm font-black text-primary group-hover:scale-105 transition-transform origin-right">
                                                                {formatCurrency(row.balance)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
