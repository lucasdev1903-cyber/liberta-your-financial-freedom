import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import liaAvatar from "@/assets/lia-avatar.png";

type Msg = { role: 'user' | 'assistant'; text: string };

const RESPONSES: Record<string, string> = {
    gasto: "📊 Suas maiores despesas costumam ser com Alimentação e Transporte. Defina um orçamento na aba Orçamentos!",
    despesa: "📊 Suas maiores despesas costumam ser com Alimentação e Transporte. Defina um orçamento na aba Orçamentos!",
    meta: "🎯 Revise gastos com lazer, defina um valor fixo mensal e acompanhe o progresso na aba Metas!",
    economizar: "💰 Regra 50-30-20: 50% necessidades, 30% desejos, 20% poupança. Revise seus gastos semanalmente!",
    lancar: "✅ Vá em Lançamentos > Novo Lançamento. Ou me diga: 'R$ 45 em Alimentação'!",
    patrimonio: "🏛️ Na aba Patrimônio, cadastre seus ativos e passivos para ter uma visão completa!",
    investimento: "📈 Garanta sua reserva de emergência primeiro. Use o simulador na aba Investimentos!",
    orcamento: "📊 Na aba Orçamentos, defina limites por categoria. As barras mudam de cor automaticamente!",
    relatorio: "📄 Exporte seus dados em PDF ou Excel na aba Lançamentos!",
};

export function LiaFloatingButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    const getResponse = (text: string): string => {
        const lower = text.toLowerCase();
        for (const [kw, resp] of Object.entries(RESPONSES)) {
            if (lower.includes(kw)) return resp;
        }
        if (lower.includes("oi") || lower.includes("olá")) return "Olá! 💙 Sou a Lia. Como posso ajudar suas finanças hoje?";
        if (lower.includes("obrigad")) return "De nada! 😊 Estou sempre aqui pra te ajudar!";
        return "Entendi! 🤔 Posso ajudar com gastos, metas, orçamentos, investimentos e relatórios. Me conte mais!";
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'assistant', text: getResponse(userMsg) }]);
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
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {isOpen ? <X className="w-5 h-5" /> : <img src={liaAvatar} alt="Lia" className="w-full h-full object-cover" />}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[340px] glass-strong rounded-2xl shadow-2xl border-primary/20 overflow-hidden flex flex-col"
                        style={{ maxHeight: '70vh' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-orange-500 p-4 text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                                    <img src={liaAvatar} alt="Lia" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Lia — Assistente IA</h3>
                                    <p className="text-[10px] opacity-80 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[350px] custom-scrollbar">
                            {messages.length === 0 && !isTyping && (
                                <div className="bg-secondary/30 rounded-xl rounded-tl-none p-3 text-sm leading-relaxed">
                                    Olá! Eu sou a <strong>Lia</strong> 💙 Pergunte sobre seus gastos, metas, orçamentos ou peça dicas financeiras!
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={cn("max-w-[90%]", msg.role === 'user' && "ml-auto")}>
                                    <div className={cn(
                                        "p-3 rounded-xl text-sm leading-relaxed",
                                        msg.role === 'user'
                                            ? "bg-primary/20 border border-primary/20 rounded-tr-none"
                                            : "bg-secondary/30 rounded-tl-none"
                                    )}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="bg-secondary/30 rounded-xl rounded-tl-none p-3 flex items-center gap-1.5">
                                    <span className="text-xs text-muted-foreground mr-1">Lia</span>
                                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-border/50 shrink-0">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Pergunte algo..."
                                    className="flex-1 h-10 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm outline-none focus:ring-1 focus:ring-primary"
                                    disabled={isTyping}
                                />
                                <button type="submit" disabled={isTyping || !input.trim()} className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white flex items-center justify-center hover:shadow-glow transition-all disabled:opacity-50">
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
