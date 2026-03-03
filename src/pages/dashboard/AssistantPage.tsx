import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Bot, Send, Sparkles, User, Trash2, Zap, TrendingUp, Target, PiggyBank } from "lucide-react";
import liaAvatar from "@/assets/lia-avatar.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

const SUGGESTED_PROMPTS = [
    { icon: TrendingUp, text: "Analise meus gastos deste mês" },
    { icon: Target, text: "Como atingir minhas metas mais rápido?" },
    { icon: PiggyBank, text: "Me ajude a economizar mais" },
    { icon: Zap, text: "Quero lançar uma despesa" },
];

const LIA_RESPONSES: Record<string, string> = {
    gasto: "📊 Analisei seus lançamentos! Suas maiores despesas costumam ser com **Alimentação** e **Transporte**. Uma dica: defina um orçamento mensal na aba **Orçamentos** para controlar esses gastos. Quer que eu te ajude a criar um?",
    despesa: "📊 Analisei seus lançamentos! Suas maiores despesas costumam ser com **Alimentação** e **Transporte**. Uma dica: defina um orçamento mensal na aba **Orçamentos** para controlar esses gastos. Quer que eu te ajude a criar um?",
    meta: "🎯 Para atingir suas metas mais rápido, recomendo: (1) Revisar gastos com lazer e assinaturas, (2) Definir um valor fixo mensal para guardar, (3) Acompanhar o progresso semanalmente na aba **Metas**. Pequenas economias diárias fazem grande diferença!",
    economizar: "💰 Aqui vão 3 dicas testadas para economizar:\n\n1. **Regra 50-30-20**: 50% necessidades, 30% desejos, 20% poupança\n2. **Desafio do Envelope**: Separe dinheiro por categoria no início do mês\n3. **Revisão semanal**: Toda sexta, revise seus gastos no Liberta e ajuste o que precisar\n\nQuer que eu analise onde você pode cortar custos?",
    lancar: "✅ Claro! Para lançar rapidamente, vá na aba **Lançamentos** e clique em **Novo Lançamento**. Ou me diga o valor e a categoria — por exemplo: 'R$ 45 em Alimentação' — e eu registro para você!",
    adicionar: "✅ Claro! Para lançar rapidamente, vá na aba **Lançamentos** e clique em **Novo Lançamento**. Ou me diga o valor e a categoria — por exemplo: 'R$ 45 em Alimentação' — e eu registro para você!",
    patrimonio: "🏛️ Seu patrimônio líquido é a base da sua liberdade financeira! Na aba **Patrimônio**, cadastre seus ativos (contas, investimentos, imóveis) e passivos (dívidas, financiamentos). Assim você tem uma visão completa da sua saúde financeira.",
    investimento: "📈 Para investir com inteligência, primeiro garanta sua **reserva de emergência** (3-6 meses de gastos). Depois, diversifique entre Renda Fixa (Tesouro, CDB) e Renda Variável (ações, FIIs). Use o simulador na aba **Investimentos** para projetar seus rendimentos!",
    relatorio: "📄 Você pode exportar seus dados em **PDF** ou **Excel** diretamente da aba **Lançamentos**. O PDF vem com a marca Liberta e um resumo executivo perfeito para controle mensal!",
    orcamento: "📊 Na aba **Orçamentos**, defina limites de gastos por categoria. As barras mudam de cor automaticamente:\n- 🟢 Verde = Tudo sob controle\n- 🟡 Amarelo = Atenção (70%+)\n- 🔴 Vermelho = Limite quase atingido (90%+)\n\nÉ a melhor ferramenta para disciplina financeira!",
};

export function AssistantPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const { addTransaction } = useTransactions();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'amigo';

    useEffect(() => {
        if (user) {
            supabase.from('ai_messages')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true })
                .then(({ data }) => {
                    if (data) setMessages(data as Message[]);
                });
        }
    }, [user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const saveMessage = async (role: 'user' | 'assistant', content: string) => {
        if (!user) return;
        const tempId = crypto.randomUUID();
        setMessages(prev => [...prev, { id: tempId, role, content }]);
        await (supabase.from('ai_messages') as any).insert([{ user_id: user.id, role, content }]);
    };

    const generateResponse = async (userMsg: string): Promise<string> => {
        const lower = userMsg.toLowerCase();

        // AI Transaction Intent Matching
        const txMatch = lower.match(/(gastei|comprei|paguei|recebi|ganhei|adicione|lance)\s+(?:r\$\s*)?(\d+(?:[.,]\d+)?)\s+(?:em|com|de|no|na)\s+(.+)/i);

        if (txMatch) {
            const action = txMatch[1];
            const amountStr = txMatch[2].replace(',', '.');
            const amount = parseFloat(amountStr);
            const description = txMatch[3].trim().replace(/[?!.]$/, '');
            const type = ['recebi', 'ganhei'].includes(action) ? 'income' : 'expense';

            try {
                await addTransaction.mutateAsync({
                    amount,
                    description: description.charAt(0).toUpperCase() + description.slice(1),
                    type,
                    date: new Date().toISOString().split('T')[0],
                } as any);
                return `✅ Feito! Acabei de registrar ${type === 'income' ? 'a receita' : 'o gasto'} de **R$ ${amount.toFixed(2).replace('.', ',')}** (${description}) no seu painel.`;
            } catch (e) {
                return "❌ Ops, tentei anotar isso mas algo deu errado no sistema. Pode tentar fazer isso na aba Lançamentos?";
            }
        }

        for (const [keyword, response] of Object.entries(LIA_RESPONSES)) {
            if (lower.includes(keyword)) return response;
        }
        if (lower.includes("oi") || lower.includes("olá") || lower.includes("ola")) {
            return `Olá, ${firstName}! 💙 Sou a Lia, sua assistente financeira. Estou aqui para te ajudar a organizar suas finanças. Você pode inclusive me pedir para lançar algo, por exemplo: "gastei 50 no mercado hoje". O que gostaria de fazer?`;
        }
        if (lower.includes("obrigad")) {
            return `De nada, ${firstName}! 😊 Estou sempre aqui para te ajudar. Lembre-se: consistência é a chave da liberdade financeira! 🔑`;
        }
        return `Entendi, ${firstName}! 🤔 Essa é uma ótima pergunta. Por enquanto, posso te ajudar com:\n\n• **Lançamentos por voz/texto** (ex: "gastei 45 na padaria")\n• **Análise de gastos** e despesas\n• **Metas** e dicas de economia\n\nMe diga mais sobre o que precisa!`;
    };

    const handleSend = async (text?: string) => {
        const userMsg = text || input;
        if (!userMsg.trim() || !user) return;
        setInput("");
        await saveMessage('user', userMsg);
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
        const response = await generateResponse(userMsg);
        setIsTyping(false);
        await saveMessage('assistant', response);
    };

    const clearHistory = async () => {
        if (!user) return;
        if (confirm("Deseja apagar todo o histórico de conversas com a Lia?")) {
            await supabase.from('ai_messages').delete().eq('user_id', user.id);
            setMessages([]);
            toast({ title: "Histórico limpo." });
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-glow border-2 border-primary/30">
                        <img src={liaAvatar} alt="Lia" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Lia — Assistente Financeira</h1>
                        <p className="text-xs text-green-500 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Disponível 24/7 para te ajudar
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={clearHistory} title="Limpar Histórico" className="text-muted-foreground hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 glass rounded-2xl border-border/50 flex flex-col overflow-hidden relative">
                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
                    {messages.length === 0 && !isTyping && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                className="w-20 h-20 rounded-3xl overflow-hidden shadow-glow border-2 border-primary/30 mb-6"
                            >
                                <img src={liaAvatar} alt="Lia" className="w-full h-full object-cover" />
                            </motion.div>
                            <h3 className="text-xl font-bold mb-2">Olá, {firstName}! 💙</h3>
                            <p className="text-sm text-muted-foreground max-w-md mb-8">
                                Sou a <strong>Lia</strong>, sua assistente financeira inteligente. Pergunte sobre seus gastos, metas, ou peça dicas para economizar.
                            </p>
                            <div className="grid grid-cols-2 gap-3 max-w-lg w-full">
                                {SUGGESTED_PROMPTS.map((p, i) => (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => handleSend(p.text)}
                                        className="flex items-center gap-3 p-4 rounded-xl glass hover:border-primary/40 transition-all text-left text-sm group"
                                    >
                                        <p.icon className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-medium">{p.text}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.id || i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn("flex gap-3 max-w-[85%]", msg.role === 'user' && "ml-auto flex-row-reverse")}
                        >
                            <div className={cn("w-8 h-8 shrink-0 rounded-full flex items-center justify-center", msg.role === 'user' ? 'bg-secondary' : 'bg-gradient-to-br from-primary to-orange-500')}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-white" />}
                            </div>
                            <div className={cn("p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap", msg.role === 'user' ? 'bg-secondary text-foreground rounded-tr-none' : 'bg-primary/10 border border-primary/20 text-foreground rounded-tl-none')}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}

                    <AnimatePresence>
                        {isTyping && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-orange-500">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 rounded-tl-none flex items-center gap-1.5">
                                    <span className="text-xs text-muted-foreground mr-2">Lia está digitando</span>
                                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-background/50 border-t border-border/50 backdrop-blur-md">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Pergunte algo para a Lia..."
                            className="bg-secondary/50 border-border/50 h-12 rounded-xl"
                            disabled={isTyping}
                        />
                        <Button type="submit" className="h-12 w-12 px-0 shrink-0 rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:shadow-glow transition-all" disabled={isTyping || !input.trim()}>
                            <Send className="w-5 h-5 text-white" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
