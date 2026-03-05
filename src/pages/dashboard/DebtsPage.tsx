import React, { useState, useMemo } from 'react';
import { useDebts, Debt } from '@/hooks/useDebts';
import { motion } from 'framer-motion';
import { Flame, Plus, Snowflake, TrendingDown, Trash2, Edit2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function DebtsPage() {
    const { debts, isLoading, addDebt, deleteDebt } = useDebts();
    const { user } = useAuth();
    const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('snowball');
    const [extraPayment, setExtraPayment] = useState<number>(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [newDebt, setNewDebt] = useState<Partial<Debt>>({
        name: '',
        type: 'credit_card',
        value: 0,
        interest_rate: 0,
        min_payment: 0
    });

    // Strategy Calculation Logic
    const simulationData = useMemo(() => {
        if (!debts || debts.length === 0) return [];

        let currentDebts = debts.map(d => ({ ...d }));

        // Sort based on strategy
        if (strategy === 'snowball') {
            currentDebts.sort((a, b) => a.value - b.value); // Lowest balance first
        } else {
            currentDebts.sort((a, b) => (b.interest_rate || 0) - (a.interest_rate || 0)); // Highest interest first
        }

        let totalBalance = currentDebts.reduce((acc, d) => acc + d.value, 0);
        const data = [{ month: 0, totalBalance: Math.round(totalBalance) }];

        let monthCount = 0;
        const maxMonths = 360; // 30 years max to prevent infinite loops

        while (totalBalance > 0 && monthCount < maxMonths) {
            monthCount++;
            let availableExtra = extraPayment;

            // Apply interest and minimum payments
            for (let i = 0; i < currentDebts.length; i++) {
                if (currentDebts[i].value > 0) {
                    // Add monthly interest
                    const monthlyInterestRate = (currentDebts[i].interest_rate || 0) / 100 / 12;
                    currentDebts[i].value += currentDebts[i].value * monthlyInterestRate;

                    // Pay minimum
                    const minPay = Math.min(currentDebts[i].min_payment || 0, currentDebts[i].value);
                    currentDebts[i].value -= minPay;

                    if (currentDebts[i].value === 0 && (currentDebts[i].min_payment || 0) > minPay) {
                        availableExtra += ((currentDebts[i].min_payment || 0) - minPay); // roll over remaining min payment
                    }
                } else {
                    availableExtra += (currentDebts[i].min_payment || 0); // snowball effect
                }
            }

            // Apply extra payment to the target debt (first active one in sorted list)
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
    const payoffYears = Math.floor(payoffMonths / 12);
    const payoffRemainingMonths = payoffMonths % 12;

    const liaInsight = useMemo(() => {
        if (!debts || debts.length === 0) return "Adicione suas dívidas para que eu possa analisar a melhor estratégia de quitação para você!";
        const strategyName = strategy === 'snowball' ? 'Bola de Neve' : 'Avalanche';
        let text = `Com a estratégia ${strategyName} e R$ ${extraPayment.toLocaleString('pt-BR')} extra por mês, você estará livre das dívidas em `;
        if (payoffYears > 0) text += `${payoffYears} ano(s) e `;
        text += `${payoffRemainingMonths} mes(es)! `;

        if (extraPayment === 0) {
            text += "Dica: Tente deslizar o controle de 'Aporte Extra' para ver como um pequeno valor mensal pode acelerar drasticamente sua liberdade financeira.";
        } else {
            text += "Excelente! O poder dos juros compostos trabalhando a seu favor. Mantenha o foco!";
        }
        return text;
    }, [debts, strategy, extraPayment, payoffMonths]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                        <Flame className="w-8 h-8 text-red-500" />
                        Quitação de Dívidas
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Estratégias inteligentes para acelerar sua jornada rumo à liberdade.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow flex items-center gap-2 font-medium">
                            <Plus className="w-4 h-4" /> Nova Dívida
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Adicionar Nova Dívida</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome / Descrição</Label>
                                <Input id="name" value={newDebt.name} onChange={e => setNewDebt({ ...newDebt, name: e.target.value })} placeholder="Ex: Cartão Nubank" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="value">Saldo Devedor (R$)</Label>
                                    <Input id="value" type="number" value={newDebt.value || ''} onChange={e => setNewDebt({ ...newDebt, value: Number(e.target.value) })} placeholder="1500" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Tipo</Label>
                                    <Select value={newDebt.type} onValueChange={(val: any) => setNewDebt({ ...newDebt, type: val })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                                            <SelectItem value="loan">Empréstimo Pessoal</SelectItem>
                                            <SelectItem value="mortgage">Financiamento</SelectItem>
                                            <SelectItem value="other">Outros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="interest">Juros Mensal (%)</Label>
                                    <Input id="interest" type="number" step="0.1" value={newDebt.interest_rate || ''} onChange={e => setNewDebt({ ...newDebt, interest_rate: Number(e.target.value) })} placeholder="8.5" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="min">Parcela Mínima (R$)</Label>
                                    <Input id="min" type="number" value={newDebt.min_payment || ''} onChange={e => setNewDebt({ ...newDebt, min_payment: Number(e.target.value) })} placeholder="150" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddDebt} disabled={addDebt.isPending || !newDebt.name || !newDebt.value}>
                                {addDebt.isPending ? 'Salvando...' : 'Adicionar Dívida'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex bg-secondary/30 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setStrategy('snowball')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${strategy === 'snowball' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <Snowflake className="w-4 h-4 text-blue-500" /> Bola de Neve
                </button>
                <button
                    onClick={() => setStrategy('avalanche')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${strategy === 'avalanche' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <TrendingDown className="w-4 h-4 text-orange-500" /> Avalanche
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Visualizer Chart Area */}
                    <motion.div className="glass rounded-xl p-6 border-border/50 min-h-[400px]" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-bold flex items-center gap-2">Projeção de Quitação</h3>
                                <p className="text-muted-foreground text-sm">Evolução do Saldo Devedor Total no tempo</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Livre em</span>
                                <p className="text-2xl font-black text-primary">
                                    {payoffMonths === 360 ? '30+ Anos' : `${payoffYears > 0 ? `${payoffYears}A ` : ''}${payoffRemainingMonths}M`}
                                </p>
                            </div>
                        </div>

                        {simulationData.length > 0 ? (
                            <div className="h-64 sm:h-80 w-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={simulationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" vertical={false} />
                                        <XAxis dataKey="month" tickFormatter={(v) => `Mês ${v}`} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                        <YAxis tickFormatter={(v) => `R$ ${v / 1000}k`} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                        <Tooltip
                                            formatter={(value: number) => [formatCurrency(value), 'Saldo Restante']}
                                            labelFormatter={(label) => `Mês ${label}`}
                                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                                        />
                                        <Area type="monotone" dataKey="totalBalance" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-lg">
                                <Flame className="w-8 h-8 opacity-20 mb-2" />
                                <p>Nenhuma dívida registrada.</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="space-y-6">
                    {/* Extra Contribution Slider */}
                    <motion.div className="glass rounded-xl p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold flex items-center gap-2">Poder de Fogo</h3>
                            <span className="text-xl font-black text-green-500">{formatCurrency(extraPayment)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">Aporte Extra mensal (além do mínimo de cada parcela).</p>
                        <Slider
                            defaultValue={[0]}
                            max={5000}
                            step={50}
                            value={[extraPayment]}
                            onValueChange={(val) => setExtraPayment(val[0])}
                            className="py-4"
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                            <span>R$ 0</span>
                            <span>R$ 5.000+</span>
                        </div>
                    </motion.div>

                    {/* Lia AI Insights */}
                    <motion.div className="glass rounded-xl p-5 border-border/50 relative overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shrink-0 shadow-lg shadow-primary/20">
                                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                                    <Flame className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold mb-1">Lia AI <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider ml-1">Análise</span></h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{liaInsight}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Active Debts List */}
                    <motion.div className="glass rounded-xl p-6 border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h3 className="font-bold mb-4">Suas Dívidas Ativas</h3>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {!debts || debts.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma dívida. Parabéns!</p>
                            ) : (
                                debts.map((debt) => (
                                    <div key={debt.id} className="p-3 bg-secondary/30 rounded-lg border border-border/50 flex items-center justify-between group">
                                        <div>
                                            <p className="font-medium text-sm">{debt.name}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                Saldo: {formatCurrency(debt.value)} | Juros: {debt.interest_rate}% a.m.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteDebt.mutate(debt.id)}
                                            className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
