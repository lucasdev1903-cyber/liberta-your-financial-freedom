import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Button } from "@/components/ui/button";
import { Plus, FileDown, FileSpreadsheet, Search, Filter } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

import { useDashboardFilters } from "@/contexts/DashboardFiltersContext";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";

export function TransactionsPage() {
    const { filters } = useDashboardFilters();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

    // Pass global filters to hook
    const { transactions, isLoading } = useTransactions({
        month: filters.month,
        year: filters.year
    });
    const { data: stats } = useDashboardStats({
        dateRange: 'custom',
        month: filters.month,
        year: filters.year
    });
    const { toast } = useToast();

    const handleExcelExport = () => {
        exportToExcel(transactions as unknown as Parameters<typeof exportToExcel>[0]);
        toast({ title: "📊 Excel exportado com sucesso!" });
    };

    const handlePdfExport = () => {
        exportToPDF(
            transactions as unknown as Parameters<typeof exportToPDF>[0],
            { totalIncome: stats?.totalIncome || 0, totalExpenses: stats?.totalExpenses || 0, balance: stats?.balance || 0 }
        );
        toast({ title: "📄 PDF gerado com sucesso!" });
    };

    // Filter logic (now only search and type)
    const filteredTransactions = transactions.filter((t: any) => {
        // Type filter
        if (typeFilter !== 'all' && t.type !== typeFilter) return false;
        // Search filter
        if (search && !t.description?.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            <DashboardFilters />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Lançamentos</h1>
                    <p className="text-sm text-muted-foreground">Gerencie todas as suas receitas e despesas</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleExcelExport} disabled={transactions.length === 0}>
                        <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePdfExport} disabled={transactions.length === 0}>
                        <FileDown className="w-3.5 h-3.5" /> PDF
                    </Button>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="hero">
                                <Plus className="w-4 h-4 mr-2" /> Novo Lançamento
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] border-border/50 bg-card/95 backdrop-blur-xl">
                            <DialogHeader>
                                <DialogTitle>Novo Lançamento</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                                <TransactionForm onSuccess={() => setOpen(false)} />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-3 glass rounded-xl p-4 border-border/50">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por descrição..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-secondary/20 border-border/50 h-10 rounded-lg"
                    />
                </div>
                <div className="flex gap-1 bg-secondary/20 rounded-lg p-1">
                    {(['all', 'income', 'expense'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${typeFilter === t
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {t === 'all' ? 'Todos' : t === 'income' ? 'Receitas' : 'Despesas'}
                        </button>
                    ))}
                </div>
                {(search || typeFilter !== 'all') && (
                    <button
                        onClick={() => { setSearch(''); setTypeFilter('all'); }}
                        className="text-xs text-primary hover:underline font-medium ml-2"
                    >
                        Limpar filtros
                    </button>
                )}
            </div>

            <div className="glass rounded-xl p-6 border-border/50 min-h-[400px]">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 w-full bg-secondary/10 animate-pulse rounded-lg" />)}
                    </div>
                ) : (
                    <TransactionTable data={filteredTransactions} />
                )}
            </div>
        </div>
    );
}
