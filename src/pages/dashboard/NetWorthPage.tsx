import { motion } from "framer-motion";
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
    ShieldCheck
} from "lucide-react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from "recharts";
import { useNetWorth, Asset, Liability } from "@/hooks/useNetWorth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export function NetWorthPage() {
    const { assets, liabilities, totalAssets, totalLiabilities, netWorth, isLoading, addAsset, addLiability } = useNetWorth();
    const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
    const [isLiabilityDialogOpen, setIsLiabilityDialogOpen] = useState(false);

    const formatCurrency = (val: number) => {
        return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    if (isLoading) {
        return <div className="p-8 text-center">Carregando patrimônio...</div>;
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
        <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Landmark className="w-8 h-8 text-primary" />
                        Consolidação de Patrimônio
                    </h1>
                    <p className="text-muted-foreground mt-1">Acompanhe seu patrimônio líquido e evolução financeira.</p>
                </div>
                <div className="glass p-4 rounded-2xl border-primary/20 bg-primary/5 min-w-[200px] shadow-glow-sm">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Patrimônio Líquido</span>
                    <p className="text-3xl font-black text-primary drop-shadow-glow">
                        {formatCurrency(netWorth)}
                    </p>
                </div>
            </header>

            {/* DISTRIBUTION CHART */}
            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 glass border-border/50 p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><PieIcon className="w-12 h-12" /></div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Distribuição</h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Ativos', value: totalAssets },
                                        { name: 'Passivos', value: totalLiabilities }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="hsl(var(--primary))" />
                                    <Cell fill="#ef4444" />
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex gap-6 mt-4 text-xs font-bold uppercase">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /> Ativos</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /> Passivos</div>
                    </div>
                </Card>

                <Card className="lg:col-span-2 glass border-border/50 p-8 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <TrendingUp className="w-32 h-32 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black mb-4">Sua Saúde Financeira</h3>
                    <p className="text-muted-foreground max-w-lg mb-8">
                        Seu patrimônio líquido é a diferença real entre o que você possui e o que você deve.
                        Manter uma proporção saudável acima de 70% é o ideal para a sua liberdade.
                    </p>
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                            <span>Indíce de Liquidez</span>
                            <span className="text-primary">{Math.round((netWorth / (totalAssets || 1)) * 100)}%</span>
                        </div>
                        <Progress value={Math.max(0, (netWorth / (totalAssets || 1)) * 100)} className="h-3 shadow-glow-sm" />
                    </div>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* ASSETS SECTION */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <TrendingUp className="text-green-500 w-5 h-5" />
                            Ativos
                        </h2>
                        <Dialog open={isAssetDialogOpen} onOpenChange={setIsAssetDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="rounded-full h-8 gap-1.5 border-green-500/20 text-green-500 hover:bg-green-500/10">
                                    <Plus className="w-3 h-3" /> Adicionar Ativo
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="glass">
                                <DialogHeader>
                                    <DialogTitle>Novo Ativo</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4 pt-4" onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    addAsset.mutate({
                                        name: formData.get('name') as string,
                                        type: formData.get('type') as any,
                                        value: Number(formData.get('value'))
                                    });
                                    setIsAssetDialogOpen(false);
                                }}>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Nome do Ativo</label>
                                        <Input name="name" placeholder="Ex: Conta Corrente, Apartamento..." required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground">Tipo</label>
                                            <Select name="type" defaultValue="cash">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cash">Dinheiro / Conta</SelectItem>
                                                    <SelectItem value="investment">Investimentos</SelectItem>
                                                    <SelectItem value="property">Imóvel</SelectItem>
                                                    <SelectItem value="vehicle">Veículo</SelectItem>
                                                    <SelectItem value="crypto">Criptomoeda</SelectItem>
                                                    <SelectItem value="stock">Ações (Bolsa)</SelectItem>
                                                    <SelectItem value="other">Outros</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground">Valor em R$ (ou Qtde para Cripto/Ações)</label>
                                            <Input name="value" type="number" step="0.00000001" placeholder="0,00" required />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Salvar Ativo</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-3">
                        {assets.map((asset, i) => {
                            const Icon = assetIcons[asset.type] || Building2;
                            return (
                                <motion.div
                                    key={asset.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass p-4 rounded-xl border-border/50 flex items-center justify-between group hover:border-green-500/30 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm ">{asset.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                                {asset.type}
                                                {(asset.type === 'crypto' || asset.type === 'stock') && asset.currentPrice && (
                                                    <span className="text-primary capitalize lowercase">
                                                        • {asset.value} unid. @ {formatCurrency(asset.currentPrice)}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-green-500">{formatCurrency(asset.totalValue || asset.value)}</p>
                                </motion.div>
                            );
                        })}
                        {assets.length === 0 && <p className="text-sm text-center text-muted-foreground py-8 border border-dashed rounded-xl">Nenhum ativo registrado.</p>}
                    </div>

                    <div className="pt-4 border-t border-border/50 flex justify-between items-center px-2">
                        <span className="text-sm text-muted-foreground">Total em Ativos</span>
                        <span className="text-xl font-bold text-green-500">{formatCurrency(totalAssets)}</span>
                    </div>
                </div>

                {/* LIABILITIES SECTION */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ArrowDownRight className="text-red-500 w-5 h-5" />
                            Passivos
                        </h2>
                        <Dialog open={isLiabilityDialogOpen} onOpenChange={setIsLiabilityDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="rounded-full h-8 gap-1.5 border-red-500/20 text-red-500 hover:bg-red-500/10">
                                    <Plus className="w-3 h-3" /> Adicionar Passivo
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="glass">
                                <DialogHeader>
                                    <DialogTitle>Novo Passivo</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4 pt-4" onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    addLiability.mutate({
                                        name: formData.get('name') as string,
                                        type: formData.get('type') as any,
                                        value: Number(formData.get('value'))
                                    });
                                    setIsLiabilityDialogOpen(false);
                                }}>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Nome do Passivo</label>
                                        <Input name="name" placeholder="Ex: Financiamento, Empréstimo..." required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground">Tipo</label>
                                            <Select name="type" defaultValue="other">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                                                    <SelectItem value="loan">Empréstimo</SelectItem>
                                                    <SelectItem value="mortgage">Financiamento</SelectItem>
                                                    <SelectItem value="other">Outros</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground">Valor (R$)</label>
                                            <Input name="value" type="number" step="0.01" placeholder="0,00" required />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Salvar Passivo</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-3">
                        {liabilities.map((lib, i) => {
                            const Icon = liabilityIcons[lib.type] || CreditCard;
                            return (
                                <motion.div
                                    key={lib.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass p-4 rounded-xl border-border/50 flex items-center justify-between group hover:border-red-500/30 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm ">{lib.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{lib.type}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-red-500">{formatCurrency(lib.value)}</p>
                                </motion.div>
                            );
                        })}
                        {liabilities.length === 0 && <p className="text-sm text-center text-muted-foreground py-8 border border-dashed rounded-xl">Nenhum passivo registrado.</p>}
                    </div>

                    <div className="pt-4 border-t border-border/50 flex justify-between items-center px-2">
                        <span className="text-sm text-muted-foreground">Total em Passivos</span>
                        <span className="text-xl font-bold text-red-500">{formatCurrency(totalLiabilities)}</span>
                    </div>
                </div>
            </div>

            {/* Footer Notice */}
            <div className="bg-primary/5 rounded-2xl p-6 flex gap-4 text-sm text-muted-foreground items-start border border-primary/10">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <p>Todos os dados de patrimônio e investimentos são criptografados localmente e sincronizados de forma segura com o Liberta Cloud.</p>
            </div>
        </div>
    );
}
