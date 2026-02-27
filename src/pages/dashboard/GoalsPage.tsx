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
    CalendarIcon
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
    deadline: z.date().optional(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

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
        },
    });

    const onSubmit = async (data: GoalFormValues) => {
        setIsSubmitting(true);
        try {
            await addGoal.mutateAsync({
                title: data.title,
                target_amount: data.target_amount,
                current_amount: data.current_amount,
                deadline: data.deadline ? format(data.deadline, "yyyy-MM-dd") : undefined,
            });
            toast({ title: "Meta criada com sucesso!" });
            setOpen(false);
            form.reset();
        } catch (error) {
            toast({ title: "Erro ao criar", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome da Meta</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Viagem, Carro Novo..." className="bg-secondary/30" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="target_amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Objetivo (R$)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" className="bg-secondary/30" {...field} />
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
                                                    <Input type="number" step="0.01" className="bg-secondary/30" {...field} />
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
                                            <FormLabel>Data Limite (Opcional)</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal bg-secondary/30",
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

                                <Button type="submit" variant="hero" className="w-full mt-4" disabled={isSubmitting}>
                                    {isSubmitting ? 'Salvando...' : 'Criar Meta'}
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
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Nenhuma meta ainda</h2>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                        Defina objetivos financeiros para acompanhar sua jornada rumo à liberdade.
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
                                            Faltam {formatCurrency(goal.target_amount - goal.current_amount)}
                                        </span>
                                    </div>
                                    <Progress value={perc} className="h-2 bg-secondary" />
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
                                    <div className="mt-6 pt-4 border-t border-border/50 text-center">
                                        <p className="text-sm font-semibold text-green-400">🎉 Meta alcançada!</p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
