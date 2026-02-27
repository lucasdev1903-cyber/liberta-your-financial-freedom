import { ShieldCheck, Plus, Link as LinkIcon, RefreshCw, SmartphoneNfc } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BankConnectionsPage() {
    const connections = [
        { name: "Nubank", logo: "N", status: "Conectado", lastSync: "Há 10 min", color: "bg-purple-600" },
        { name: "Itaú", logo: "I", status: "Sincronizando...", lastSync: "Agora mesmo", color: "bg-orange-500" },
        { name: "XP Investimentos", logo: "X", status: "Erro de Sincronia", lastSync: "Ontem, 20:00", color: "bg-yellow-500", error: true },
    ];

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <SmartphoneNfc className="w-8 h-8 text-primary" />
                    Conexões Bancárias
                </h1>
                <p className="text-muted-foreground mt-2">
                    Gerencie suas integrações Open Finance. Nós puxamos suas transações automaticamente de forma 100% segura e somente-leitura.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Botão de Adicionar */}
                <div className="glass rounded-xl p-8 border-dashed border-2 hover:border-primary/50 transition-colors flex flex-col items-center justify-center text-center cursor-pointer min-h-[200px]">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                        <Plus className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Nova Instituição</h3>
                    <p className="text-sm text-muted-foreground pb-4 max-w-[250px]">
                        Conecte mais extratos, cartões de crédito e corretoras.
                    </p>
                    <Button variant="outline" className="mt-auto">Sincronizar Banco</Button>
                </div>

                {/* Lista Mocks */}
                {connections.map(bank => (
                    <div key={bank.name} className="glass rounded-xl p-6 border-border/50 flex flex-col min-h-[200px] relative overflow-hidden group">
                        <div className="flex items-start justify-between mb-auto relative z-10">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${bank.color} rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-xl`}>
                                    {bank.logo}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{bank.name}</h3>
                                    <div className="flex items-center gap-1.5 text-xs font-medium">
                                        <span className={`w-2 h-2 rounded-full ${bank.error ? 'bg-red-500' : bank.status.includes('Sincronizando') ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                                        <span className={bank.error ? 'text-red-500' : 'text-muted-foreground'}>{bank.status}</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="hover:text-red-500">
                                <LinkIcon className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-sm relative z-10">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <RefreshCw className={`w-3 h-3 ${bank.status.includes('Sincronizando') ? 'animate-spin' : ''}`} />
                                Última sync: {bank.lastSync}
                            </span>
                            <Button variant="ghost" size="sm" className="h-8">Atualizar</Button>
                        </div>

                        {/* Background glow based on bank color for ambient feel */}
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity pointer-events-none" style={{ backgroundColor: bank.color.replace('bg-', '') }} />
                    </div>
                ))}
            </div>

            <div className="bg-secondary/30 rounded-xl p-6 flex gap-4 text-sm text-muted-foreground items-start border border-border/50">
                <ShieldCheck className="w-10 h-10 shrink-0 text-green-500" />
                <p>
                    <strong className="text-foreground">Sua segurança é nossa prioridade.</strong> A integração Open Finance utiliza os mesmos protocolos de segurança do Banco Central do Brasil. O Liberta tem permissão <strong>apenas de visualização</strong> e não pode movimentar, investir ou transferir seu dinheiro sob nenhuma hipótese.
                </p>
            </div>
        </div>
    );
}
