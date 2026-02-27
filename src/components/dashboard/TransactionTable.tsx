import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTransactions } from "@/hooks/useTransactions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function TransactionTable({ limit }: { limit?: number }) {
    const { transactions, isLoading, deleteTransaction } = useTransactions();
    const { toast } = useToast();

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-secondary/30 rounded animate-pulse" />
                ))}
            </div>
        );
    }

    const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

    if (displayTransactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center glass rounded-xl border-dashed">
                <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                    <Wallet className="w-6 h-6 opacity-50" />
                </div>
                <h3 className="text-lg font-medium mb-1">Nenhum lançamento no período</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Suas transações registradas aparecerão aqui. Clique no botão de nova transação para começar.
                </p>
            </div>
        );
    }

    const handleDelete = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir este lançamento?")) {
            try {
                await deleteTransaction.mutateAsync(id);
                toast({ title: "Lançamento excluído" });
            } catch (error) {
                toast({ title: "Erro ao excluir", variant: "destructive" });
            }
        }
    };

    return (
        <div className="rounded-md border border-border/50 overflow-hidden">
            <Table>
                <TableHeader className="bg-secondary/20">
                    <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {displayTransactions.map((t) => (
                        <TableRow key={t.id} className="border-border/50">
                            <TableCell className="font-medium">{t.description}</TableCell>
                            <TableCell>
                                {t.categories ? (
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: (t.categories as any).color || '#fff' }}
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {(t.categories as any).name}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">
                                        Sem categoria
                                    </span>
                                )}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {format(new Date(t.date), "dd 'de' MMM", { locale: ptBR })}
                            </TableCell>
                            <TableCell className="text-right">
                                <span className={`font-semibold flex items-center justify-end gap-1 ${t.type === 'income' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {t.type === 'income' ? (
                                        <ArrowUpRight className="w-3 h-3" />
                                    ) : (
                                        <ArrowDownRight className="w-3 h-3" />
                                    )}
                                    {Number(t.amount).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </span>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Abrir menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            className="text-red-400 focus:text-red-400 cursor-pointer"
                                            onClick={() => handleDelete(t.id)}
                                        >
                                            <Trash className="w-4 h-4 mr-2" />
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
