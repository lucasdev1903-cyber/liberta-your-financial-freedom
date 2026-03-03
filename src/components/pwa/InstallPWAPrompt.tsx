import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePwaInstall } from '@/hooks/usePwaInstall';

export function InstallPWAPrompt() {
    const { isInstallable, install } = usePwaInstall();
    const [showPrompt, setShowPrompt] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (isInstallable && !dismissed) {
            setShowPrompt(true);
        } else {
            setShowPrompt(false);
        }
    }, [isInstallable, dismissed]);

    const handleInstallClick = async () => {
        await install();
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setDismissed(true);
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
