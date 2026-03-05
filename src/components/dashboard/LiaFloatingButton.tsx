import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, MessageSquare, ChevronRight, Zap, Target, History } from "lucide-react";
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
    gasto: "📊 Analisando seus padrões... Suas maiores despesas concentram-se em Alimentação. Recomendo revisar os limites em Orçamentos.",
    despesa: "📊 Analisando seus padrões... Suas maiores despesas concentram-se em Alimentação. Recomendo revisar os limites em Orçamentos.",
    meta: "🎯 Suas metas estão em progresso. Notei que você pode atingir 'Viagem' 2 meses antes se economizar R$ 150 extras.",
    economizar: "💰 Estratégia Recomendada: A regra 50-30-20 é ideal para seu perfil atual. Vamos focar em 20% de aporte?",
    lancar: "✅ Para registrar manualmente, use o botão '+' no topo da página ou apenas me diga o valor e categoria!",
    patrimonio: "🏛️ Visão Consolidada: Seu patrimônio líquido cresceu 4% este mês. Veja os detalhes na aba Patrimônio.",
    investimento: "📈 O poder dos juros compostos é real. Use o simulador de Investimentos para projetar seu primeiro milhão!",
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
        if (lower.includes("oi") || lower.includes("olá")) return "Olá! ✨ Sou a Lia, sua inteligência financeira Diamond. Como posso otimizar seu dia hoje?";
        return "Entendi sua solicitação. Para análises mais profundas com dados em tempo real, acesse o painel **Assistente IA** completo.";
    };

    const handleSend = async (text?: string) => {
        const userMsg = text || input;
        if (!userMsg.trim()) return;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'assistant', text: getResponse(userMsg) }]);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-glow transition-all overflow-hidden border-2",
                    isOpen ? "bg-white/10 border-white/20 backdrop-blur-xl" : "bg-primary border-primary/20 hover:scale-110 active:scale-90"
                )}
                whileHover={{ y: -4 }}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-foreground" />
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center group">
                        <img src={liaAvatar} alt="Lia" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(10px)" }}
                        className="absolute bottom-20 right-0 w-[400px] max-h-[600px] flex flex-col glass-card rounded-[2.5rem] border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center gap-4 border-b border-white/5 bg-white/[0.02]">
                            <div className="relative">
                                <img src={liaAvatar} alt="Lia" className="w-12 h-12 rounded-2xl border-2 border-primary/20 bg-primary/10" />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background animate-pulse" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-black tracking-tight leading-none mb-1 text-foreground">Lia AI Agent</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Nível Diamond</span>
                                    <div className="h-1 w-1 rounded-full bg-white/20" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Sempre Online</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard/assistant')}
                                className="group/btn flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/10 hover:bg-primary/20 transition-all text-[9px] font-black uppercase tracking-widest"
                            >
                                <Sparkles className="w-3 h-3" /> FULL MODE
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[300px] max-h-[400px] scrollbar-hide">
                            {messages.length === 0 && (
                                <div className="text-center py-12 px-10 space-y-4">
                                    <div className="w-14 h-14 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto text-primary mb-2">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-black text-xs uppercase tracking-widest">Sua Coach Financeira</h4>
                                    <p className="text-xs text-muted-foreground/60 leading-relaxed font-medium">
                                        "Olá! Estou pronta para analisar seus dados e sugerir as melhores estratégias de investimento."
                                    </p>
                                </div>
                            )}

                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn("flex gap-3", m.role === 'user' ? 'justify-end' : 'justify-start')}
                                >
                                    {m.role === 'assistant' && <img src={liaAvatar} alt="L" className="w-8 h-8 rounded-xl shrink-0 border border-primary/10 bg-primary/5" />}
                                    <div className={cn(
                                        "px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed max-w-[85%] shadow-sm",
                                        m.role === 'user'
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "glass-card border-white/5 rounded-tl-none text-foreground/80"
                                    )}>
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-3 items-center">
                                    <img src={liaAvatar} alt="L" className="w-8 h-8 rounded-xl shrink-0" />
                                    <div className="flex gap-1.5 p-3 rounded-2xl glass-card border-white/5">
                                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Commands Chips */}
                        <div className="px-6 pb-4 flex flex-wrap gap-2">
                            {QUICK_COMMANDS.map((cmd) => (
                                <button
                                    key={cmd.label}
                                    onClick={() => handleSend(cmd.text)}
                                    className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all flex items-center gap-2"
                                >
                                    {cmd.label}
                                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-3">
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/30 font-medium"
                                placeholder="Pergunte qualquer coisa sobre suas finanças..."
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim()}
                                className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 transition-all shadow-glow-sm"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
