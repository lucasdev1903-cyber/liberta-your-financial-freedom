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
    ShieldCheck,
    Activity,
    Award
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend
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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function NetWorthPage() {
    const { toast } = useToast();
    const { assets, liabilities, totalAssets, totalLiabilities, netWorth, isLoading, addAsset, addLiability, deleteAsset, deleteLiability } = useNetWorth();
    const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
    const [isLiabilityDialogOpen, setIsLiabilityDialogOpen] = useState(false);

    // Form states
    const [assetName, setAssetName] = useState("");
    const [assetType, setAssetType] = useState("cash");
    const [assetValue, setAssetValue] = useState("");

    const [libName, setLibName] = useState("");
    const [libType, setLibType] = useState("other");
    const [libValue, setLibValue] = useState("");

    // Helper to parse values "freely" (supports 230000, 230.000,00, 230,00 etc)
    const parseValue = (val: string) => {
        if (!val) return 0;
        // If it has a comma, it's Portuguese format. Replace dots (thousands) and then comma (decimal)
        if (val.includes(',')) {
            const clean = val.replace(/\./g, '').replace(',', '.');
            return parseFloat(clean) || 0;
        }
        // If it was just 230000, parseFloat(val) is correct
        return parseFloat(val) || 0;
    };

    const formatCurrency = (val: number) => {
        return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

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

    // Asset Allocation Data
    const allocationData = useMemo(() => {
        const groups: Record<string, number> = {};
        assets.forEach(a => {
            const type = a.type;
            groups[type] = (groups[type] || 0) + (a.totalValue || a.value);
        });

        const typeLabels: Record<string, string> = {
            cash: 'Liquidez',
            investment: 'Investimentos',
            property: 'Imóveis',
            vehicle: 'Veículos',
            crypto: 'Cripto',
            stock: 'Ações',
            other: 'Outros'
        };

        const colors: Record<string, string> = {
            cash: '#22c55e',
            investment: '#3b82f6',
            property: '#f59e0b',
            vehicle: '#ec4899',
            stock: '#8b5cf6',
            crypto: '#f97316',
            other: '#94a3b8'
        };

        return Object.entries(groups).map(([type, value]) => ({
            name: typeLabels[type] || type,
            value,
            color: colors[type] || '#ccc'
        })).sort((a, b) => b.value - a.value);
    }, [assets]);

    // Liquidity breakdown
    const liquidValue = useMemo(() => {
        return assets
            .filter(a => ['cash', 'crypto', 'stock', 'investment'].includes(a.type))
            .reduce((sum, a) => sum + (a.totalValue || a.value), 0);
    }, [assets]);

    const fixedValue = totalAssets - liquidValue;

    if (isLoading) {
        return <div className="p-8 text-center">Carregando patrimônio...</div>;
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Patrimônio</Badge>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">Fase 3: Inteligência</Badge>
                    </div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Landmark className="w-8 h-8 text-primary" />
                        Consolidação de Patrimônio
                    </h1>
                    <p className="text-muted-foreground">Acompanhe sua saúde financeira de longo prazo.</p>
                </div>
                <div className="glass p-5 rounded-3xl border-primary/20 bg-primary/5 min-w-[240px] shadow-glow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">Patrimônio Líquido</span>
                    <p className="text-4xl font-black text-primary drop-shadow-glow mt-1">
                        {formatCurrency(netWorth)}
                    </p>
                </div>
            </header>

            {/* DISTRIBUTION & ALLOCATION */}
            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 glass border-border/50 p-6 flex flex-col relative overflow-hidden min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold">Alocação de Ativos</h3>
                            <p className="text-xs text-muted-foreground">Onde seu capital está distribuído</p>
                        </div>
                        <PieIcon className="w-5 h-5 text-muted-foreground opacity-30" />
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full h-[250px] md:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={allocationData}
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={8}
                                    >
                                        {allocationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                                        formatter={(val: number) => formatCurrency(val)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {allocationData.map((item) => (
                                <div key={item.name} className="flex flex-col gap-1 p-3 rounded-2xl bg-secondary/20 border border-border/20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-black">{formatCurrency(item.value)}</span>
                                    <span className="text-[10px] text-primary">{totalAssets > 0 ? Math.round((item.value / totalAssets) * 100) : 0}% do total</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                <div className="flex flex-col gap-6">
                    <Card className="glass border-border/50 p-6 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
                            <Activity className="w-16 h-16 text-primary" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Liquidez Imediata</h3>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-2xl font-black text-green-500">{formatCurrency(liquidValue)}</span>
                            <span className="text-xs font-bold text-muted-foreground">{totalAssets > 0 ? Math.round((liquidValue / totalAssets) * 100) : 0}%</span>
                        </div>
                        <Progress value={totalAssets > 0 ? (liquidValue / totalAssets) * 100 : 0} className="h-2 bg-secondary" indicatorClassName="bg-green-500 shadow-glow-sm" />
                        <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                            Valor disponível em caixa, ações e cripto que podem ser convertidos rapidamente.
                        </p>
                    </Card>

                    <Card className="glass border-border/50 p-6 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
                            <Home className="w-16 h-16 text-primary" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Patrimônio Imobilizado</h3>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-2xl font-black text-blue-500">{formatCurrency(fixedValue)}</span>
                            <span className="text-xs font-bold text-muted-foreground">{totalAssets > 0 ? Math.round((fixedValue / totalAssets) * 100) : 0}%</span>
                        </div>
                        <Progress value={totalAssets > 0 ? (fixedValue / totalAssets) * 100 : 0} className="h-2 bg-secondary" indicatorClassName="bg-blue-500" />
                        <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                            Bens de menor liquidez, como imóveis e veículos.
                        </p>
                    </Card>

                    <Card className="glass border-red-500/20 bg-red-500/5 p-6 flex flex-col justify-center relative overflow-hidden">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-red-400 mb-4">Índice de Dívida</h3>
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-2xl font-black text-red-500">{totalAssets > 0 ? Math.round((totalLiabilities / totalAssets) * 100) : 0}%</span>
                            <ArrowDownRight className="w-5 h-5 text-red-400" />
                        </div>
                        <Progress value={totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0} className="h-2 bg-red-500/10" indicatorClassName="bg-red-500" />
                        <p className="text-[10px] text-red-400/70 mt-3 leading-relaxed">
                            {totalLiabilities > 0 ? "Foque em manter este índice abaixo de 30% para segurança." : "Excelente! Você não possui dívidas pendentes."}
                        </p>
                    </Card>
                </div>
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
                                <form className="space-y-4 pt-4" onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        await addAsset.mutateAsync({
                                            name: assetName,
                                            type: assetType as any,
                                            value: parseValue(assetValue)
                                        });
                                        toast({
                                            title: "Ativo adicionado",
                                            description: `${assetName} foi salvo com sucesso.`
                                        });
                                        setIsAssetDialogOpen(false);
                                        // Reset form
                                        setAssetName("");
                                        setAssetType("cash");
                                        setAssetValue("");
                                    } catch (err: any) {
                                        toast({
                                            title: "Erro ao salvar",
                                            description: err.message || "Não foi possível salvar o ativo. Verifique se a tabela 'assets' existe.",
                                            variant: "destructive"
                                        });
                                    }
                                }}>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Nome do Ativo</label>
                                        <Input
                                            value={assetName}
                                            onChange={(e) => setAssetName(e.target.value)}
                                            placeholder="Ex: Conta Corrente, Apartamento..."
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground">Tipo</label>
                                            <Select value={assetType} onValueChange={setAssetType}>
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
                                            <label className="text-xs font-bold uppercase text-muted-foreground">Valor (R$ ou Qtde)</label>
                                            <Input
                                                value={assetValue}
                                                onChange={(e) => setAssetValue(e.target.value)}
                                                type="text"
                                                placeholder="0,00"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={addAsset.isPending}>
                                        {addAsset.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Salvar Ativo
                                    </Button>
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
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass p-4 rounded-xl border-border/50 flex items-center justify-between group hover:border-green-500/30 transition-shadow"
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
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-green-500">{formatCurrency(asset.totalValue || asset.value)}</p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => {
                                                if (confirm(`Tem certeza que deseja excluir o ativo "${asset.name}"?`)) {
                                                    deleteAsset.mutate(asset.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
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
                                <form className="space-y-4 pt-4" onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        await addLiability.mutateAsync({
                                            name: libName,
                                            type: libType as any,
                                            value: parseValue(libValue)
                                        });
                                        toast({
                                            title: "Passivo adicionado",
                                            description: `${libName} foi salvo com sucesso.`
                                        });
                                        setIsLiabilityDialogOpen(false);
                                        // Reset form
                                        setLibName("");
                                        setLibType("other");
                                        setLibValue("");
                                    } catch (err: any) {
                                        toast({
                                            title: "Erro ao salvar",
                                            description: err.message || "Não foi possível salvar o passivo.",
                                            variant: "destructive"
                                        });
                                    }
                                }}>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Nome do Passivo</label>
                                        <Input
                                            value={libName}
                                            onChange={(e) => setLibName(e.target.value)}
                                            placeholder="Ex: Financiamento, Empréstimo..."
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground">Tipo</label>
                                            <Select value={libType} onValueChange={setLibType}>
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
                                            <Input
                                                value={libValue}
                                                onChange={(e) => setLibValue(e.target.value)}
                                                type="text"
                                                placeholder="0,00"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={addLiability.isPending}>
                                        {addLiability.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Salvar Passivo
                                    </Button>
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
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass p-4 rounded-xl border-border/50 flex items-center justify-between group hover:border-red-500/30 transition-shadow"
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
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-red-500">{formatCurrency(lib.value)}</p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => {
                                                if (confirm(`Tem certeza que deseja excluir o passivo "${lib.name}"?`)) {
                                                    deleteLiability.mutate(lib.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
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
