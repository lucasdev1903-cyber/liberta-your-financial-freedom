import { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus, Trash2, Edit2, Wallet, CreditCard,
    Home, Car, Banknote, Landmark, TrendingUp,
    TrendingDown, Info, DollarSign
} from "lucide-react";
import { useNetWorth } from "@/hooks/useNetWorth";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from "recharts";

const assetTypes = [
    { value: 'cash', label: 'Dinheiro / Conta Corrente', icon: Banknote },
    { value: 'investment', label: 'Investimentos', icon: TrendingUp },
    { value: 'property', label: 'Imóveis', icon: Home },
    { value: 'vehicle', label: 'Veículos', icon: Car },
    { value: 'other', label: 'Outros Ativos', icon: Wallet },
];

const liabilityTypes = [
    { value: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard },
    { value: 'loan', label: 'Empréstimos', icon: Landmark },
    { value: 'mortgage', label: 'Financiamentos', icon: Home },
    { value: 'other', label: 'Outros Passivos', icon: Info },
];

export function NetWorthPage() {
    const {
        assets, liabilities, history,
        totalAssets, totalLiabilities, netWorth,
        isLoading, addAsset, updateAsset, deleteAsset,
        addLiability, updateLiability, deleteLiability
    } = useNetWorth();

    const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
    const [isLiabilityModalOpen, setIsLiabilityModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        value: ""
    });

    const formatCurrency = (val: number) => {
        return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const handleOpenAssetModal = (item?: any) => {
        if (item) {
            setEditingItem({ ...item, isAsset: true });
            setFormData({ name: item.name, type: item.type, value: item.value.toString() });
        } else {
            setEditingItem(null);
            setFormData({ name: "", type: "cash", value: "" });
        }
        setIsAssetModalOpen(true);
    };

    const handleOpenLiabilityModal = (item?: any) => {
        if (item) {
            setEditingItem({ ...item, isAsset: false });
            setFormData({ name: item.name, type: item.type, value: item.value.toString() });
        } else {
            setEditingItem(null);
            setFormData({ name: "", type: "credit_card", value: "" });
        }
        setIsLiabilityModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseFloat(formData.value);
        if (isNaN(value)) return;

        if (editingItem) {
            if (editingItem.isAsset) {
                await updateAsset.mutateAsync({ id: editingItem.id, name: formData.name, type: formData.type as any, value });
            } else {
                await updateLiability.mutateAsync({ id: editingItem.id, name: formData.name, type: formData.type as any, value });
            }
        } else {
            if (isAssetModalOpen) {
                await addAsset.mutateAsync({ name: formData.name, type: formData.type as any, value });
            } else {
                await addLiability.mutateAsync({ name: formData.name, type: formData.type as any, value });
            }
        }

        setIsAssetModalOpen(false);
        setIsLiabilityModalOpen(false);
    };

    const handleDelete = async (id: string, isAsset: boolean) => {
        if (confirm("Tem certeza que deseja excluir este item?")) {
            if (isAsset) await deleteAsset.mutateAsync(id);
            else await deleteLiability.mutateAsync(id);
        }
    };

    if (isLoading) return <div className="p-8 text-center bg-secondary/20 rounded-xl animate-pulse h-96" />;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Consolidação de Patrimônio</h1>
                    <p className="text-muted-foreground">Acompanhe a evolução da sua riqueza real.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => handleOpenAssetModal()} className="shadow-glow">
                        <Plus className="w-4 h-4 mr-2" /> Adicionar Ativo
                    </Button>
                    <Button variant="outline" onClick={() => handleOpenLiabilityModal()}>
                        <Plus className="w-4 h-4 mr-2" /> Adicionar Passivo
                    </Button>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid sm:grid-cols-3 gap-6">
                <motion.div
                    className="glass p-6 rounded-[2rem] border-green-500/20 bg-green-500/5"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <span className="text-sm font-bold opacity-70">Total em Ativos</span>
                    </div>
                    <p className="text-3xl font-black text-green-500">{formatCurrency(totalAssets)}</p>
                </motion.div>

                <motion.div
                    className="glass p-6 rounded-[2rem] border-red-500/20 bg-red-500/5"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-sm font-bold opacity-70">Total em Passivos</span>
                    </div>
                    <p className="text-3xl font-black text-red-500">{formatCurrency(totalLiabilities)}</p>
                </motion.div>

                <motion.div
                    className="glass-strong p-6 rounded-[2rem] border-primary/30 shadow-glow bg-primary/5"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-bold opacity-70">Patrimônio Líquido</span>
                    </div>
                    <p className="text-3xl font-black text-primary">{formatCurrency(netWorth)}</p>
                </motion.div>
            </div>

            {/* Chart */}
            <motion.div
                className="glass p-8 rounded-[2.5rem] border-border/50"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            >
                <h2 className="text-xl font-bold mb-8">Evolução do Patrimônio</h2>
                <div className="h-80 w-full">
                    {history.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                <XAxis dataKey="snapshot_date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `R$${val >= 1000 ? val / 1000 + 'k' : val}`} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', backdropFilter: 'blur(4px)' }}
                                    formatter={(val: number) => [formatCurrency(val), 'Patrimônio']}
                                />
                                <Area type="monotone" dataKey="net_worth" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorNetWorth)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground border border-dashed rounded-3xl border-border/50">
                            <Info className="w-10 h-10 mb-2 opacity-20" />
                            <p>Dados de evolução serão exibidos conforme você atualiza seu patrimônio.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Assets & Liabilities List */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Assets */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold px-2 flex items-center justify-between">
                        Ativos
                        <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{assets.length} itens</span>
                    </h2>
                    <div className="space-y-3">
                        {assets.map((asset) => {
                            const typeInfo = assetTypes.find(t => t.value === asset.type);
                            return (
                                <div key={asset.id} className="glass p-4 rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                            {typeInfo && <typeInfo.icon className="w-5 h-5 text-primary/70" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{asset.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{typeInfo?.label}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="font-bold text-green-500">{formatCurrency(asset.value)}</p>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenAssetModal(asset)}><Edit2 className="w-3 h-3" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400" onClick={() => handleDelete(asset.id, true)}><Trash2 className="w-3 h-3" /></Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {assets.length === 0 && <p className="text-center py-10 text-muted-foreground text-sm italic">Nenhum ativo registrado.</p>}
                    </div>
                </div>

                {/* Liabilities */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold px-2 flex items-center justify-between">
                        Passivos
                        <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-full">{liabilities.length} itens</span>
                    </h2>
                    <div className="space-y-3">
                        {liabilities.map((liability) => {
                            const typeInfo = liabilityTypes.find(t => t.value === liability.type);
                            return (
                                <div key={liability.id} className="glass p-4 rounded-2xl flex items-center justify-between group hover:border-red-500/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/5 flex items-center justify-center">
                                            {typeInfo && <typeInfo.icon className="w-5 h-5 text-red-500/70" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{liability.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{typeInfo?.label}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="font-bold text-red-500">{formatCurrency(liability.value)}</p>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenLiabilityModal(liability)}><Edit2 className="w-3 h-3" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400" onClick={() => handleDelete(liability.id, false)}><Trash2 className="w-3 h-3" /></Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {liabilities.length === 0 && <p className="text-center py-10 text-muted-foreground text-sm italic">Nenhum passivo registrado.</p>}
                    </div>
                </div>
            </div>

            {/* Asset Modal */}
            <Dialog open={isAssetModalOpen} onOpenChange={setIsAssetModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Editar Ativo" : "Adicionar Novo Ativo"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Ativo</Label>
                            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {assetTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="value">Valor Atual (R$)</Label>
                            <Input id="value" type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} required />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="submit" className="w-full">{editingItem ? "Salvar Alterações" : "Adicionar Ativo"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Liability Modal */}
            <Dialog open={isLiabilityModalOpen} onOpenChange={setIsLiabilityModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Editar Passivo" : "Adicionar Novo Passivo"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Passivo</Label>
                            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {liabilityTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="value">Valor Atual (R$)</Label>
                            <Input id="value" type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} required />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="submit" variant="destructive" className="w-full">{editingItem ? "Salvar Alterações" : "Adicionar Passivo"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
