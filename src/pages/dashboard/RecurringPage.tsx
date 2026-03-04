import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecurringTransactions, RecurringTransaction } from "@/hooks/useRecurringTransactions";
import { Plus, Trash2, Calendar, ArrowUpCircle, ArrowDownCircle, ToggleLeft, ToggleRight, Repeat, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Moradia", "Alimentação", "Transporte", "Lazer", "Saúde", "Educação", "Assinatura", "Salário", "Freelance", "Investimentos", "Outros"];
const FREQUENCIES = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' },
    { value: 'yearly', label: 'Anual' },
];

export function RecurringPage() {
    const { recurringItems, isLoading, addRecurring, updateRecurring, deleteRecurring } = useRecurringTransactions();
    const { toast } = useToast();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ description: '', amount: '', type: 'expense' as 'income' | 'expense', category: 'Moradia', frequency: 'monthly' as 'weekly' | 'monthly' | 'yearly', day_of_month: 1 });

    const handleAdd = async () => {
        if (!form.description || !form.amount) { toast({ title: "Preencha todos os campos", variant: "destructive" }); return; }
        try {
            await addRecurring.mutateAsync({
                description: form.description,
                amount: parseFloat(form.amount),
                type: form.type,
                category: form.category,
                frequency: form.frequency,
                day_of_month: form.day_of_month,
                is_active: true,
                next_due_date: null,
            });
            setForm({ description: '', amount: '', type: 'expense', category: 'Moradia', frequency: 'monthly', day_of_month: 1 });
            setShowForm(false);
            toast({ title: "✅ Recorrência criada!" });
        } catch { toast({ title: "Erro ao criar", variant: "destructive" }); }
    };

    const toggleActive = async (item: RecurringTransaction) => {
        await updateRecurring.mutateAsync({ id: item.id, is_active: !item.is_active });
    };

    const handleDelete = async (id: string) => {
        if (confirm("Deseja excluir esta recorrência?")) {
            await deleteRecurring.mutateAsync(id);
            toast({ title: "Excluído" });
        }
    };

    const activeItems = recurringItems.filter(i => i.is_active);
    const inactiveItems = recurringItems.filter(i => !i.is_active);

    const totalIncome = activeItems.filter(i => i.type === 'income').reduce((s, i) => s + i.amount, 0);
    const totalExpense = activeItems.filter(i => i.type === 'expense').reduce((s, i) => s + i.amount, 0);

    const getNextDueDate = (item: RecurringTransaction) => {
        const now = new Date();
        const day = item.day_of_month || 1;
        let next = new Date(now.getFullYear(), now.getMonth(), day);
        if (next <= now) {
            next = new Date(now.getFullYear(), now.getMonth() + 1, day);
        }
        return next;
    };

    const getDaysUntil = (date: Date) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black">Contas Recorrentes</h1>
                    <p className="text-sm text-muted-foreground">Gerencie suas receitas e despesas fixas</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-primary to-orange-500 text-white shadow-glow">
                    {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {showForm ? "Cancelar" : "Nova Recorrência"}
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1"><ArrowUpCircle className="w-4 h-4 text-green-500" /><span className="text-xs text-muted-foreground font-bold uppercase">Receitas Fixas</span></div>
                    <p className="text-xl font-black text-green-500">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1"><ArrowDownCircle className="w-4 h-4 text-red-500" /><span className="text-xs text-muted-foreground font-bold uppercase">Despesas Fixas</span></div>
                    <p className="text-xl font-black text-red-500">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1"><Repeat className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground font-bold uppercase">Saldo Fixo</span></div>
                    <p className={cn("text-xl font-black", (totalIncome - totalExpense) >= 0 ? "text-green-500" : "text-red-500")}>
                        R$ {(totalIncome - totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass rounded-2xl p-6 space-y-4 overflow-hidden">
                        <h3 className="font-bold">Nova Recorrência</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Descrição (ex: Aluguel)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            <Input placeholder="Valor" type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="rounded-xl bg-secondary/50 border border-border/50 px-3 py-2 text-sm">
                                <option value="expense">Despesa</option>
                                <option value="income">Receita</option>
                            </select>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="rounded-xl bg-secondary/50 border border-border/50 px-3 py-2 text-sm">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value as any })} className="rounded-xl bg-secondary/50 border border-border/50 px-3 py-2 text-sm">
                                {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                            </select>
                        </div>
                        {form.frequency === 'monthly' && (
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-muted-foreground">Dia do mês:</label>
                                <Input type="number" min={1} max={31} value={form.day_of_month} onChange={e => setForm({ ...form, day_of_month: parseInt(e.target.value) || 1 })} className="w-20" />
                            </div>
                        )}
                        <Button onClick={handleAdd} disabled={addRecurring.isPending} className="w-full bg-gradient-to-r from-primary to-orange-500 text-white">
                            {addRecurring.isPending ? "Salvando..." : "Criar Recorrência"}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active List */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Ativas ({activeItems.length})</h3>
                {activeItems.length === 0 && <p className="text-sm text-muted-foreground glass rounded-xl p-6 text-center">Nenhuma recorrência ativa. Clique em "Nova Recorrência" para começar.</p>}
                {activeItems.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-4 flex items-center justify-between group hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10')}>
                                {item.type === 'income' ? <ArrowUpCircle className="w-5 h-5 text-green-500" /> : <ArrowDownCircle className="w-5 h-5 text-red-500" />}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{item.description}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-bold">{item.category}</span>
                                    <span><Calendar className="w-3 h-3 inline mr-1" />{FREQUENCIES.find(f => f.value === item.frequency)?.label} • Dia {item.day_of_month}</span>
                                </div>
                                {(() => {
                                    const nextDue = getNextDueDate(item);
                                    const daysLeft = getDaysUntil(nextDue);
                                    const urgencyClass = daysLeft <= 3 ? 'text-red-500 font-bold' : daysLeft <= 7 ? 'text-yellow-500' : 'text-muted-foreground';
                                    return (
                                        <div className={cn('text-[10px] mt-1 flex items-center gap-1', urgencyClass)}>
                                            {daysLeft <= 3 && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                                            Próximo: {nextDue.toLocaleDateString('pt-BR')} ({daysLeft === 0 ? 'Hoje!' : daysLeft === 1 ? 'Amanhã' : `em ${daysLeft} dias`})
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={cn("font-black text-sm", item.type === 'income' ? 'text-green-500' : 'text-red-500')}>
                                {item.type === 'income' ? '+' : '-'} R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            <button onClick={() => toggleActive(item)} className="text-muted-foreground hover:text-yellow-500 transition-colors">
                                <ToggleRight className="w-5 h-5 text-green-500" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Inactive List */}
            {inactiveItems.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Pausadas ({inactiveItems.length})</h3>
                    {inactiveItems.map((item) => (
                        <div key={item.id} className="glass rounded-xl p-4 flex items-center justify-between opacity-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center">
                                    {item.type === 'income' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-bold text-sm line-through">{item.description}</p>
                                    <span className="text-xs text-muted-foreground">{item.category} • {FREQUENCIES.find(f => f.value === item.frequency)?.label}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-sm">R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                <button onClick={() => toggleActive(item)} className="text-muted-foreground hover:text-green-500 transition-colors">
                                    <ToggleLeft className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
