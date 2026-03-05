import { useState, useEffect } from "react";
import { Settings, User, Bell, Shield, Palette, Camera, Loader2, LogOut, CheckCircle2, FolderHeart, Trash2, Lock, Fingerprint, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SettingsPage() {
    const { signOut, user } = useAuth();
    const { profile, isLoading, isUploading, updateProfile, uploadAvatar } = useProfile();
    const { categories, deleteCategory } = useCategories();
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const [fullName, setFullName] = useState("");
    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    // Password change
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName((profile as any).full_name || "");
            setCpf((profile as any).cpf || "");
            setPhone((profile as any).phone || "");
        }
    }, [profile]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await updateProfile.mutateAsync({ full_name: fullName, cpf: cpf.replace(/\D/g, ''), phone } as any);
            toast({ title: '✅ Perfil atualizado com sucesso!' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            toast({ title: 'As senhas não conferem', variant: 'destructive' });
            return;
        }
        if (newPassword.length < 6) {
            toast({ title: 'Senha muito curta (mínimo 6 caracteres)', variant: 'destructive' });
            return;
        }
        setIsChangingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            toast({ title: '🔒 Senha alterada com sucesso!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err: any) {
            toast({ title: 'Erro ao alterar senha', description: err.message, variant: 'destructive' });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await uploadAvatar(file);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                        <Settings className="w-7 h-7 text-primary" />
                    </div>
                    Configurações
                </h1>
                <p className="text-muted-foreground mt-2 ml-12">Gerencie sua conta, preferências e segurança</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-secondary/20 p-1 rounded-xl mb-8">
                    <TabsTrigger value="profile" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <User className="w-4 h-4" /> Perfil
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Palette className="w-4 h-4" /> Aparência
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <FolderHeart className="w-4 h-4" /> Categorias
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Bell className="w-4 h-4" /> Notificações
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <Card className="glass border-border/50 overflow-hidden">
                        <CardHeader className="border-b border-border/50 bg-secondary/5">
                            <CardTitle className="text-xl">Informações Pessoais</CardTitle>
                            <CardDescription>Atualize seus dados básicos e foto de perfil.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-8">
                            <div className="flex flex-col sm:flex-row items-center gap-8">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-3xl bg-primary/10 border-2 border-border/50 overflow-hidden flex items-center justify-center shadow-glow-sm relative">
                                        {(profile as any)?.avatar_url ? (
                                            <img src={(profile as any).avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-bold text-primary">
                                                {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                                            </span>
                                        )}
                                        <AnimatePresence>
                                            {isUploading && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10"
                                                >
                                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <label className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-primary text-primary-foreground shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all">
                                        <Camera className="w-4 h-4" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                                    </label>
                                </div>
                                <div className="space-y-1 text-center sm:text-left">
                                    <h3 className="font-bold text-lg">{fullName || 'Seu Nome'}</h3>
                                    <p className="text-sm text-muted-foreground">{(profile as any)?.role === 'admin' ? 'Administrador' : 'Membro Liberta'}</p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">Recomendado: JPG ou PNG, máx. 2MB</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Nome Completo</label>
                                    <Input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="bg-secondary/20 border-border/50 h-12 rounded-xl px-4 focus:ring-primary/20"
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">E-mail</label>
                                    <Input
                                        value={user?.email || ''}
                                        disabled
                                        className="bg-secondary/10 border-border/30 h-12 rounded-xl px-4 opacity-70"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 flex items-center gap-2"><Fingerprint className="w-3.5 h-3.5" /> CPF</label>
                                    <Input
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                        className="bg-secondary/20 border-border/50 h-12 rounded-xl px-4"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 flex items-center gap-2"><Smartphone className="w-3.5 h-3.5" /> Telefone</label>
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="bg-secondary/20 border-border/50 h-12 rounded-xl px-4"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-secondary/5 border-t border-border/50 py-4 flex justify-between items-center px-6">
                            <p className="text-xs text-muted-foreground">Última atualização: {new Date((profile as any)?.updated_at || "").toLocaleDateString('pt-BR')}</p>
                            <Button
                                onClick={handleSaveProfile}
                                disabled={isSaving || isUploading || !fullName}
                                className="rounded-xl shadow-glow active:scale-95 transition-all h-10 px-8"
                                variant="hero"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                Salvar Alterações
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="glass-warning border-red-500/20">
                        <CardHeader>
                            <CardTitle className="text-red-500 text-lg">Zona de Risco</CardTitle>
                            <CardDescription>Ações irreversíveis para sua conta.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                                <div>
                                    <p className="font-bold text-sm">Encerrar Sessão</p>
                                    <p className="text-xs text-muted-foreground">Você precisará fazer login novamente.</p>
                                </div>
                                <Button variant="destructive" size="sm" onClick={signOut} className="rounded-lg h-9">
                                    <LogOut className="w-4 h-4 mr-2" /> Sair
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PASSWORD CHANGE CARD - placed after profile tab content */}
                <TabsContent value="profile" className="space-y-6">
                    <Card className="glass border-border/50 overflow-hidden">
                        <CardHeader className="border-b border-border/50 bg-secondary/5">
                            <CardTitle className="text-xl flex items-center gap-2"><Lock className="w-5 h-5" /> Alterar Senha</CardTitle>
                            <CardDescription>Atualize sua senha de acesso ao sistema.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Nova Senha</label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="bg-secondary/20 border-border/50 h-12 rounded-xl px-4"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1">Confirmar Nova Senha</label>
                                <Input
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    className="bg-secondary/20 border-border/50 h-12 rounded-xl px-4"
                                    placeholder="Repita a nova senha"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-secondary/5 border-t border-border/50 py-4 flex justify-end px-6">
                            <Button
                                onClick={handleChangePassword}
                                disabled={isChangingPassword || !newPassword || !confirmNewPassword}
                                variant="hero"
                                className="rounded-xl h-10 px-8"
                            >
                                {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                                Alterar Senha
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance">
                    <Card className="glass border-border/50 overflow-hidden">
                        <CardHeader className="bg-secondary/5">
                            <CardTitle>Tema do Sistema</CardTitle>
                            <CardDescription>Customize como o Liberta aparece para você.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 grid sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setTheme("light")}
                                className={cn(
                                    "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group",
                                    theme === "light" ? "border-primary bg-primary/5" : "border-border/50 bg-secondary/20 hover:border-primary/30"
                                )}
                            >
                                <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Palette className="w-6 h-6 text-zinc-900" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold">Modo Claro</p>
                                    <p className="text-xs text-muted-foreground">Interface limpa e vibrante</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setTheme("dark")}
                                className={cn(
                                    "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group",
                                    theme === "dark" ? "border-primary bg-primary/5" : "border-border/50 bg-secondary/20 hover:border-primary/30"
                                )}
                            >
                                <div className="w-12 h-12 rounded-xl bg-zinc-900 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold">Modo Escuro</p>
                                    <p className="text-xs text-muted-foreground">Elegante e descansa a visão</p>
                                </div>
                            </button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="categories">
                    <Card className="glass border-border/50">
                        <CardHeader className="bg-secondary/5">
                            <CardTitle>Minhas Categorias</CardTitle>
                            <CardDescription>Gerencie as categorias de receitas e despesas que você criou.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {categories.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground bg-secondary/10 rounded-2xl border border-dashed border-border/50">
                                    <FolderHeart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>Você ainda não criou nenhuma categoria personalizada.</p>
                                    <p className="text-sm">Você pode criar novas ao fazer um lançamento!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/50 group hover:border-primary/20 transition-all card-hover">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: cat.color ? `${cat.color}20` : '#ffffff20' }}>
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#fff' }} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{cat.name}</span>
                                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                        {cat.type === 'income' ? 'Receita' : 'Despesa'}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={async () => {
                                                    if (confirm('Tem certeza? Isso so apagará a categoria, os lançamentos serão mantidos sem categoria.')) {
                                                        await deleteCategory.mutateAsync(cat.id);
                                                    }
                                                }}
                                                className="text-muted-foreground hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card className="glass border-border/50">
                        <CardHeader>
                            <CardTitle>Preferências de Notificação</CardTitle>
                            <CardDescription>Escolha como deseja ser avisado sobre suas finanças.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            {[
                                { label: 'Alerta de orçamento excedido', desc: 'Receba um aviso quando ultrapassar 80% do limite', defaultOn: true },
                                { label: 'Resumo mensal', desc: 'Receba um resumo no final de cada mês', defaultOn: true },
                                { label: 'Metas concluídas', desc: 'Celebre quando atingir uma meta', defaultOn: true },
                                { label: 'Recorrências próximas', desc: 'Aviso de contas a pagar nos próximos 3 dias', defaultOn: false },
                                { label: 'Dicas da Lia', desc: 'Insights personalizados da IA sobre seus gastos', defaultOn: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/50">
                                    <div>
                                        <p className="font-semibold text-sm">{item.label}</p>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked={item.defaultOn} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-secondary/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
