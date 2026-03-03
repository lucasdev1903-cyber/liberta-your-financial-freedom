import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Button } from "@/components/ui/button";
import { Plus, FileDown, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

export function TransactionsPage() {
    const [open, setOpen] = useState(false);
    const { transactions } = useTransactions();
    const { data: stats } = useDashboardStats();
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

    return (
        <div className="space-y-6">
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

            <div className="glass rounded-xl p-6 border-border/50">
                <TransactionTable />
            </div>
        </div>
    );
}
