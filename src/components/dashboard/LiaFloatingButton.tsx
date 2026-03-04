import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import liaAvatar from "@/assets/lia-avatar.png";

type Msg = { role: 'user' | 'assistant'; text: string };

const QUICK_COMMANDS = [
    { label: '💰 Meu saldo', text: 'Quanto eu tenho?' },
    { label: '📊 Resumo', text: 'Resumo' },
    { label: '🎯 Metas', text: 'Como estão minhas metas?' },
    { label: '📝 Lançar gasto', text: 'Gastei R$ ' },
];

const RESPONSES: Record<string, string> = {
    gasto: "📊 Suas maiores despesas costumam ser com Alimentação e Transporte. Defina um orçamento na aba Orçamentos!",
    despesa: "📊 Suas maiores despesas costumam ser com Alimentação e Transporte. Defina um orçamento na aba Orçamentos!",
    meta: "🎯 Revise gastos com lazer, defina um valor fixo mensal e acompanhe o progresso na aba Metas!",
    economizar: "💰 Regra 50-30-20: 50% necessidades, 30% desejos, 20% poupança. Revise seus gastos semanalmente!",
    lancar: "✅ Vá em Lançamentos > Novo Lançamento. Ou me diga: 'R$ 45 em Alimentação'!",
    patrimonio: "🏛️ Na aba Patrimônio, cadastre seus ativos e passivos para ter uma visão completa!",
    investimento: "📈 Garanta sua reserva de emergência primeiro. Use o simulador na aba Investimentos!",
    orcamento: "📊 Na aba Orçamentos, defina limites por categoria. As barras mudam de cor automaticamente!",
    relatorio: "📄 Agora temos uma página dedicada de Relatórios! Acesse no menu lateral.",
    resumo: "📋 Para um resumo completo, acesse a aba Assistente IA. Lá eu tenho acesso aos seus dados reais!",
    saldo: "💰 Para ver seu saldo real, acesse a aba Assistente IA. Lá eu consigo consultar seus dados!",
    quanto: "💰 Para ver seu saldo real, acesse a aba Assistente IA. Lá eu consigo consultar seus dados!",
};

export function LiaFloatingButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus();
    }, [isOpen]);

    const getResponse = (text: string): string => {
        const lower = text.toLowerCase();
        for (const [kw, resp] of Object.entries(RESPONSES)) {
            if (lower.includes(kw)) return resp;
        }
        if (lower.includes("oi") || lower.includes("olá")) return "Olá! 💙 Sou a Lia. Como posso ajudar suas finanças hoje?";
        if (lower.includes("obrigad")) return "De nada! 😊 Estou sempre aqui pra te ajudar!";
        return "Entendi! 🤔 Para respostas com dados reais, acesse a aba **Assistente IA** no menu. Lá eu tenho acesso completo ao seu painel!";
    };

    const handleSend = async (text?: string) => {
        const userMsg = text || input;
        if (!userMsg.trim()) return;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'assistant', text: getResponse(userMsg) }]);
    };

    const handleQuickCommand = (cmd: typeof QUICK_COMMANDS[0]) => {
        if (cmd.text.endsWith(' ')) {
            // It's a partial command, put it in the input field
            setInput(cmd.text);
            if (inputRef.current) inputRef.current.focus();
        } else {
            handleSend(cmd.text);
        }
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-glow transition-all overflow-hidden",
                    isOpen ? "bg-secondary text-foreground" : "border-2 border-primary/30 hover:scale-110"
                )}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? <X className="w-5 h-5" /> : <img src={liaAvatar} alt="Lia" className="w-full h-full object-cover" />}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[480px] flex flex-col glass-strong rounded-2xl border-border/50 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary/20 to-orange-500/20 p-4 flex items-center gap-3 border-b border-border/50">
                            <img src={liaAvatar} alt="Lia" className="w-9 h-9 rounded-full border-2 border-primary/30" />
                            <div>
                                <h3 className="font-bold text-sm">Lia — Assistente IA</h3>
                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard/assistant')}
                                className="ml-auto text-[10px] text-primary hover:underline font-bold flex items-center gap-1"
                            >
                                <Sparkles className="w-3 h-3" /> Abrir completo
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[180px] max-h-[280px]">
                            {messages.length === 0 && (
                                <div className="text-center py-6">
                                    <img src={liaAvatar} alt="Lia" className="w-12 h-12 rounded-full mx-auto mb-2 opacity-60" />
                                    <p className="text-xs text-muted-foreground">Olá! Como posso ajudar? 💙</p>
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <div key={i} className={cn("flex gap-2", m.role === 'user' ? 'justify-end' : 'justify-start')}>
                                    {m.role === 'assistant' && <img src={liaAvatar} alt="Lia" className="w-6 h-6 rounded-full mt-1 shrink-0" />}
                                    <div className={cn(
                                        "px-3 py-2 rounded-xl text-xs max-w-[230px] leading-relaxed",
                                        m.role === 'user'
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-secondary/50 rounded-bl-none"
                                    )}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-2 items-center">
                                    <img src={liaAvatar} alt="Lia" className="w-6 h-6 rounded-full" />
                                    <div className="flex gap-1 bg-secondary/50 px-3 py-2 rounded-xl">
                                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
                                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
                                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Commands */}
                        {messages.length === 0 && (
                            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                                {QUICK_COMMANDS.map((cmd) => (
                                    <button
                                        key={cmd.label}
                                        onClick={() => handleQuickCommand(cmd)}
                                        className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 active:scale-95 transition-all"
                                    >
                                        {cmd.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-3 border-t border-border/50 flex gap-2">
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                className="flex-1 bg-secondary/30 border border-border/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground"
                                placeholder="Digite uma mensagem..."
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim()}
                                className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 transition-all active:scale-90"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
