import { useState, useEffect } from "react";
import { Settings, User, Bell, Shield, Palette, Camera, Loader2, LogOut, CheckCircle2, FolderHeart, Trash2, Lock, Fingerprint, Smartphone, ChevronRight, Sparkles, ShieldCheck, Mail, Phone, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useCategories } from "@/hooks/useCategories";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        setIsChangingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            toast({ title: '🔒 Senha alterada com sucesso!' });
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err: any) {
            toast({ title: 'Erro ao alterar senha', description: err.message, variant: 'destructive' });
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 animate-pulse">Sincronizando preferências globais...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 page-enter pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight leading-tight">Painel de Controle</h1>
                    <p className="text-sm text-muted-foreground font-medium opacity-80 mt-1.5">Configure sua experiência, segurança e preferências de sistema.</p>
                </div>

                <Button variant="ghost" onClick={() => signOut()} className="h-11 px-6 rounded-xl border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10">
                    <LogOut className="w-4 h-4 mr-2" /> Encerrar Sessão
                </Button>
            </header>

            <Tabs defaultValue="profile" className="space-y-10">
                <div className="flex justify-start">
                    <TabsList className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-1 rounded-2xl h-auto">
                        <TabsTrigger value="profile" className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <User className="w-3.5 h-3.5 mr-2" /> Perfil
                        </TabsTrigger>
                        <TabsTrigger value="security" className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Shield className="w-3.5 h-3.5 mr-2" /> Segurança
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <Palette className="w-3.5 h-3.5 mr-2" /> Aparência
                        </TabsTrigger>
                        <TabsTrigger value="data" className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <FolderHeart className="w-3.5 h-3.5 mr-2" /> Dados
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="profile" className="mt-0">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Avatar Card */}
                        <div className="lg:col-span-1">
                            <div className="glass-card rounded-[2.5rem] p-10 border-white/5 flex flex-col items-center text-center">
                                <div className="relative group mb-8">
                                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white/5 shadow-2xl relative transition-transform duration-500 group-hover:scale-105">
                                        <img
                                            src={(profile as any)?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <Loader2 className="w-6 h-6 animate-spin text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-primary text-primary-foreground shadow-glow-sm cursor-pointer hover:scale-110 active:scale-95 transition-all">
                                        <Camera className="w-5 h-5" />
                                        <input type="file" className="hidden" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) uploadAvatar(file);
                                        }} accept="image/*" />
                                    </label>
                                </div>
                                <h2 className="text-xl font-black tracking-tight">{(profile as any)?.full_name || 'Usuário Diamond'}</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">{user?.email}</p>

                                <div className="w-full mt-10 space-y-3">
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <Target className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Membro Desde</p>
                                            <p className="text-xs font-black">Janeiro 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info Form */}
                        <div className="lg:col-span-2">
                            <div className="glass-card rounded-[2.5rem] p-10 border-white/5 h-full flex flex-col justify-between">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-[0.2em] text-primary">
                                        <User className="w-4 h-4" />
                                        Identificação Pessoal
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">Nome Completo</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                                                <Input value={fullName} onChange={e => setFullName(e.target.value)} className="h-12 pl-11 bg-white/5 border-white/5 rounded-xl font-medium" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">E-mail Corporativo</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                                                <Input value={user?.email} disabled className="h-12 pl-11 bg-white/[0.02] border-white/5 rounded-xl font-medium opacity-50 italic" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">CPF (Opcional)</label>
                                            <div className="relative">
                                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                                                <Input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" className="h-12 pl-11 bg-white/5 border-white/5 rounded-xl font-medium" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">Telefone / Mobile</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                                                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+55 11 99999-9999" className="h-12 pl-11 bg-white/5 border-white/5 rounded-xl font-medium" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 flex justify-end">
                                    <Button onClick={handleSaveProfile} disabled={isSaving} className="h-12 px-10 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-glow-sm">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Alterações"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass-card rounded-[2.5rem] p-10 border-white/5">
                            <div className="flex items-center gap-2 mb-8 font-black text-xs uppercase tracking-[0.2em] text-primary">
                                <Lock className="w-4 h-4" />
                                Alterar Senha de Acesso
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">Nova Senha</label>
                                    <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">Confirmar Nova Senha</label>
                                    <Input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="h-12 bg-white/5 border-white/5 rounded-xl font-medium" />
                                </div>
                                <Button onClick={handleChangePassword} disabled={isChangingPassword} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-glow-sm mt-4">
                                    {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atualizar Senha"}
                                </Button>
                            </div>
                        </div>

                        <div className="glass-card rounded-[2.5rem] p-10 border-white/5 bg-gradient-to-br from-primary/[0.05] to-transparent relative overflow-hidden flex flex-col justify-between h-full">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight">Audit de Segurança</h3>
                                </div>
                                <p className="text-sm text-foreground/60 font-medium leading-relaxed mb-8">
                                    "Lia detectou que você utiliza autenticação padrão. Para um nível <b>Diamond</b> de proteção, recomendo ativar a biometria no aplicativo móvel."
                                </p>
                            </div>
                            <Button variant="ghost" className="w-full h-12 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest group/btn">
                                ATIVAR 2FA <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="appearance" className="mt-0">
                    <div className="glass-card rounded-[2.5rem] p-10 border-white/5">
                        <div className="flex items-center gap-2 mb-10 font-black text-xs uppercase tracking-[0.2em] text-primary">
                            <Palette className="w-4 h-4" />
                            Personalização de Interface
                        </div>
                        <div className="grid sm:grid-cols-3 gap-6">
                            {[
                                { id: 'dark', label: 'Dark Mode', desc: 'Foco e Modernidade', icon: '🌑' },
                                { id: 'light', label: 'Light Mode', desc: 'Clareza e Brilho', icon: '☀️' },
                                { id: 'system', label: 'Sincronizar', desc: 'Acompanhar SO', icon: '💻' }
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id as any)}
                                    className={cn(
                                        "p-8 rounded-[2rem] border transition-all text-left relative overflow-hidden group",
                                        theme === t.id ? "bg-primary/10 border-primary shadow-glow-sm" : "bg-white/[0.02] border-white/5 hover:bg-white/5"
                                    )}
                                >
                                    <span className="text-3xl mb-4 block">{t.icon}</span>
                                    <h4 className="font-black text-sm tracking-tight">{t.label}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1">{t.desc}</p>
                                    {theme === t.id && (
                                        <div className="absolute top-4 right-4 text-primary">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="data" className="mt-0">
                    <div className="glass-card rounded-[2.5rem] p-10 border-white/5 space-y-10">
                        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-[0.2em] text-red-500">
                            <Trash2 className="w-4 h-4" />
                            Zona de Perigo
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] bg-red-500/5 border border-red-500/10">
                            <div className="space-y-1">
                                <h4 className="font-black text-red-500">Exportar Dados Brutos</h4>
                                <p className="text-xs text-muted-foreground/60">Baixe todo o seu histórico financeiro em formato JSON/CSV para backup.</p>
                            </div>
                            <Button variant="ghost" className="h-11 px-6 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">Solicitar Dump</Button>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20">
                            <div className="space-y-1">
                                <h4 className="font-black text-red-500">Apagar Conta Permanente</h4>
                                <p className="text-xs text-muted-foreground/60">Atenção: Esta ação não pode ser desfeita e todos os seus dados serão anonimizados.</p>
                            </div>
                            <Button variant="destructive" className="h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest">Apagar Tudo</Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
