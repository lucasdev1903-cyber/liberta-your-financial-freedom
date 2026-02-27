import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/dashboard/TransactionForm";

export function TransactionsPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Lançamentos</h1>
                    <p className="text-sm text-muted-foreground">Gerencie todas as suas receitas e despesas</p>
                </div>

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

            <div className="glass rounded-xl p-6 border-border/50">
                <TransactionTable />
            </div>
        </div>
    );
}
