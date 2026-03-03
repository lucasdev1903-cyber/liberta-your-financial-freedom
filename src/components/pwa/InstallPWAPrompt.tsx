import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function InstallPWAPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<unknown>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Escutar o evento que o navegador dispara quando o app pode ser instalado
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Se já foi instalado, não mostrar
        window.addEventListener('appinstalled', () => {
            setShowPrompt(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Mostrar o prompt nativo
        (deferredPrompt as { prompt: () => void }).prompt();

        // Esperar a resposta do usuário
        const { outcome } = await (deferredPrompt as { userChoice: Promise<{ outcome: string }> }).userChoice;

        if (outcome === 'accepted') {
            setShowPrompt(false);
        }

        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
                >
                    <div className="glass-strong rounded-2xl p-4 shadow-glow flex flex-col gap-3 border border-primary/20 relative">
                        <button
                            onClick={handleDismiss}
                            className="absolute top-2 right-2 p-1 rounded-full text-muted-foreground hover:bg-secondary/50 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                                <Download className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Instalar Liberta</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Adicione o app à sua tela inicial para acesso rápido e melhor experiência.</p>
                            </div>
                        </div>

                        <Button
                            variant="hero"
                            className="w-full text-sm py-2 h-auto"
                            onClick={handleInstallClick}
                        >
                            Adicionar à Tela Inicial
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
