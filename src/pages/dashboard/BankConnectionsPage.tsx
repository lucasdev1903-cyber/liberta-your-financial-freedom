import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Plus, Upload, RefreshCw, SmartphoneNfc, Trash2, FileText, CheckCircle2, AlertCircle, Building2, X, Loader2, Landmark, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBankConnections } from "@/hooks/useBankConnections";
import { parseOFX, parseCSV, ParsedTransaction } from "@/lib/bankParser";
import { SUPPORTED_BANKS, isPluggyConfigured, getPluggyClientId } from "@/lib/pluggy";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function BankConnectionsPage() {
    const { connections, isLoading, addConnection, deleteConnection, importTransactions } = useBankConnections();
    const { user } = useAuth();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showAddBank, setShowAddBank] = useState(false);
    const [selectedBank, setSelectedBank] = useState<typeof SUPPORTED_BANKS[0] | null>(null);
    const [accountType, setAccountType] = useState('checking');
    const [lastFour, setLastFour] = useState('');
    const [balance, setBalance] = useState('');

    // Import state
    const [showImport, setShowImport] = useState(false);
    const [parsedTransactions, setParsedTransactions] = useState<ParsedTransaction[]>([]);
    const [importing, setImporting] = useState(false);
    const [importFileName, setImportFileName] = useState('');

    // Pluggy state
    const [pluggyLoading, setPluggyLoading] = useState(false);

    const handlePluggyConnect = async () => {
        if (!user) return;
        setPluggyLoading(true);
        try {
            // 1. Get connect token from Edge Function
            const { data: tokenData, error: tokenError } = await supabase.functions.invoke('pluggy-connect', {
                body: { action: 'create-token', userId: user.id },
            });
            if (tokenError) throw tokenError;
            if (tokenData?.error) throw new Error(tokenData.error);

            const connectToken = tokenData?.connectToken;
            if (!connectToken) throw new Error('Token não gerado');

            // 2. Open Pluggy Connect widget
            const clientId = getPluggyClientId();
            const widgetUrl = `https://connect.pluggy.ai/?connectToken=${connectToken}&clientId=${clientId}`;

            const popup = window.open(widgetUrl, 'pluggy-connect', 'width=450,height=650,toolbar=no,menubar=no');

            toast({ title: "🏦 Conecte seu banco", description: "Complete a autenticação na janela que abriu" });

            // 3. Listen for success message
            const handler = async (event: MessageEvent) => {
                if (event.data?.event === 'close' || event.data?.itemId) {
                    window.removeEventListener('message', handler);
                    popup?.close();

                    if (event.data?.itemId) {
                        toast({ title: "⏳ Sincronizando transações..." });
                        // Fetch accounts
                        await supabase.functions.invoke('pluggy-connect', {
                            body: { action: 'get-accounts', itemId: event.data.itemId, userId: user.id },
                        });
                        // Fetch transactions
                        const { data: txData } = await supabase.functions.invoke('pluggy-connect', {
                            body: { action: 'get-transactions', itemId: event.data.itemId, userId: user.id },
                        });
                        toast({ title: `✅ ${txData?.imported || 0} transações sincronizadas!` });
                        window.location.reload();
                    }
                }
            };
            window.addEventListener('message', handler);

            // Timeout fallback
            setTimeout(() => {
                window.removeEventListener('message', handler);
                setPluggyLoading(false);
            }, 120000);

        } catch (error: any) {
            toast({ title: "Erro na conexão Pluggy", description: error.message, variant: "destructive" });
        } finally {
            setPluggyLoading(false);
        }
    };

    const handleAddBank = async () => {
        if (!selectedBank) return;
        try {
            await addConnection.mutateAsync({
                bank_name: selectedBank.name,
                bank_code: selectedBank.code,
                bank_logo: selectedBank.logo,
                account_type: accountType,
                last_four: lastFour || null,
                balance: parseFloat(balance) || 0,
                status: 'connected',
                last_synced_at: new Date().toISOString(),
            });
            toast({ title: `✅ ${selectedBank.name} adicionado!` });
            setShowAddBank(false);
            setSelectedBank(null);
            setLastFour('');
            setBalance('');
        } catch { toast({ title: "Erro ao adicionar", variant: "destructive" }); }
    };

    const handleDeleteBank = async (id: string, name: string) => {
        if (confirm(`Remover ${name}?`)) {
            await deleteConnection.mutateAsync(id);
            toast({ title: "Conta removida" });
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportFileName(file.name);
        const content = await file.text();
        const ext = file.name.toLowerCase();

        let transactions: ParsedTransaction[] = [];
        if (ext.endsWith('.ofx') || ext.endsWith('.ofc')) {
            transactions = parseOFX(content);
        } else if (ext.endsWith('.csv') || ext.endsWith('.txt')) {
            transactions = parseCSV(content);
        } else {
            toast({ title: "Formato não suportado", description: "Use arquivos .OFX, .CSV ou .TXT", variant: "destructive" });
            return;
        }

        if (transactions.length === 0) {
            toast({ title: "Nenhuma transação encontrada", description: "Verifique se o arquivo está no formato correto", variant: "destructive" });
            return;
        }

        setParsedTransactions(transactions);
        setShowImport(true);
    };

    const handleImport = async () => {
        setImporting(true);
        try {
            await importTransactions.mutateAsync(parsedTransactions);
            toast({ title: `✅ ${parsedTransactions.length} transações importadas!` });
            setParsedTransactions([]);
            setShowImport(false);
            setImportFileName('');
        } catch { toast({ title: "Erro ao importar", variant: "destructive" }); }
        setImporting(false);
    };

    const totalBalance = connections.reduce((s, c) => s + (c.balance || 0), 0);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black flex items-center gap-3">
                        <SmartphoneNfc className="w-7 h-7 text-primary" />
                        Contas Bancárias
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Conecte seus bancos e importe extratos automaticamente</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                        <Upload className="w-4 h-4" /> Importar Extrato
                    </Button>
                    <Button onClick={() => setShowAddBank(true)} className="bg-gradient-to-r from-primary to-orange-500 text-white shadow-glow gap-2">
                        <Plus className="w-4 h-4" /> Adicionar Banco
                    </Button>
                </div>
                <input ref={fileInputRef} type="file" accept=".ofx,.ofc,.csv,.txt" className="hidden" onChange={handleFileSelect} />
            </div>

            {/* Balance Summary */}
            {connections.length > 0 && (
                <div className="glass rounded-2xl p-6 card-hover">
                    <div className="flex items-center gap-2 mb-1">
                        <Landmark className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground font-bold uppercase">Saldo Total</span>
                    </div>
                    <p className={cn("text-3xl font-black", totalBalance >= 0 ? "text-green-500" : "text-red-500")}>
                        R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{connections.length} conta{connections.length > 1 ? 's' : ''} conectada{connections.length > 1 ? 's' : ''}</p>
                </div>
            )}

            {/* Import Preview */}
            <AnimatePresence>
                {showImport && parsedTransactions.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass rounded-2xl p-6 space-y-4 overflow-hidden border-primary/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-primary" />
                                <div>
                                    <h3 className="font-bold">Pré-visualização da Importação</h3>
                                    <p className="text-xs text-muted-foreground">{importFileName} • {parsedTransactions.length} transações encontradas</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => { setShowImport(false); setParsedTransactions([]); }}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {parsedTransactions.slice(0, 20).map((t, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-secondary/20">
                                    <div className="flex items-center gap-3">
                                        <span className={cn("w-2 h-2 rounded-full", t.type === 'income' ? 'bg-green-500' : 'bg-red-500')} />
                                        <div>
                                            <p className="font-medium truncate max-w-[250px]">{t.description}</p>
                                            <span className="text-[10px] text-muted-foreground">{t.date} • {t.category}</span>
                                        </div>
                                    </div>
                                    <span className={cn("font-bold", t.type === 'income' ? 'text-green-500' : 'text-red-500')}>
                                        {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            ))}
                            {parsedTransactions.length > 20 && (
                                <p className="text-center text-xs text-muted-foreground py-2">... e mais {parsedTransactions.length - 20} transações</p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" className="flex-1" onClick={() => { setShowImport(false); setParsedTransactions([]); }}>Cancelar</Button>
                            <Button onClick={handleImport} disabled={importing} className="flex-1 bg-gradient-to-r from-primary to-orange-500 text-white">
                                {importing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importando...</> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Importar {parsedTransactions.length} transações</>}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Bank Modal */}
            <AnimatePresence>
                {showAddBank && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass rounded-2xl p-6 space-y-4 overflow-hidden">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold">Adicionar Conta Bancária</h3>
                            <Button variant="ghost" size="icon" onClick={() => setShowAddBank(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {SUPPORTED_BANKS.map(bank => (
                                <button key={bank.code} onClick={() => setSelectedBank(bank)} className={cn(
                                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center",
                                    selectedBank?.code === bank.code
                                        ? "border-primary bg-primary/5 shadow-glow"
                                        : "border-transparent bg-secondary/20 hover:bg-secondary/40"
                                )}>
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg", bank.color)}>
                                        {bank.logo}
                                    </div>
                                    <span className="text-[10px] font-bold leading-tight">{bank.name}</span>
                                </button>
                            ))}
                        </div>

                        {selectedBank && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-3 pt-2">
                                <select value={accountType} onChange={e => setAccountType(e.target.value)} className="rounded-xl bg-secondary/50 border border-border/50 px-3 py-2.5 text-sm">
                                    <option value="checking">Conta Corrente</option>
                                    <option value="savings">Poupança</option>
                                    <option value="investment">Investimento</option>
                                    <option value="credit">Cartão de Crédito</option>
                                </select>
                                <Input placeholder="4 últimos dígitos" maxLength={4} value={lastFour} onChange={e => setLastFour(e.target.value)} />
                                <Input placeholder="Saldo atual (R$)" type="number" step="0.01" value={balance} onChange={e => setBalance(e.target.value)} />
                            </motion.div>
                        )}

                        {selectedBank && (
                            <Button onClick={handleAddBank} disabled={addConnection.isPending} className="w-full bg-gradient-to-r from-primary to-orange-500 text-white">
                                {addConnection.isPending ? "Adicionando..." : `Adicionar ${selectedBank.name}`}
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Connections List */}
            <div className="space-y-3">
                {isLoading && <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}

                {!isLoading && connections.length === 0 && (
                    <div className="glass rounded-2xl p-12 text-center">
                        <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="font-bold text-lg mb-1">Nenhuma conta conectada</h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                            Adicione sua conta bancária manualmente ou importe um extrato OFX/CSV do seu banco.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                                <Upload className="w-4 h-4" /> Importar Extrato
                            </Button>
                            <Button onClick={() => setShowAddBank(true)} className="bg-gradient-to-r from-primary to-orange-500 text-white gap-2">
                                <Plus className="w-4 h-4" /> Adicionar Banco
                            </Button>
                        </div>
                    </div>
                )}

                {connections.map((bank, i) => (
                    <motion.div key={bank.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5 flex items-center justify-between group card-hover">
                        <div className="flex items-center gap-4">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg",
                                SUPPORTED_BANKS.find(b => b.code === bank.bank_code)?.color || 'bg-slate-500'
                            )}>
                                {bank.bank_logo || '🏦'}
                            </div>
                            <div>
                                <h3 className="font-bold">{bank.bank_name}</h3>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className={cn("w-2 h-2 rounded-full",
                                        bank.status === 'connected' ? 'bg-green-500' :
                                            bank.status === 'syncing' ? 'bg-yellow-500 animate-pulse' :
                                                bank.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                                    )} />
                                    <span className="capitalize">
                                        {bank.account_type === 'checking' ? 'Corrente' : bank.account_type === 'savings' ? 'Poupança' : bank.account_type === 'credit' ? 'Cartão' : bank.account_type}
                                    </span>
                                    {bank.last_four && <span>•••• {bank.last_four}</span>}
                                    {bank.last_synced_at && (
                                        <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> {new Date(bank.last_synced_at).toLocaleDateString('pt-BR')}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={cn("font-black text-lg", (bank.balance || 0) >= 0 ? 'text-green-500' : 'text-red-500')}>
                                R$ {(bank.balance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            <button onClick={() => handleDeleteBank(bank.id, bank.bank_name)} className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pluggy Connect Banner */}
            {isPluggyConfigured() && (
                <div className="glass rounded-2xl p-6 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold">Conexão Automática via Pluggy</h3>
                            <p className="text-sm text-muted-foreground">Sincronize transações automaticamente com o Open Finance</p>
                        </div>
                        <Button
                            onClick={handlePluggyConnect}
                            disabled={pluggyLoading}
                            className="bg-gradient-to-r from-primary to-orange-500 text-white"
                        >
                            {pluggyLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Conectando...</> : "Conectar Banco"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Security Notice */}
            <div className="bg-secondary/20 rounded-2xl p-5 flex gap-4 text-sm text-muted-foreground items-start border border-border/30">
                <ShieldCheck className="w-8 h-8 shrink-0 text-green-500" />
                <div>
                    <p className="font-bold text-foreground mb-1">Seus dados estão seguros</p>
                    <p>Os extratos importados são processados localmente no seu navegador. Apenas as transações são salvas no banco de dados, protegidas por criptografia e políticas de acesso por usuário (RLS).</p>
                </div>
            </div>
        </div>
    );
}
