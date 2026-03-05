import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart as PieChartIcon, Plus, Trash2, Edit2, AlertTriangle, CheckCircle2, Loader2, Sparkles, ChevronRight, TrendingDown } from "lucide-react";
import { useBudgets } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function BudgetsPage() {
    const { budgets, isLoading, addBudget, deleteBudget, updateBudget } = useBudgets();
    const { categories } = useCategories();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [editLimit, setEditLimit] = useState("");

    const expenseCategories = (categories || []).filter((c: any) => c.type === "expense");
    const usedCategoryIds = budgets.map((b) => b.category_id);
    const availableCategories = expenseCategories.filter((c: any) => !usedCategoryIds.includes(c.id));

    const formatCurrency = (val: number) =>
        val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const getStatusInfo = (status: string) => {
        if (status === "danger") return { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", label: "Limite Excedido" };
        if (status === "warning") return { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", label: "Atenção" };
        return { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", label: "Dentro do Limite" };
    };

    const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const categoryId = fd.get("category_id") as string;
        const limit = Number(fd.get("amount_limit"));
        if (!categoryId || limit <= 0) return;
        addBudget.mutate({ category_id: categoryId, amount_limit: limit }, {
            onSuccess: () => { toast({ title: "Orçamento criado!" }); setOpen(false); },
            onError: () => toast({ title: "Erro ao criar", variant: "destructive" }),
        });
    };

    const handleUpdate = (id: string) => {
        const limit = Number(editLimit);
        if (limit <= 0) return;
        updateBudget.mutate({ id, amount_limit: limit }, {
            onSuccess: () => { toast({ title: "Limite atualizado!" }); setEditId(null); },
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 animate-pulse">Calculando margens de segurança...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 page-enter pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight leading-tight">Orçamentos</h1>
                    <p className="text-sm text-muted-foreground font-medium opacity-80 mt-1.5">Defina limites inteligentes e mantenha sua saúde financeira sob controle.</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-glow-sm hover:scale-105 active:scale-95 transition-all" disabled={availableCategories.length === 0}>
                            <Plus className="w-4 h-4 mr-2" /> Novo Orçamento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-white/10 rounded-[2rem] p-8 max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black tracking-tight">Definir Limite de Gastos</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-6 mt-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Categoria</label>
                                <Select name="category_id">
                                    <SelectTrigger className="h-12 bg-white/5 border-white/5 rounded-xl font-medium">
                                        <SelectValue placeholder="Selecione a categoria..." />
                                    </SelectTrigger>
                                    <SelectContent className="glass-card">
                                        {availableCategories.map((c: any) => (
                                            <SelectItem key={c.id} value={c.id} className="font-medium">{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Limite Mensal (R$)</label>
                                <Input name="amount_limit" type="number" step="0.01" placeholder="0,00" className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" />
                            </div>
                            <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-glow-sm mt-4">
                                Confirmar Limite
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Advisor Column */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <PieChartIcon className="w-20 h-20 text-primary" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">Utilização Global</p>
                            <h2 className="text-4xl font-black tracking-tighter mb-6">{budgets.length} Categorias <br /><span className="text-primary">Monitoradas</span></h2>

                            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status do Sistema: Otimizado</span>
                            </div>
                        </div>
                    </div>

                    {/* Lia AI Budget Insight */}
                    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-gradient-to-br from-primary/[0.05] to-transparent relative overflow-hidden group shadow-glow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Lia Budget Advisor</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-6 italic opacity-80">
                            "Você está utilizando apenas 40% do seu orçamento em Alimentação este mês. Que tal mover R$ 200,00 para sua meta de 'Reserva de Emergência'?"
                        </p>
                        <Button variant="ghost" className="h-10 px-0 hover:bg-transparent text-[10px] font-black uppercase tracking-widest group/btn text-primary">
                            OTIMIZAR ORÇAMENTO <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>

                {/* Budgets Grid */}
                <div className="lg:col-span-2">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {budgets.map((budget, i) => {
                                const status = getStatusInfo(budget.status);
                                const isEditing = editId === budget.id;

                                return (
                                    <motion.div
                                        key={budget.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="glass-card rounded-[2.5rem] p-8 border-white/5 relative group hover:border-primary/20 transition-all duration-500"
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div>
                                                <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                                                    {budget.category_name}
                                                    {budget.status === 'danger' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                                </h3>
                                                <p className={cn("text-[9px] font-black uppercase tracking-widest mt-1", status.color)}>
                                                    {status.label}
                                                </p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditId(budget.id); setEditLimit(budget.amount_limit.toString()); }}
                                                    className="p-2 rounded-xl text-muted-foreground/30 hover:text-primary hover:bg-primary/10 transition-all"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteBudget.mutate(budget.id)}
                                                    className="p-2 rounded-xl text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="flex items-end justify-between">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Gasto Atual</span>
                                                    <p className="text-xl font-black tabular-nums">{formatCurrency(budget.current_amount)}</p>
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Limite</span>
                                                    {isEditing ? (
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                value={editLimit}
                                                                onChange={(e) => setEditLimit(e.target.value)}
                                                                className="h-8 w-24 bg-white/5 border-primary/30 rounded-lg text-xs font-black"
                                                                autoFocus
                                                            />
                                                            <Button size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleUpdate(budget.id)}>
                                                                <CheckCircle2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm font-black opacity-40 italic">{formatCurrency(budget.amount_limit)}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="relative pt-2">
                                                <Progress
                                                    value={budget.percentage}
                                                    className={cn("h-3 rounded-full bg-white/[0.03]", budget.status === 'danger' ? 'text-red-500' : 'text-primary')}
                                                />
                                                <div className="flex justify-between mt-2">
                                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Progresso</span>
                                                    <span className={cn("text-[9px] font-black uppercase tracking-widest", budget.percentage > 100 ? "text-red-500" : "text-primary/60")}>
                                                        {budget.percentage.toFixed(0)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
