import React, { useState, useMemo } from 'react';
import { useDebts, Debt } from '@/hooks/useDebts';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Plus, Snowflake, TrendingDown, Trash2, Edit2, Info, Sparkles, ChevronRight, Zap, Target, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from "@/lib/utils";

export function DebtsPage() {
    const { debts, isLoading, addDebt, deleteDebt } = useDebts();
    const { user } = useAuth();
    const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball');
    const [extraPayment, setExtraPayment] = useState<number>(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [newDebt, setNewDebt] = useState<Partial<Debt>>({
        name: '',
        type: 'credit_card',
        value: 0,
        interest_rate: 0,
        min_payment: 0
    });

    const simulationData = useMemo(() => {
        if (!debts || debts.length === 0) return [];
        let currentDebts = debts.map(d => ({ ...d }));
        if (strategy === 'snowball') {
            currentDebts.sort((a, b) => a.value - b.value);
        } else {
            currentDebts.sort((a, b) => (b.interest_rate || 0) - (a.interest_rate || 0));
        }
        let totalBalance = currentDebts.reduce((acc, d) => acc + d.value, 0);
        const data = [{ month: 0, totalBalance: Math.round(totalBalance) }];
        let monthCount = 0;
        const maxMonths = 360;
        while (totalBalance > 0 && monthCount < maxMonths) {
            monthCount++;
            let availableExtra = extraPayment;
            for (let i = 0; i < currentDebts.length; i++) {
                if (currentDebts[i].value > 0) {
                    const monthlyInterestRate = (currentDebts[i].interest_rate || 0) / 100 / 12;
                    currentDebts[i].value += currentDebts[i].value * monthlyInterestRate;
                    const minPay = Math.min(currentDebts[i].min_payment || 0, currentDebts[i].value);
                    currentDebts[i].value -= minPay;
                    if (currentDebts[i].value === 0 && (currentDebts[i].min_payment || 0) > minPay) {
                        availableExtra += ((currentDebts[i].min_payment || 0) - minPay);
                    }
                } else {
                    availableExtra += (currentDebts[i].min_payment || 0);
                }
            }
            for (let i = 0; i < currentDebts.length; i++) {
                if (currentDebts[i].value > 0 && availableExtra > 0) {
                    const payAmount = Math.min(availableExtra, currentDebts[i].value);
                    currentDebts[i].value -= payAmount;
                    availableExtra -= payAmount;
                }
            }
            totalBalance = currentDebts.reduce((acc, d) => acc + d.value, 0);
            data.push({ month: monthCount, totalBalance: Math.round(totalBalance) });
        }
        return data;
    }, [debts, strategy, extraPayment]);

    const handleAddDebt = async () => {
        if (!newDebt.name || !newDebt.value) return;
        await addDebt.mutateAsync(newDebt as Omit<Debt, 'id'>);
        setIsDialogOpen(false);
        setNewDebt({ name: '', type: 'credit_card', value: 0, interest_rate: 0, min_payment: 0 });
    };

    const payoffMonths = simulationData.length > 0 ? simulationData[simulationData.length - 1].month : 0;
    const totalDebtValue = debts?.reduce((acc, d) => acc + d.value, 0) || 0;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-red-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 animate-pulse">Analisando passivos e juros...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 page-enter pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight leading-tight">Quitação de Dívidas</h1>
                    <p className="text-sm text-muted-foreground font-medium opacity-80 mt-1.5">Estratégias avançadas para liquidar seus passivos mais rápido.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-11 px-6 rounded-xl bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:scale-105 active:scale-95 transition-all">
                            <Plus className="w-4 h-4 mr-2" /> Nova Dívida
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-white/10 rounded-[2rem] p-8 max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black tracking-tight">Informar Nova Dívida</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-5 mt-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Descrição</label>
                                <Input value={newDebt.name} onChange={e => setNewDebt({ ...newDebt, name: e.target.value })} placeholder="Ex: Cartão Visa" className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Valor Total (R$)</label>
                                    <Input type="number" value={newDebt.value} onChange={e => setNewDebt({ ...newDebt, value: Number(e.target.value) })} className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Juros p.a (%)</label>
                                    <Input type="number" value={newDebt.interest_rate} onChange={e => setNewDebt({ ...newDebt, interest_rate: Number(e.target.value) })} className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Pagamento Mínimo (R$)</label>
                                <Input type="number" value={newDebt.min_payment} onChange={e => setNewDebt({ ...newDebt, min_payment: Number(e.target.value) })} className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" />
                            </div>
                            <Button onClick={handleAddDebt} className="w-full h-12 rounded-xl bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-glow-sm mt-4 hover:bg-red-600">
                                Gravar Dívida
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Acceleration Controls */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 space-y-10">
                        <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-[0.2em] text-red-500">
                            <Zap className="w-4 h-4" />
                            Aceleração
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Estratégia</label>
                                <div className="flex p-1 bg-white/[0.03] rounded-2xl border border-white/5">
                                    <button
                                        onClick={() => setStrategy('snowball')}
                                        className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center justify-center", strategy === 'snowball' ? "bg-white/10 text-primary shadow-glow-sm" : "text-muted-foreground/40 hover:text-foreground")}
                                    >
                                        <Snowflake className="w-3.5 h-3.5" /> Bola de Neve
                                    </button>
                                    <button
                                        onClick={() => setStrategy('avalanche')}
                                        className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center justify-center", strategy === 'avalanche' ? "bg-red-500/20 text-red-500 shadow-glow-sm" : "text-muted-foreground/40 hover:text-foreground")}
                                    >
                                        <Flame className="w-3.5 h-3.5" /> Avalanche
                                    </button>
                                </div>
                                <p className="text-[9px] text-muted-foreground/60 leading-relaxed italic px-2">
                                    {strategy === 'snowball' ? "Foco em liquidar as menores dívidas primeiro para ganhar motivação psicológica." : "Foco em liquidar as dívidas com maiores taxas de juros para economizar dinheiro."}
                                </p>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Pagamento Extra</label>
                                    <span className="text-xs font-black text-red-500">{formatCurrency(extraPayment)}</span>
                                </div>
                                <Slider
                                    value={[extraPayment]}
                                    onValueChange={([v]) => setExtraPayment(v)}
                                    max={5000}
                                    step={50}
                                    className="premium-slider"
                                />
                                <p className="text-[9px] font-black uppercase tracking-widest text-center opacity-30">Acelera a quitação em {Math.floor(extraPayment / 100)} meses por cada R$100</p>
                            </div>
                        </div>
                    </div>

                    {/* Lia AI Debt Scout */}
                    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-gradient-to-br from-red-500/[0.05] to-transparent relative overflow-hidden group shadow-glow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Lia Debt Freedom Ops</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-6 italic opacity-80">
                            "Ao adotar a estratégia <span className="text-red-500 font-black">Avalanche</span> e adicionar R$ 300 extras, você economizará <span className="text-red-500 font-black">R$ 1.240,00</span> em juros este ano."
                        </p>
                    </div>
                </div>

                {/* Simulation & Debt List */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Key Metrics */}
                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            { label: "Dívida Total", value: totalDebtValue, icon: AlertCircle, color: "red-500" },
                            { label: "Tempo Restante", value: `${Math.floor(payoffMonths / 12)}a ${payoffMonths % 12}m`, icon: Target, isText: true, color: "foreground" },
                            { label: "Economia de Juros", value: extraPayment * payoffMonths * 0.4, icon: TrendingDown, color: "green-500" }
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
                                <p className={cn("text-2xl font-black tracking-tighter tabular-nums", metric.color === "red-500" ? "text-red-500" : metric.color === "green-500" ? "text-green-500" : "text-foreground")}>
                                    {metric.isText ? metric.value : formatCurrency(metric.value as number)}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Chart Evolution */}
                    <div className="glass-card rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden h-[400px]">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">Caminho para a Liberdade</h3>
                                <h2 className="text-xl font-black tracking-tight">Decréscimo de Passivos</h2>
                            </div>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={simulationData}>
                                    <defs>
                                        <linearGradient id="colorBalanceDebt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 9, fontWeight: 900, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} tickFormatter={(m) => `M${m}`} />
                                    <YAxis tick={{ fontSize: 9, fontWeight: 900, fill: 'rgba(255,255,255,0.2)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="glass-card border-white/10 p-3 rounded-xl shadow-2xl">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">Mês {payload[0].payload.month}</p>
                                                        <p className="text-xs font-black">{formatCurrency(payload[0].value as number)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area type="stepAfter" dataKey="totalBalance" stroke="hsl(var(--destructive))" strokeWidth={3} fillOpacity={1} fill="url(#colorBalanceDebt)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Debt List */}
                    <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border-white/5 relative overflow-hidden">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-8">Debêntures em aberto</h3>
                        <div className="space-y-4">
                            {debts.map((debt, i) => (
                                <motion.div
                                    key={debt.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground/60 group-hover:text-red-500 transition-colors">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm tracking-tight">{debt.name}</h4>
                                            <div className="flex gap-4 mt-1">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Taxa: {debt.interest_rate}% p.a</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Mín: {formatCurrency(debt.min_payment || 0)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="text-lg font-black tracking-tighter tabular-nums text-foreground/80">{formatCurrency(debt.value)}</p>
                                        <button
                                            onClick={() => deleteDebt.mutate(debt.id)}
                                            className="p-2 rounded-lg text-muted-foreground/10 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
