import { motion, AnimatePresence } from "framer-motion";
import {
    Landmark,
    TrendingUp,
    ArrowDownRight,
    Plus,
    Wallet,
    Building2,
    Car,
    CreditCard,
    Home,
    Trash2,
    Bitcoin,
    LineChart,
    PieChart as PieIcon,
    ShieldCheck,
    ArrowUpRight,
    Sparkles,
    ChevronRight,
    Loader2
} from "lucide-react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from "recharts";
import { useNetWorth, Asset, Liability } from "@/hooks/useNetWorth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ASSET_COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

export function NetWorthPage() {
    const { assets, liabilities, totalAssets, totalLiabilities, netWorth, isLoading, addAsset, addLiability, deleteAsset, deleteLiability } = useNetWorth();
    const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
    const [isLiabilityDialogOpen, setIsLiabilityDialogOpen] = useState(false);

    const formatCurrency = (val: number) => {
        return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 animate-pulse">Consolidando patrimônio global...</p>
            </div>
        );
    }

    const assetIcons: Record<string, any> = {
        cash: Wallet,
        investment: TrendingUp,
        property: Home,
        vehicle: Car,
        crypto: Bitcoin,
        stock: LineChart,
        other: Building2
    };

    const liabilityIcons: Record<string, any> = {
        credit_card: CreditCard,
        loan: ArrowDownRight,
        mortgage: Home,
        other: CreditCard
    };

    return (
        <div className="space-y-8 page-enter pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight leading-tight">Patrimônio Líquido</h1>
                    <p className="text-sm text-muted-foreground font-medium opacity-80 mt-1.5">Visão consolidada de todos os seus bens e obrigações.</p>
                </div>

                <div className="glass-card px-8 py-5 rounded-[2rem] border-primary/20 bg-primary/5 min-w-[280px] shadow-glow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                        <Landmark className="w-12 h-12" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Total Consolidado</span>
                    <p className="text-3xl font-black text-primary tracking-tighter mt-1 tabular-nums">
                        {formatCurrency(netWorth)}
                    </p>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Distribution & AI Column */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-card rounded-[2.5rem] p-10 border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-10 self-start">Alocação de Ativos</h3>
                        <div className="h-64 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={assets.length > 0 ? assets : [{ name: 'Vazio', value: 1 }]}
                                        innerRadius={80}
                                        outerRadius={105}
                                        paddingAngle={10}
                                        dataKey="amount"
                                        stroke="none"
                                    >
                                        {assets.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={ASSET_COLORS[index % ASSET_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="glass-card border-white/10 p-3 rounded-xl shadow-2xl">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{payload[0].name}</p>
                                                        <p className="text-xs font-black">{formatCurrency(payload[0].value as number)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">Ativos</span>
                                <span className="text-xl font-black">{formatCurrency(totalAssets).split(',')[0]}</span>
                            </div>
                        </div>
                    </div>

                    {/* Lia AI Asset Strategy */}
                    <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-gradient-to-br from-primary/[0.05] to-transparent relative overflow-hidden group shadow-glow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Lia Wealth Strategy</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-6 italic opacity-80">
                            "Sua liquidez imediata representa 65% do patrimônio. Recomendo diversificar R$ 15.000,00 em ativos de renda fixa para proteção inflacionária."
                        </p>
                        <Button variant="ghost" className="h-10 px-0 hover:bg-transparent text-[10px] font-black uppercase tracking-widest group/btn text-primary">
                            VER PLANO DE ALOCAÇÃO <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>

                {/* Assets & Liabilities Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* ATIVOS */}
                    <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border-white/5 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-1">Portfolio de Bens</h3>
                                <h2 className="text-2xl font-black tracking-tight">Ativos & Investimentos</h2>
                            </div>
                            <Dialog open={isAssetDialogOpen} onOpenChange={setIsAssetDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className="h-11 px-5 rounded-xl bg-primary/10 text-primary border border-primary/20 font-black text-[10px] uppercase tracking-widest hover:bg-primary/20">
                                        <Plus className="w-4 h-4 mr-2" /> Adicionar Ativo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="glass-card border-white/10 rounded-[2rem] p-8">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-black tracking-tight">Adicionar Novo Ativo</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const fd = new FormData(e.currentTarget);
                                        addAsset.mutate({
                                            name: fd.get("name") as string,
                                            type: fd.get("type") as any,
                                            amount: Number(fd.get("amount")),
                                            category: fd.get("type") as string
                                        });
                                        setIsAssetDialogOpen(false);
                                    }} className="space-y-5 mt-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Nome do Ativo</label>
                                            <Input name="name" placeholder="Ex: Conta Corrente Itaú" className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Tipo</label>
                                                <Select name="type" defaultValue="cash">
                                                    <SelectTrigger className="h-12 bg-white/5 border-white/5 rounded-xl font-medium">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="glass-card">
                                                        <SelectItem value="cash">Liquidez</SelectItem>
                                                        <SelectItem value="investment">Investimento</SelectItem>
                                                        <SelectItem value="crypto">Cripto</SelectItem>
                                                        <SelectItem value="property">Imóvel</SelectItem>
                                                        <SelectItem value="vehicle">Veículo</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Valor (R$)</label>
                                                <Input name="amount" type="number" step="0.01" placeholder="0,00" className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" required />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-glow-sm mt-4">
                                            Confirmar Ativo
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-4">
                            {assets.map((asset, i) => {
                                const Icon = assetIcons[asset.type] || Building2;
                                return (
                                    <motion.div
                                        key={asset.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-sm tracking-tight">{asset.name}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{asset.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <p className="text-lg font-black tracking-tighter tabular-nums">{formatCurrency(asset.amount)}</p>
                                            <button
                                                onClick={() => deleteAsset.mutate(asset.id)}
                                                className="p-2 rounded-lg text-muted-foreground/20 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* PASSIVOS */}
                    <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border-white/5 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/60 mb-1">Obrigações & Dívidas</h3>
                                <h2 className="text-2xl font-black tracking-tight">Passivos Totais</h2>
                            </div>
                            <Dialog open={isLiabilityDialogOpen} onOpenChange={setIsLiabilityDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className="h-11 px-5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20">
                                        <Plus className="w-4 h-4 mr-2" /> Novo Passivo
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="glass-card border-white/10 rounded-[2rem] p-8 text-foreground">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-black tracking-tight">Adicionar Novo Passivo</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const fd = new FormData(e.currentTarget);
                                        addLiability.mutate({
                                            name: fd.get("name") as string,
                                            type: fd.get("type") as any,
                                            amount: Number(fd.get("amount")),
                                            category: fd.get("type") as string
                                        });
                                        setIsLiabilityDialogOpen(false);
                                    }} className="space-y-5 mt-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Descrição do Passivo</label>
                                            <Input name="name" placeholder="Ex: Financiamento Imobiliário" className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Tipo</label>
                                                <Select name="type" defaultValue="loan">
                                                    <SelectTrigger className="h-12 bg-white/5 border-white/5 rounded-xl font-medium">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="glass-card">
                                                        <SelectItem value="loan">Empréstimo</SelectItem>
                                                        <SelectItem value="mortgage">Financiamento</SelectItem>
                                                        <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                                                        <SelectItem value="other">Outros</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Valor total (R$)</label>
                                                <Input name="amount" type="number" step="0.01" placeholder="0,00" className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" required />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full h-12 rounded-xl bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.3)] mt-4 hover:bg-red-600">
                                            Confirmar Passivo
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-4">
                            {liabilities.map((liability, i) => {
                                const Icon = liabilityIcons[liability.type] || CreditCard;
                                return (
                                    <motion.div
                                        key={liability.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-sm tracking-tight">{liability.name}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{liability.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <p className="text-lg font-black tracking-tighter tabular-nums text-red-500/80">{formatCurrency(liability.amount)}</p>
                                            <button
                                                onClick={() => deleteLiability.mutate(liability.id)}
                                                className="p-2 rounded-lg text-muted-foreground/20 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
