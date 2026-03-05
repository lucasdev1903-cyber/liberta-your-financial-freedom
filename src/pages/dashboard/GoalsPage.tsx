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
    Loader2,
    Sparkles,
    ChevronRight,
    Star,
    CheckCircle2
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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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
    const { goals, isLoading, addGoal, deleteGoal } = useGoals();
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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 animate-pulse">Mapeando seus objetivos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 page-enter pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight leading-tight">Metas Financeiras</h1>
                    <p className="text-sm text-muted-foreground font-medium opacity-80 mt-1.5">Trabalhe duro, realize seus sonhos. Gerencie seus planos aqui.</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-glow-sm hover:scale-105 active:scale-95 transition-all">
                            <Plus className="w-4 h-4 mr-2" /> Nova Meta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px] glass-card border-white/10 rounded-[2rem] p-8">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black tracking-tight">Criar Nova Meta</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Título da Meta</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Viagem para o Japão" {...field} className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" />
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
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Valor Alvo (R$)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" />
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
                                                <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Já Tenho (R$)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" />
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
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Data Limite</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"ghost"}
                                                            className={cn(
                                                                "h-12 w-full pl-3 text-left font-medium bg-white/5 border border-white/5 rounded-xl",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP", { locale: ptBR })
                                                            ) : (
                                                                <span>Selecione uma data</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 glass-card" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date()
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Categoria</FormLabel>
                                            <div className="grid grid-cols-3 gap-2">
                                                {goalCategories.map((cat) => (
                                                    <button
                                                        key={cat.value}
                                                        type="button"
                                                        onClick={() => field.onChange(cat.value)}
                                                        className={cn(
                                                            "h-12 flex flex-col items-center justify-center rounded-xl border transition-all gap-1",
                                                            field.value === cat.value
                                                                ? "bg-primary/20 border-primary text-primary shadow-glow-sm"
                                                                : "bg-white/5 border-white/5 text-muted-foreground/60 hover:bg-white/10"
                                                        )}
                                                    >
                                                        <span className="text-lg">{cat.icon}</span>
                                                        <span className="text-[8px] font-black uppercase">{cat.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-glow-sm mt-4" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Meta"}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Stats Summary */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Target className="w-20 h-20 text-primary" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">Engajamento Total</p>
                            <h2 className="text-4xl font-black tracking-tighter mb-6">{goals.length} Metas <span className="text-primary">Ativas</span></h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Meta Próxima</span>
                                    <span className="text-xs font-black text-primary uppercase">Viagem ✈️</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Meta Concluída</span>
                                    <span className="text-xs font-black text-green-500 uppercase tracking-widest">Reserva 💰</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lia AI Coaching */}
                    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-gradient-to-br from-primary/[0.05] to-transparent relative overflow-hidden group shadow-glow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Lia Goal Coach</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-6 italic opacity-80">
                            "Você está a apenas R$ 1.200,00 de concluir sua meta de Viagem! Com base no seu saldo atual, você pode antecipar esse sonho em 2 meses."
                        </p>
                        <Button variant="ghost" className="h-10 px-0 hover:bg-transparent text-[10px] font-black uppercase tracking-widest group/btn text-primary">
                            OTIMIZAR APORTES <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>

                {/* Goals Grid */}
                <div className="lg:col-span-2">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {goals.map((goal: any, i) => {
                                const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
                                const isCompleted = progress >= 100;

                                return (
                                    <motion.div
                                        key={goal.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="glass-card rounded-[2.5rem] p-8 border-white/5 relative group hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                                    {goal.icon || "🎯"}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black tracking-tight">{goal.title}</h3>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1 flex items-center gap-2">
                                                        <CalendarIcon className="w-3 h-3" />
                                                        {format(new Date(goal.deadline), "MMM yyyy", { locale: ptBR })}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteGoal.mutate(goal.id)}
                                                className="p-2 rounded-xl text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-end justify-between">
                                                <p className="text-xs font-black tracking-tight flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Acumulado</span>
                                                    <span className="text-lg">{goal.current_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                </p>
                                                <p className="text-right text-xs font-black tracking-tight flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Objetivo</span>
                                                    <span className="opacity-60">{goal.target_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                </p>
                                            </div>

                                            <div className="relative pt-2">
                                                <Progress
                                                    value={progress}
                                                    className="h-3 rounded-full bg-white/[0.03]"
                                                />
                                                <div className="absolute top-0 right-0 -mr-1">
                                                    <div className={cn(
                                                        "text-[9px] font-black px-2 py-0.5 rounded-full shadow-glow-sm",
                                                        isCompleted ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
                                                    )}>
                                                        {progress.toFixed(0)}%
                                                    </div>
                                                </div>
                                            </div>

                                            {isCompleted && (
                                                <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded-xl text-green-500 text-[9px] font-black uppercase tracking-widest animate-pulse mt-2">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Objetivo Alcançado!
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
