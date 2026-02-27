import { Construction } from "lucide-react";

export function InvestmentsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-glow">
                <Construction className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Simulador de Investimentos</h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Estamos construindo uma ferramenta poderosa para você projetar seus rendimentos e comparar estratégias.
            </p>
            <div className="mt-8 px-4 py-2 border border-border/50 rounded-full text-sm bg-secondary/30">
                Disponível em breve!
            </div>
        </div>
    );
}
