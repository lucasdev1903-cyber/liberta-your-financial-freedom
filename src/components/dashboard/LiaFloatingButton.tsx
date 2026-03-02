import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const LIA_TIPS = [
    "💡 Dica: Defina orçamentos para controlar seus gastos!",
    "📊 Você sabia? Exportar relatórios em PDF ajuda no controle mensal.",
    "🎯 Crie metas financeiras para alcançar seus sonhos!",
    "🔥 Mantenha sua ofensiva diária para ganhar medalhas!",
    "💰 Consolidar seu patrimônio é o primeiro passo para a liberdade.",
];

export function LiaFloatingButton() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const randomTip = LIA_TIPS[Math.floor(Math.random() * LIA_TIPS.length)];

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-glow transition-all",
                    isOpen
                        ? "bg-secondary text-foreground"
                        : "bg-gradient-to-br from-primary to-orange-500 text-white hover:scale-110"
                )}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {isOpen ? <X className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
            </motion.button>

            {/* Popup */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-80 glass-strong rounded-2xl shadow-2xl border-primary/20 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-orange-500 p-4 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Lia — Assistente IA</h3>
                                    <p className="text-[10px] opacity-80 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        Disponível agora
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-3">
                            <div className="bg-secondary/30 rounded-xl rounded-tl-none p-3 text-sm leading-relaxed">
                                Olá! Eu sou a <strong>Lia</strong> 💙 Sua assistente financeira inteligente. Como posso te ajudar hoje?
                            </div>
                            <div className="bg-primary/10 rounded-xl p-3 text-xs text-muted-foreground border border-primary/10">
                                {randomTip}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 pt-0 space-y-2">
                            <button
                                onClick={() => { navigate("/dashboard/assistant"); setIsOpen(false); }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white font-bold text-sm hover:shadow-glow transition-all"
                            >
                                <Send className="w-4 h-4" />
                                Conversar com a Lia
                            </button>
                            <p className="text-[10px] text-center text-muted-foreground">
                                Pergunte sobre seus gastos, metas ou peça dicas financeiras.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
