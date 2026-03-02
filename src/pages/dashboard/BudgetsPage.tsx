import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart as PieChartIcon, Plus, Trash2, Edit2, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
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
                    <DialogContent className="glass">
                        <DialogHeader><DialogTitle>Definir Limite de Gastos</DialogTitle></DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Categoria</label>
                                <Select name="category_id">
                                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        {availableCategories.map((c: any) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Limite Mensal (R$)</label>
                                <Input name="amount_limit" type="number" step="0.01" placeholder="500,00" required />
                            </div>
                            <Button type="submit" variant="hero" className="w-full">Salvar Orçamento</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            {budgets.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center border-dashed">
                    <PieChartIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-bold mb-2">Nenhum orçamento definido</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Crie limites de gastos por categoria para controlar melhor suas finanças e ser alertado quando estiver perto de estourar.
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
                                <div className="flex items-center gap-1.5 mt-1">
                                    {b.status === "danger" ? (
                                        <><AlertTriangle className="w-3.5 h-3.5 text-red-500" /><span className="text-[11px] text-red-500 font-bold">Limite quase atingido! ({Math.round(b.percentage)}%)</span></>
                                    ) : b.status === "warning" ? (
                                        <><AlertTriangle className="w-3.5 h-3.5 text-yellow-500" /><span className="text-[11px] text-yellow-500 font-bold">Atenção: {Math.round(b.percentage)}% do limite</span></>
                                    ) : (
                                        <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-[11px] text-green-500 font-bold">Dentro do orçamento ({Math.round(b.percentage)}%)</span></>
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
