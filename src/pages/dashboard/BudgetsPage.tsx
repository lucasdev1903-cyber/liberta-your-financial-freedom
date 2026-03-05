import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart as PieChartIcon, Plus, Trash2, Edit2, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useBudgets } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboardFilters } from "@/contexts/DashboardFiltersContext";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";

export function BudgetsPage() {
    const { filters } = useDashboardFilters();
    const { budgets, isLoading, addBudget, deleteBudget, updateBudget } = useBudgets({
        month: filters.month,
        year: filters.year
    });
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

    const getStatusColor = (status: string) => {
        if (status === "danger") return "bg-red-500";
        if (status === "warning") return "bg-yellow-500";
        return "bg-green-500";
    };

    const getStatusBorder = (status: string) => {
        if (status === "danger") return "border-red-500/30";
        if (status === "warning") return "border-yellow-500/30";
        return "border-green-500/30";
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
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <DashboardFilters />
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <PieChartIcon className="w-8 h-8 text-primary" />
                        Gestão de Orçamentos
                    </h1>
                    <p className="text-muted-foreground mt-1">Defina limites de gastos por categoria e controle seu comportamento financeiro.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="hero" className="gap-2 shadow-glow" disabled={availableCategories.length === 0}>
                            <Plus className="w-4 h-4" /> Novo Orçamento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px] border-border/50 bg-card/95 backdrop-blur-xl p-0 overflow-hidden">
                        <div className="p-6 pb-0">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                    <PieChartIcon className="w-5 h-5 text-primary" />
                                    Definir Limite de Gastos
                                </DialogTitle>
                                <DialogDescription>
                                    Crie um limite mensal para uma categoria e monitore seus gastos automaticamente.
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        <form onSubmit={handleAdd} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    1. Escolha a Categoria
                                </label>
                                <Select name="category_id">
                                    <SelectTrigger className="h-12 bg-secondary/20 border-border/50 transition-all hover:bg-secondary/30">
                                        <SelectValue placeholder="Selecione uma categoria..." />
                                    </SelectTrigger>
                                    <SelectContent className="border-border/50 bg-card/95 backdrop-blur-xl">
                                        {availableCategories.map((c: any) => (
                                            <SelectItem key={c.id} value={c.id} className="focus:bg-primary/10 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm"
                                                        style={{ backgroundColor: c.color || '#primary' }}
                                                    >
                                                        <span className="text-lg">💰</span>
                                                    </div>
                                                    <span className="font-medium">{c.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    2. Quanto deseja gastar por mês?
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold transition-colors group-focus-within:text-primary">R$</span>
                                    <Input
                                        name="amount_limit"
                                        type="number"
                                        step="0.01"
                                        placeholder="0,00"
                                        required
                                        className="pl-11 h-12 bg-secondary/20 border-border/50 text-lg font-bold transition-all focus:ring-2 focus:ring-primary/20 hover:bg-secondary/30"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">
                                    Dica: Seja realista com seus limites para manter o controle.
                                </p>
                            </div>

                            <div className="pt-2">
                                <Button type="submit" variant="hero" className="w-full h-12 text-base shadow-glow-sm" disabled={addBudget.isPending}>
                                    {addBudget.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Criando...
                                        </>
                                    ) : (
                                        'Ativar Orçamento'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            {budgets.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center border-dashed">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <PieChartIcon className="w-9 h-9 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Controle seus gastos 📊</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                        Defina limites menssais por categoria e receba alertas visuais quando estiver perto de estourar.
                        As barras mudam de cor automaticamente: <span className="text-green-500 font-bold">verde</span> → <span className="text-yellow-500 font-bold">amarelo</span> → <span className="text-red-500 font-bold">vermelho</span>.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-1" />
                        Clique em "Novo Orçamento" para começar
                    </p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                    {budgets.map((b, i) => (
                        <motion.div
                            key={b.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={cn("glass rounded-2xl p-6 border-2 transition-all", getStatusBorder(b.status))}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-3 h-3 rounded-full", getStatusColor(b.status))} />
                                    <h3 className="font-bold">{b.categories?.name || "Categoria"}</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => { setEditId(b.id); setEditLimit(String(b.amount_limit)); }} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => deleteBudget.mutate(b.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>

                            {editId === b.id ? (
                                <div className="flex gap-2 mb-4">
                                    <Input value={editLimit} onChange={(e) => setEditLimit(e.target.value)} type="number" step="0.01" className="h-9" />
                                    <Button size="sm" onClick={() => handleUpdate(b.id)}>Salvar</Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>X</Button>
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Gasto: <strong className="text-foreground">{formatCurrency(b.spent)}</strong></span>
                                    <span className="text-muted-foreground">Limite: <strong className="text-foreground">{formatCurrency(b.amount_limit)}</strong></span>
                                </div>
                                <div className="relative">
                                    <Progress value={b.percentage} className={cn("h-4 rounded-full", b.status === "danger" ? "[&>div]:bg-red-500" : b.status === "warning" ? "[&>div]:bg-yellow-500" : "[&>div]:bg-green-500")} />
                                </div>
                                <div className="flex items-center gap-1.5 mt-2">
                                    {b.status === "danger" ? (
                                        <motion.div
                                            className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5 w-full"
                                            animate={{ opacity: [1, 0.7, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                            <span className="text-[11px] text-red-500 font-bold">
                                                {b.percentage >= 100 ? `🚨 Limite estourado! (${Math.round(b.percentage)}%)` : `⚠️ Cuidado! ${Math.round(b.percentage)}% do limite`}
                                            </span>
                                            <span className="ml-auto text-[10px] text-red-400">
                                                {b.percentage >= 100 ? `Excedeu ${formatCurrency(b.spent - b.amount_limit)}` : `Resta ${formatCurrency(b.amount_limit - b.spent)}`}
                                            </span>
                                        </motion.div>
                                    ) : b.status === "warning" ? (
                                        <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5 w-full">
                                            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                                            <span className="text-[11px] text-yellow-500 font-bold">Atenção: {Math.round(b.percentage)}% do limite</span>
                                            <span className="ml-auto text-[10px] text-yellow-400">Resta {formatCurrency(b.amount_limit - b.spent)}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5 w-full">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                            <span className="text-[11px] text-green-500 font-bold">✅ Dentro do orçamento ({Math.round(b.percentage)}%)</span>
                                            <span className="ml-auto text-[10px] text-green-400">Resta {formatCurrency(b.amount_limit - b.spent)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
