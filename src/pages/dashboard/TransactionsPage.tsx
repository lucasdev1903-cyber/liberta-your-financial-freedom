import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Button } from "@/components/ui/button";
import { Plus, FileDown, FileSpreadsheet, Search, Filter, Calendar, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function TransactionsPage() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [periodFilter, setPeriodFilter] = useState<'all' | 'month' | 'week'>('month');
    const { transactions } = useTransactions();
    const { data: stats } = useDashboardStats();
    const { toast } = useToast();

    const handleExcelExport = () => {
        exportToExcel(transactions as any);
        toast({ title: "📊 Excel exportado com sucesso!" });
    };

    const handlePdfExport = () => {
        exportToPDF(
            transactions as any,
            { totalIncome: stats?.totalIncome || 0, totalExpenses: stats?.totalExpenses || 0, balance: stats?.balance || 0 }
        );
        toast({ title: "📄 PDF gerado com sucesso!" });
    };

    const now = new Date();
    const filteredTransactions = transactions.filter((t: any) => {
        if (typeFilter !== 'all' && t.type !== typeFilter) return false;
        if (search && !t.description?.toLowerCase().includes(search.toLowerCase())) return false;
        if (periodFilter === 'month') {
            const txDate = new Date(t.date);
            if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false;
        } else if (periodFilter === 'week') {
            const txDate = new Date(t.date);
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (txDate < weekAgo) return false;
        }
        return true;
    });

    return (
        <div className="space-y-8 page-enter pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight leading-tight">Lançamentos</h1>
                    <p className="text-sm text-muted-foreground font-medium opacity-80 mt-1.5">Gerenciamento completo do seu fluxo de caixa e histórico financeiro.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/[0.03] border border-white/5 rounded-xl p-1 gap-1">
                        <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/5" onClick={handleExcelExport} disabled={transactions.length === 0}>
                            <FileSpreadsheet className="w-3.5 h-3.5 mr-2" /> Excel
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/5" onClick={handlePdfExport} disabled={transactions.length === 0}>
                            <FileDown className="w-3.5 h-3.5 mr-2" /> PDF
                        </Button>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-glow-sm hover:scale-105 active:scale-95 transition-all">
                                <Plus className="w-4 h-4 mr-2" /> Novo Lançamento
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] glass-card border-white/10 rounded-[2rem] p-8">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black tracking-tight">Novo Lançamento</DialogTitle>
                            </DialogHeader>
                            <div className="mt-6">
                                <TransactionForm onSuccess={() => setOpen(false)} />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* Filters Bar - Refined Glass */}
            <div className="glass-card rounded-[2rem] p-5 border-white/5 flex flex-col lg:flex-row items-center gap-6">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <Input
                        placeholder="Pesquisar por descrição ou categoria..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-11 bg-white/[0.03] border-white/5 h-12 rounded-xl font-medium focus:bg-white/[0.05]"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
                    <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] rounded-2xl border border-white/5">
                        {[
                            { id: 'all', icon: Filter, label: 'Todos' },
                            { id: 'income', icon: ArrowUpCircle, label: 'Receitas' },
                            { id: 'expense', icon: ArrowDownCircle, label: 'Despesas' }
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTypeFilter(t.id as any)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                                    typeFilter === t.id ? "bg-primary text-primary-foreground shadow-glow-sm" : "text-muted-foreground/60 hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                <t.icon className="w-3.5 h-3.5" />
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-2 border-l border-white/10">Período</span>
                        <select
                            value={periodFilter}
                            onChange={(e) => setPeriodFilter(e.target.value as any)}
                            className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-primary focus:ring-0 cursor-pointer"
                        >
                            <option value="month" className="bg-background text-foreground uppercase">Este Mês</option>
                            <option value="week" className="bg-background text-foreground uppercase">Esta Semana</option>
                            <option value="all" className="bg-background text-foreground uppercase">Todo Período</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Custom Styled Transaction Table Container */}
            <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border-white/5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Histórico Consolidado</h3>
                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {filteredTransactions.length} Lançamentos Encontrados
                    </div>
                </div>
                <TransactionTable filterType={typeFilter} transactions={filteredTransactions} />
            </div>
        </div>
    );
}
