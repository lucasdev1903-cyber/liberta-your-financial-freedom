import { useState, useMemo } from "react";
import { TrendingUp, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export function InvestmentsPage() {
    const [initialAmount, setInitialAmount] = useState(1000);
    const [monthlyContribution, setMonthlyContribution] = useState(500);
    const [interestRate, setInterestRate] = useState(10); // Anual
    const [years, setYears] = useState(10);

    const chartData = useMemo(() => {
        let data = [];
        let currentBalance = initialAmount;
        let totalInvested = initialAmount;

        // Taxa mensal
        const monthlyRate = interestRate / 100 / 12;

        for (let year = 0; year <= years; year++) {
            data.push({
                year: year === 0 ? "Hoje" : `Ano ${year}`,
                balance: Math.round(currentBalance),
                invested: Math.round(totalInvested),
            });

            // Simula 12 meses
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
                <div className="bg-background/90 border border-border p-3 rounded-lg shadow-xl backdrop-blur-md">
                    <p className="font-semibold mb-2">{label}</p>
                    <p className="text-sm flex items-center justify-between gap-4">
                        <span className="text-muted-foreground">Saldo Final:</span>
                        <span className="font-bold text-primary">{formatCurrency(payload[0].value)}</span>
                    </p>
                    <p className="text-sm flex items-center justify-between gap-4 mt-1">
                        <span className="text-muted-foreground">Investido:</span>
                        <span className="font-semibold">{formatCurrency(payload[1].value)}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        Simulador de Investimentos
                    </h1>
                    <p className="text-sm text-muted-foreground">Projete o poder dos juros compostos no seu patrimônio</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Formulário/Controles */}
                <div className="lg:col-span-1 glass rounded-xl p-6 border-border/50 space-y-8">
                    <div className="flex items-center gap-2 mb-2 font-semibold text-lg border-b border-border/50 pb-4">
                        <Calculator className="w-5 h-5 text-primary" />
                        Parâmetros
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Valor Inicial (R$)</label>
                            <Input
                                type="number"
                                value={initialAmount}
                                onChange={e => setInitialAmount(Number(e.target.value))}
                                className="bg-secondary/30 text-lg"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Aporte Mensal (R$)</label>
                            <Input
                                type="number"
                                value={monthlyContribution}
                                onChange={e => setMonthlyContribution(Number(e.target.value))}
                                className="bg-secondary/30 text-lg"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 flex justify-between">
                                <span>Taxa de Juros Anual</span>
                                <span className="text-primary font-bold">{interestRate}% aa</span>
                            </label>
                            <Slider
                                value={[interestRate]}
                                onValueChange={v => setInterestRate(v[0])}
                                max={20} step={0.5}
                                className="my-4"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 flex justify-between">
                                <span>Período</span>
                                <span className="text-primary font-bold">{years} anos</span>
                            </label>
                            <Slider
                                value={[years]}
                                onValueChange={v => setYears(v[0])}
                                max={40} step={1}
                                className="my-4"
                            />
                        </div>
                    </div>

                    <Button variant="hero" className="w-full" onClick={() => { }}>
                        Atualizar Projeção
                    </Button>
                </div>

                {/* Gráfico e Resultados */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="glass rounded-xl p-5 border-border/50">
                            <p className="text-sm text-muted-foreground mb-1">Patrimônio Final</p>
                            <p className="text-2xl font-bold text-gradient">{formatCurrency(finalBalance)}</p>
                        </div>
                        <div className="glass rounded-xl p-5 border-border/50">
                            <p className="text-sm text-muted-foreground mb-1">Total Investido</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
                        </div>
                        <div className="glass rounded-xl p-5 border-border/50">
                            <p className="text-sm text-muted-foreground mb-1">Total em Juros</p>
                            <p className="text-2xl font-bold text-green-400">+{formatCurrency(totalInterest)}</p>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6 border-border/50">
                        <h2 className="font-semibold mb-6">Evolução do Patrimônio</h2>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} minTickGap={30} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `R$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`} width={60} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="balance" name="Saldo Final" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                                    <Area type="monotone" dataKey="invested" name="Investido" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
