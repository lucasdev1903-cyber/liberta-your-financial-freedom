import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, CreditCard, Shield, Zap, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function SubscriptionPage() {
    const [isAnnual, setIsAnnual] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [subscription, setSubscription] = useState<any>(null);
    const [pageReady, setPageReady] = useState(false);

    const selectedPlan = isAnnual ? PLANS.annual : PLANS.monthly;

    useEffect(() => {
        const loadSub = async () => {
            if (!user) { setPageReady(true); return; }
            try {
                const { data } = await (supabase.from('subscriptions') as any)
                    .select('*')
                    .eq('user_id', user.id)
                    .single();
                setSubscription(data);
            } catch { /* no subscription yet */ }
            setPageReady(true);
        };
        loadSub();
    }, [user]);

    const handleSubscribe = async () => {
        if (!user) { toast({ title: "Faça login primeiro", variant: "destructive" }); return; }
        setCheckoutLoading(true);
        try {
            const email = user.email || user.user_metadata?.email || '';
            if (!email) throw new Error('Email não encontrado');

            const { data, error } = await supabase.functions.invoke('create-checkout', {
                body: {
                    priceId: selectedPlan.stripePriceId,
                    userId: user.id,
                    email,
                    successUrl: `${window.location.origin}/dashboard?checkout=success`,
                    cancelUrl: `${window.location.origin}/dashboard/subscription?checkout=canceled`,
                },
            });
            if (error) throw error;
            if (data?.error) throw new Error(data.error);
            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (error: any) {
            toast({ title: "Erro ao criar checkout", description: error.message, variant: "destructive" });
        } finally {
            setCheckoutLoading(false);
        }
    };

    const features = [
        "Metas financeiras ilimitadas",
        "Orçamentos por categoria com alertas",
        "Lia IA — Assistente 24/7",
        "Consolidação de Patrimônio",
        "Relatórios PDF e Excel",
        "Gamificação e Conquistas",
        "Sincronização multi-dispositivos",
        "Suporte prioritário",
    ];

    const isPremium = subscription?.status === 'active' || subscription?.status === 'trialing';

    if (isPremium) {
        return (
            <div className="max-w-xl mx-auto space-y-8 text-center py-8">
                <div className="glass-strong rounded-3xl p-12 border-green-500/30 shadow-glow">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-500/10 flex items-center justify-center">
                        <Crown className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-2">Você é <span className="text-gradient">Liberta+</span>! 🎉</h2>
                    <p className="text-muted-foreground mb-6">Seu plano premium está ativo.</p>
                    <div className="glass rounded-xl p-4 text-left space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-green-500 font-bold capitalize">{subscription?.status}</span></div>
                        {subscription?.current_period_end && (
                            <div className="flex justify-between"><span className="text-muted-foreground">Renova em</span><span className="font-bold">{new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}</span></div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-4">
            <header className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 border border-primary/20">
                    <Crown className="w-3.5 h-3.5" /> Premium
                </div>
                <h1 className="text-3xl font-black mb-2">Escolha seu plano <span className="text-gradient">Liberta+</span></h1>
                <p className="text-muted-foreground max-w-lg mx-auto">Acesso completo a todas as ferramentas premium por um valor justo e transparente.</p>
            </header>

            {/* Toggle */}
            <div className="flex justify-center items-center gap-4">
                <span className={cn("text-sm font-bold", !isAnnual ? "text-foreground" : "text-muted-foreground")}>Mensal</span>
                <button onClick={() => setIsAnnual(!isAnnual)} className="relative w-14 h-7 rounded-full bg-secondary border border-border/50 flex items-center px-1 transition-all">
                    <div className={cn("w-5 h-5 rounded-full bg-primary transition-all duration-300 shadow-glow", isAnnual && "translate-x-7")} />
                </button>
                <span className={cn("text-sm font-bold", isAnnual ? "text-foreground" : "text-muted-foreground")}>
                    Anual <span className="text-primary text-[10px] ml-1 font-black border border-primary/20 px-2 py-0.5 rounded-full bg-primary/5">-25%</span>
                </span>
            </div>

            {/* Plan Card */}
            <motion.div layout className="glass-strong rounded-3xl p-8 sm:p-12 border-primary/30 shadow-glow max-w-xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Sparkles className="w-32 h-32 text-primary" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-sm font-bold mb-1 text-primary uppercase tracking-widest">plano liberta+</h3>
                    <p className="text-muted-foreground text-sm mb-8">Tudo para dominar suas finanças.</p>

                    <div className="flex items-baseline justify-center gap-1 mb-2">
                        <motion.span key={isAnnual ? 'a' : 'm'} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black text-gradient">
                            {isAnnual ? "R$ 16,43" : "R$ 21,90"}
                        </motion.span>
                        <span className="text-muted-foreground text-sm font-bold">/mês</span>
                    </div>
                    {isAnnual && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs text-muted-foreground mb-6">
                            Cobrado <strong className="text-foreground">R$ 197,10/ano</strong> — economia de R$ 65,70
                        </motion.p>
                    )}
                    {!isAnnual && <div className="mb-6" />}

                    <ul className="space-y-3 mb-10">
                        {features.map((f) => (
                            <li key={f} className="flex items-center gap-3 text-sm font-medium">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {f}
                            </li>
                        ))}
                    </ul>

                    <Button onClick={handleSubscribe} disabled={checkoutLoading} className="w-full h-14 rounded-2xl text-lg font-black bg-gradient-to-r from-primary to-orange-500 text-white shadow-glow hover:scale-[1.02] transition-all">
                        {checkoutLoading ? (
                            <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Redirecionando...</span>
                        ) : (
                            <span className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Assinar Agora</span>
                        )}
                    </Button>

                    <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Pagamento seguro</span>
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Cancele quando quiser</span>
                    </div>
                    <p className="text-center mt-2 text-[10px] text-muted-foreground">7 dias grátis • Powered by Stripe</p>
                </div>
            </motion.div>
        </div>
    );
}
