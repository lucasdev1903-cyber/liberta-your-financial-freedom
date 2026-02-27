import { Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function SettingsPage() {
    const { user, signOut } = useAuth();

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="w-6 h-6 text-primary" />
                    Configurações
                </h1>
                <p className="text-sm text-muted-foreground">Gerencie sua conta e preferências</p>
            </div>

            <div className="glass rounded-xl p-6 border-border/50">
                <h2 className="text-lg font-semibold mb-4">Perfil</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-muted-foreground">Nome</label>
                        <p className="font-medium">{user?.user_metadata?.full_name || 'Sem nome'}</p>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground">Email</label>
                        <p className="font-medium">{user?.email}</p>
                    </div>

                    <div className="pt-4 border-t border-border/50 mt-6 text-right">
                        <Button variant="destructive" onClick={signOut}>Sair da conta</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
