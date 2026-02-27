import { Bot } from "lucide-react";

export function AssistantPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 shadow-glow">
                <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Seu Assistente Inteligente</h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Converse via chat para adicionar lançamentos, pedir dicas de economia ou analisar seu mês com IA.
            </p>
            <div className="mt-8 px-4 py-2 border border-border/50 rounded-full text-sm bg-secondary/30">
                Treinando a Inteligência Artificial... Em breve!
            </div>
        </div>
    );
}
