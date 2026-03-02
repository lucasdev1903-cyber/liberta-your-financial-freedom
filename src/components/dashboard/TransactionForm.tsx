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
    const { addTransaction } = useTransactions();
    const { categories } = useCategories();
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
        setIsSubmitting(true);
        try {
            await addTransaction.mutateAsync({
                ...data,
                date: format(data.date, 'yyyy-MM-dd'),
            } as any);
            toast({
                title: 'Lançamento salvo',
                description: 'Seu lançamento foi adicionado com sucesso.',
            });
            form.reset();
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast({
                title: 'Erro ao salvar',
                description: error.message || 'Ocorreu um erro ao salvar o lançamento.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
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
                                <FormLabel>Categoria</FormLabel>
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
