import { useState, useMemo } from "react";
import { TrendingUp, Calculator, Sparkles, ChevronRight, ArrowUpRight, Target, Wallet, Zap, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function InvestmentsPage() {
    const [initialAmount, setInitialAmount] = useState(1000);
    const [monthlyContribution, setMonthlyContribution] = useState(500);
    const [interestRate, setInterestRate] = useState(10); // Anual
    const [years, setYears] = useState(10);

    const chartData = useMemo(() => {
        let data = [];
        let currentBalance = initialAmount;
        let totalInvested = initialAmount;
        const monthlyRate = interestRate / 100 / 12;

        for (let year = 0; year <= years; year++) {
            data.push({
                year: year === 0 ? "Hoje" : `Ano ${year}`,
                balance: Math.round(currentBalance),
                invested: Math.round(totalInvested),
            });
            for (let month = 1; month <= 12; month++) {
                currentBalance = (currentBalance + monthlyContribution) * (1 + monthlyRate);
                totalInvested += monthlyContribution;
            }
        }
        return data;
    }, [initialAmount, monthlyContribution, interestRate, years]);

    const finalBalance = chartData[chartData.length - 1]?.balance || 0;
    const totalInvested = chartData[chartData.length - 1]?.invested || 0;
    const totalInterest = finalBalance - totalInvested;

    const formatCurrency = (val: number) =>
        val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-2xl">
                    <p className="font-black text-[10px] uppercase tracking-widest text-muted-foreground/40 mb-3">{label}</p>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-8">
                            <span className="text-[11px] font-medium text-muted-foreground">Saldo Final:</span>
                            <span className="font-black text-primary text-sm">{formatCurrency(payload[0].value)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-8">
                            <span className="text-[11px] font-medium text-muted-foreground">Total Investido:</span>
                            <span className="font-black text-foreground text-sm">{formatCurrency(payload[1].value)}</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 page-enter pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight leading-tight">Simulador de Investimentos</h1>
                    <p className="text-sm text-muted-foreground font-medium opacity-80 mt-1.5">Projete sua liberdade financeira através do poder dos juros compostos.</p>
                </div>
            </header>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Controles do Simulador */}
                <div className="lg:col-span-1 glass-card rounded-[2.5rem] p-8 border-white/5 space-y-10">
                    <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-[0.2em] text-primary">
                        <Calculator className="w-4 h-4" />
                        Parâmetros
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Valor Inicial</label>
                                <span className="text-xs font-black text-primary">{formatCurrency(initialAmount)}</span>
                            </div>
                            <Slider
                                value={[initialAmount]}
                                onValueChange={([v]) => setInitialAmount(v)}
                                max={100000}
                                step={1000}
                                className="premium-slider"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Aporte Mensal</label>
                                <span className="text-xs font-black text-primary">{formatCurrency(monthlyContribution)}</span>
                            </div>
                            <Slider
                                value={[monthlyContribution]}
                                onValueChange={([v]) => setMonthlyContribution(v)}
                                max={10000}
                                step={100}
                                className="premium-slider"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Taxa p.a (%)</label>
                                <span className="text-xs font-black text-primary">{interestRate}%</span>
                            </div>
                            <Slider
                                value={[interestRate]}
                                onValueChange={([v]) => setInterestRate(v)}
                                max={30}
                                step={0.5}
                                className="premium-slider"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Tempo (Anos)</label>
                                <span className="text-xs font-black text-primary">{years} anos</span>
                            </div>
                            <Slider
                                value={[years]}
                                onValueChange={([v]) => setYears(v)}
                                max={40}
                                step={1}
                                className="premium-slider"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Visualization & Results */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Metrics Bar */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            { label: "Saldo Final", value: finalBalance, icon: TrendingUp, color: "primary" },
                            { label: "Total Investido", value: totalInvested, icon: Wallet, color: "foreground" },
                            { label: "Juros Ganhos", value: totalInterest, icon: Zap, color: "primary" }
                        ].map((metric, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-6 rounded-[2rem] border-white/5 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <metric.icon className="w-10 h-10" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">{metric.label}</p>
                                <p className={cn("text-2xl font-black tracking-tighter tabular-nums", metric.color === "primary" ? "text-primary text-glow" : "text-foreground")}>
                                    {formatCurrency(metric.value)}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Proj. Chart */}
                    <div className="glass-card rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden h-[450px]">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">Evolução Patrimonial</h3>
                                <h2 className="text-xl font-black tracking-tight">Projeção por Tempo</h2>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest opacity-60">
                                    <div className="w-2 h-2 rounded-full bg-primary" /> Montante Final
                                </div>
                                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest opacity-60">
                                    <div className="w-2 h-2 rounded-full bg-white/20" /> Capital Investido
                                </div>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 9, fontWeight: 900, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 9, fontWeight: 900, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorBalance)" />
                                    <Area type="monotone" dataKey="invested" stroke="rgba(255,255,255,0.2)" strokeWidth={2} fill="transparent" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Lia AI Strategic Advice */}
                    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-gradient-to-br from-primary/[0.05] to-transparent relative overflow-hidden group shadow-glow-sm flex flex-col md:flex-row items-center gap-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Lia AI Investment Scout</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-80">
                                "Ao aumentar seu aporte em apenas <span className="text-primary font-black">R$ 200,00</span>, você reduziria em <span className="text-primary font-black">4 anos</span> o tempo necessário para atingir seu primeiro milhão, aproveitando a curva exponencial dos juros."
                            </p>
                        </div>
                        <Button variant="ghost" className="h-11 px-6 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 shrink-0">
                            OTIMIZAR APORTE <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
