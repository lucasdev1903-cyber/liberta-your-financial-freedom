import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useGoals } from "@/hooks/useGoals";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Plus,
    Target,
    Trash,
    TrendingUp,
    CalendarIcon,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Popover as InfoPopover, PopoverContent as InfoPopoverContent, PopoverTrigger as InfoPopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const goalSchema = z.object({
    title: z.string().min(2, 'O título é muito curto'),
    target_amount: z.coerce.number().positive('O valor deve ser maior que zero'),
    current_amount: z.coerce.number().min(0).default(0),
    deadline: z.date({
        required_error: "A data limite é obrigatória",
    }),
    category: z.string().min(1, 'Selecione uma categoria'),
});

type GoalFormValues = z.infer<typeof goalSchema>;

const goalCategories = [
    { label: "Viagem", value: "travel", icon: "✈️" },
    { label: "Carro", value: "car", icon: "🚗" },
    { label: "Reserva", value: "savings", icon: "💰" },
    { label: "Casa", value: "home", icon: "🏠" },
    { label: "Estudos", value: "study", icon: "📚" },
    { label: "Outros", value: "other", icon: "🎯" },
];

export function GoalsPage() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { goals, isLoading, addGoal, deleteGoal, updateGoal } = useGoals();
    const { toast } = useToast();

    const form = useForm<GoalFormValues>({
        resolver: zodResolver(goalSchema),
        defaultValues: {
            title: "",
            target_amount: 0,
            current_amount: 0,
            category: "other",
        },
    });

    const onSubmit = async (data: GoalFormValues) => {
        setIsSubmitting(true);
        try {
            await addGoal.mutateAsync({
                title: data.title,
                target_amount: data.target_amount,
                current_amount: data.current_amount,
                deadline: format(data.deadline, "yyyy-MM-dd"),
                icon: goalCategories.find(c => c.value === data.category)?.icon || "🎯",
            } as any);
            toast({ title: "Meta criada com sucesso!" });
            setOpen(false);
            form.reset();
        } catch (error) {
            toast({ title: "Erro ao criar", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };
    // ... (rest of the component logic)

    const handleAddFunds = async (goalId: string, current: number, addition: number) => {
        try {
            await updateGoal.mutateAsync({
                id: goalId,
                current_amount: Number(current) + Number(addition)
            });
            toast({ title: "Valor adicionado à meta!" });
        } catch (error) {
            toast({ title: "Erro ao adicionar", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Deseja realmente excluir esta meta?")) {
            await deleteGoal.mutateAsync(id);
        }
    };

    const formatCurrency = (val: number) =>
        val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Target className="w-6 h-6 text-primary" />
                        Minhas Metas
                    </h1>
                    <p className="text-sm text-muted-foreground">Adicione e acompanhe seus objetivos financeiros</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="hero">
                            <Plus className="w-4 h-4 mr-2" /> Nova Meta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] border-border/50 bg-card/95 backdrop-blur-xl">
                        <DialogHeader>
                            <DialogTitle>Criar Nova Meta</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome da Meta</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Viagem para o Japão..." className="bg-secondary/20 border-border/50 h-11" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Meta</FormLabel>
                                            <div className="grid grid-cols-3 gap-2">
                                                {goalCategories.map((cat) => (
                                                    <button
                                                        key={cat.value}
                                                        type="button"
                                                        onClick={() => field.onChange(cat.value)}
                                                        className={cn(
                                                            "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1 hover:bg-primary/5",
                                                            field.value === cat.value
                                                                ? "border-primary bg-primary/10 shadow-glow-sm scale-105"
                                                                : "border-border/30 bg-secondary/10 opacity-70"
                                                        )}
                                                    >
                                                        <span className="text-xl">{cat.icon}</span>
                                                        <span className="text-[10px] font-medium uppercase tracking-tighter">{cat.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="target_amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Objetivo (R$)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                                                        <Input type="number" step="0.01" className="bg-secondary/20 border-border/50 h-11 pl-9" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="current_amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Já guardou (R$)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                                                        <Input type="number" step="0.01" className="bg-secondary/20 border-border/50 h-11 pl-9" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="deadline"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="mb-2">Data Limite</FormLabel>
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
                                                            {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione a data</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < new Date()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" variant="hero" className="w-full h-12 text-base shadow-glow mt-2" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                    Criar Meta Financeira
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-secondary/30 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : goals.length === 0 ? (
                <div className="text-center py-20 glass rounded-xl border-dashed">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <Target className="w-9 h-9 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Defina sua primeira meta 🎯</h2>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                        Metas te ajudam a manter o foco. Pode ser uma viagem, um carro, ou
                        sua reserva de emergência. A barra de progresso anima conforme você guarda!
                    </p>
                    <p className="text-xs text-muted-foreground">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-1" />
                        Clique em "Nova Meta" para começar
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal, i) => {
                        const perc = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));

                        return (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-xl p-6 border-border/50 relative group"
                            >
                                <button
                                    onClick={() => handleDelete(goal.id)}
                                    className="absolute top-4 right-4 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Excluir meta"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>

                                <h3 className="font-semibold text-lg mb-1 pr-6 truncate">{goal.title}</h3>
                                {goal.deadline && (
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Prazo: {format(new Date(goal.deadline), "dd 'de' MMM, yyyy", { locale: ptBR })}
                                    </p>
                                )}

                                <div className="flex items-end justify-between mb-2 mt-6">
                                    <div>
                                        <span className="text-2xl font-bold text-gradient">{formatCurrency(goal.current_amount)}</span>
                                        <span className="text-sm text-muted-foreground ml-2">de {formatCurrency(goal.target_amount)}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium">{perc}% concluído</span>
                                        <span className="text-muted-foreground">
                                            {perc >= 100 ? '🎉 Conquistado!' : `Faltam ${formatCurrency(goal.target_amount - goal.current_amount)}`}
                                        </span>
                                    </div>
                                    <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            className={cn(
                                                "absolute inset-y-0 left-0 rounded-full",
                                                perc >= 100 ? "bg-gradient-to-r from-green-500 to-emerald-400" : perc >= 70 ? "bg-gradient-to-r from-yellow-500 to-orange-400" : "bg-gradient-to-r from-primary to-blue-400"
                                            )}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${perc}%` }}
                                            transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.15 }}
                                        />
                                    </div>
                                </div>

                                {perc < 100 && (
                                    <div className="mt-6 pt-4 border-t border-border/50">
                                        <InfoPopover>
                                            <InfoPopoverTrigger asChild>
                                                <Button variant="outline" size="sm" className="w-full border-border/50 bg-secondary/20 hover:bg-secondary/50">
                                                    <TrendingUp className="w-4 h-4 mr-2" /> Adicionar R$
                                                </Button>
                                            </InfoPopoverTrigger>
                                            <InfoPopoverContent className="w-64 p-3 border-border/50 bg-card/95 backdrop-blur-xl">
                                                <div className="space-y-3">
                                                    <h4 className="text-sm font-semibold">Quanto você guardou?</h4>
                                                    <div className="flex gap-2">
                                                        <Input id={`add-${goal.id}`} type="number" placeholder="0,00" className="h-8 text-sm" />
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                const val = (document.getElementById(`add-${goal.id}`) as HTMLInputElement).value;
                                                                if (val && Number(val) > 0) handleAddFunds(goal.id, goal.current_amount, Number(val));
                                                            }}
                                                        >
                                                            Salvar
                                                        </Button>
                                                    </div>
                                                </div>
                                            </InfoPopoverContent>
                                        </InfoPopover>
                                    </div>
                                )}
                                {perc >= 100 && (
                                    <motion.div
                                        className="mt-6 pt-4 border-t border-green-500/30 text-center bg-green-500/5 rounded-xl p-4 -mx-2"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                    >
                                        <span className="text-3xl block mb-1">🎉🌟🏆</span>
                                        <p className="text-sm font-bold text-green-400">Meta Conquistada!</p>
                                        <p className="text-xs text-muted-foreground mt-1">Parabéns, você chegou lá! 🚀</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
