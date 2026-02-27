import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Bot, Send, Sparkles, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export function AssistantPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch user history from supabase
        if (user) {
            supabase.from('ai_messages')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true })
                .then(({ data, error }) => {
                    if (!error && data) {
                        setMessages(data as Message[]);
                    }
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
        const msg = {
            user_id: user.id,
            role,
            content
        };

        // Optimistic UI update
        const tempId = crypto.randomUUID();
        setMessages(prev => [...prev, { id: tempId, ...msg }]);

        await supabase.from('ai_messages').insert([msg]);
    };

    const handleSend = async () => {
        if (!input.trim() || !user) return;
        const userMsg = input;
        setInput("");

        // 1. Save and show User Message
        await saveMessage('user', userMsg);

        // 2. Simulate AI Typing/Processing
        setIsTyping(true);

        // Simulate AI delay
        await new Promise(r => setTimeout(r, 1500));

        // Simple mock logic for MVP (Ideally call an Edge Function hitting OpenAI here)
        let aiResponse = "Desculpe, eu ainda estou aprendendo. Mas posso ajudar você a entender seus gastos ou planejar uma meta!";
        const lower = userMsg.toLowerCase();

        if (lower.includes("gasto") || lower.includes("despesa")) {
            aiResponse = "Pelo que analisei, suas maiores despesas costumam ser com Alimentação e Moradia. Quer que eu sugira áreas para cortar gatos?";
        } else if (lower.includes("lançar") || lower.includes("adicionar")) {
            aiResponse = "Claro! Posso lançar isso no seu dashboard. Qual o valor exato e a categoria?";
        } else if (lower.includes("olá") || lower.includes("oi")) {
            aiResponse = `Olá, ${user.user_metadata?.full_name?.split(' ')[0] || 'amigo'}! Como posso ajudar você a acelerar sua jornada de liberdade financeira hoje?`;
        }

        // 3. Save and show AI Response
        setIsTyping(false);
        await saveMessage('assistant', aiResponse);
    };

    const clearHistory = async () => {
        if (!user) return;
        if (confirm("Deseja apagar todo o histórico de conversas com a IA?")) {
            await supabase.from('ai_messages').delete().eq('user_id', user.id);
            setMessages([]);
            toast({ title: "Histórico limpo." })
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Bot className="w-6 h-6 text-primary" />
                        Assistente Financeiro IA
                    </h1>
                    <p className="text-sm text-muted-foreground">Sua inteligência artificial 24/7 para dicas e automações</p>
                </div>
                <Button variant="ghost" size="icon" onClick={clearHistory} title="Limpar Histórico" className="text-muted-foreground hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 glass rounded-xl border-border/50 flex flex-col overflow-hidden relative">
                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
                    {messages.length === 0 && !isTyping && (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 shadow-glow">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Comece uma conversa</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Tente dizer: "Oi, pode revisar meus gastos deste mês?" ou "Quero adicionar uma despesa de R$ 50 de Ifood."
                            </p>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-secondary' : 'bg-primary/20 text-primary'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-secondary text-foreground rounded-tr-none'
                                    : 'bg-primary/10 border border-primary/20 text-foreground rounded-tl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3 max-w-[85%]">
                            <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-primary/20 text-primary">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 rounded-tl-none flex items-center gap-1">
                                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-background/50 border-t border-border/50 backdrop-blur-md">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-2"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Digite sua mensagem para a IA..."
                            className="bg-secondary/50 border-border/50 h-12"
                            disabled={isTyping}
                        />
                        <Button type="submit" variant="hero" className="h-12 w-12 px-0 shrink-0 shadow-glow" disabled={isTyping || !input.trim()}>
                            <Send className="w-5 h-5 ml-1" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
