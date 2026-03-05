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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">Carregando dados das dívidas...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quitação de Dívidas</h1>
                    <p className="text-muted-foreground mt-1">Sua jornada para a liberdade financeira começa aqui.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Nova Dívida
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar Nova Dívida</DialogTitle>
                            <DialogDescription>
                                Informe os detalhes da sua dívida para calcular a melhor estratégia de quitação.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome da Dívida</label>
                                <Input value={newDebt.name} onChange={e => setNewDebt({ ...newDebt, name: e.target.value })} placeholder="Ex: Cartão de Crédito" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Valor Total (R$)</label>
                                    <Input type="number" value={newDebt.value} onChange={e => setNewDebt({ ...newDebt, value: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Juros Anual (%)</label>
                                    <Input type="number" value={newDebt.interest_rate} onChange={e => setNewDebt({ ...newDebt, interest_rate: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pagamento Mínimo (R$)</label>
                                <Input type="number" value={newDebt.min_payment} onChange={e => setNewDebt({ ...newDebt, min_payment: Number(e.target.value) })} />
                            </div>
                            <Button onClick={handleAddDebt} className="w-full mt-4">
                                Salvar Dívida
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Simulation Controls */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" /> Estratégia
                        </CardTitle>
                        <CardDescription>Escolha como deseja quitar suas dívidas.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant={strategy === 'snowball' ? 'default' : 'outline'}
                                    className="justify-start gap-2 h-12"
                                    onClick={() => setStrategy('snowball')}
                                >
                                    <Snowflake className="w-4 h-4" /> Bola de Neve
                                </Button>
                                <Button
                                    variant={strategy === 'avalanche' ? 'default' : 'outline'}
                                    className="justify-start gap-2 h-12"
                                    onClick={() => setStrategy('avalanche')}
                                >
                                    <Flame className="w-4 h-4" /> Avalanche
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed italic">
                                {strategy === 'snowball' ? "Foco em liquidar as menores dívidas primeiro para motivação psicológica." : "Foco em liquidar as dívidas com maiores taxas de juros para economizar dinheiro."}
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-medium">Pagamento Mensal Extra</label>
                                <span className="text-sm font-bold text-primary">{formatCurrency(extraPayment)}</span>
                            </div>
                            <Slider
                                value={[extraPayment]}
                                onValueChange={([v]) => setExtraPayment(v)}
                                max={5000}
                                step={50}
                            />
                            <p className="text-[10px] text-muted-foreground text-center">Quanto maior o extra, mais rápido você se livra das dívidas.</p>
                        </div>

                        <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">Insight da Lia</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                "Com este pagamento extra de {formatCurrency(extraPayment)}, você quita tudo em {Math.floor(payoffMonths / 12)} anos e {payoffMonths % 12} meses."
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Results and List */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Metrics Grid */}
                    <div className="grid sm:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Dívida Total</p>
                                <p className="text-2xl font-bold text-destructive">{formatCurrency(totalDebtValue)}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Tempo Restante</p>
                                <p className="text-2xl font-bold">{Math.floor(payoffMonths / 12)}a {payoffMonths % 12}m</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Economia Prevista</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(extraPayment * payoffMonths * 0.4)}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Projeção de Quitação</CardTitle>
                            <CardDescription>Evolução do saldo devedor ao longo do tempo.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={simulationData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(m) => `M${m}`} />
                                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${v / 1000}k`} />
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-background border p-2 rounded shadow-sm">
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Mês {payload[0].payload.month}</p>
                                                            <p className="text-sm font-bold">{formatCurrency(payload[0].value as number)}</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Area type="monotone" dataKey="totalBalance" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.1} strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Debts List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Suas Dívidas</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y relative overflow-hidden rounded-b-xl border-t">
                                {debts.length === 0 ? (
                                    <div className="p-12 text-center text-muted-foreground italic">Nenhuma dívida cadastrada.</div>
                                ) : (
                                    debts.map((debt) => (
                                        <div key={debt.id} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                                                    <AlertCircle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{debt.name}</h4>
                                                    <p className="text-xs text-muted-foreground">Juros: {debt.interest_rate}% p.a | Mínimo: {formatCurrency(debt.min_payment || 0)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <p className="text-lg font-bold">{formatCurrency(debt.value)}</p>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteDebt.mutate(debt.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
