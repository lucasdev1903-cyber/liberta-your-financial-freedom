import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const transactionSchema = z.object({
    description: z.string().min(2, 'Descrição é muito curta'),
    amount: z.coerce.number().positive('O valor deve ser maior que zero'),
    type: z.enum(['income', 'expense']),
    category_id: z.string().min(1, 'Selecione uma categoria'),
    date: z.date({
        required_error: 'A data é obrigatória',
    }),
    notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
    onSuccess?: () => void;
    defaultType?: 'income' | 'expense';
}

export function TransactionForm({ onSuccess, defaultType = 'expense' }: TransactionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const { addTransaction } = useTransactions();
    const { categories, addCategory } = useCategories();
    const { toast } = useToast();

    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            description: '',
            amount: 0,
            type: defaultType,
            category_id: '',
            notes: '',
        },
    });

    const selectedType = form.watch('type');
    const filteredCategories = categories.filter((c) => c.type === selectedType);

    async function onSubmit(data: TransactionFormValues) {
        console.log('Submitting transaction data:', data);
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                amount: Number(data.amount),
                date: format(data.date, 'yyyy-MM-dd'),
            };
            console.log('Final payload:', payload);
            await addTransaction.mutateAsync(payload as any);
            toast({
                title: 'Lançamento salvo',
                description: 'Seu lançamento foi adicionado com sucesso.',
            });
            form.reset();
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error('Submission error:', error);
            toast({
                title: 'Erro ao salvar',
                description: error.message || 'Ocorreu um erro ao salvar o lançamento.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            await addCategory.mutateAsync({
                name: newCategoryName.trim(),
                type: selectedType,
                icon: 'wallet',
                color: selectedType === 'income' ? '#22c55e' : '#ef4444'
            } as any);
            toast({ title: 'Categoria criada com sucesso' });
            setNewCategoryName('');
            setIsCreateCategoryOpen(false);
        } catch (error: any) {
            toast({ title: 'Erro ao criar', description: error.message, variant: 'destructive' });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                    {/* Premium Type Toggle */}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo</FormLabel>
                                <FormControl>
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-secondary/20 rounded-xl border border-border/50">
                                        <button
                                            type="button"
                                            onClick={() => field.onChange('expense')}
                                            className={cn(
                                                "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                                                field.value === 'expense'
                                                    ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <span>📉</span> Despesa
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => field.onChange('income')}
                                            className={cn(
                                                "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                                                field.value === 'income'
                                                    ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <span>📈</span> Receita
                                        </button>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>O que você comprou/recebeu?</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Assinatura Netflix, Supermercado..." className="bg-secondary/20 border-border/50 h-11" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor (R$)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0,00"
                                                className="bg-secondary/20 border-border/50 h-11 pl-9"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="mb-2">Data</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full h-11 pl-3 text-left font-normal bg-secondary/20 border-border/50 hover:bg-secondary/30",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "dd/MM/yyyy")
                                                    ) : (
                                                        <span>Hoje</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("2000-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>Categoria</FormLabel>
                                    <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary hover:bg-primary/10">
                                                + Nova
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[350px] border-border/50 bg-card/95 backdrop-blur-xl">
                                            <DialogHeader>
                                                <DialogTitle>Nova {selectedType === 'income' ? 'Receita' : 'Despesa'}</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex flex-col gap-4 py-4">
                                                <Input
                                                    placeholder="Nome da categoria"
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    className="bg-secondary/20 h-11"
                                                />
                                                <Button variant="hero" onClick={handleCreateCategory} disabled={!newCategoryName.trim() || addCategory.isPending}>
                                                    {addCategory.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                                    Salvar Categoria
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-secondary/20 border-border/50 h-11">
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="border-border/50 bg-card/95 backdrop-blur-xl">
                                        {filteredCategories.map((c) => (
                                            <SelectItem key={c.id} value={c.id} className="focus:bg-primary/10">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: c.color || '#fff' }}
                                                    />
                                                    {c.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notas (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Alguma observação?" className="bg-secondary/20 border-border/50 h-11" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="pt-4">
                    <Button type="submit" variant="hero" className="w-full h-12 text-base shadow-glow-sm" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            'Confirmar Lançamento'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
