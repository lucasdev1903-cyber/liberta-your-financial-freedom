import { Shield, Users, DollarSign, Activity, FileText } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function AdminDashboard() {
    const { user } = useAuth();
    const { users, stats, isLoading, isAdmin } = useAdmin();

    // Se a rota for acessada diretamente por não-admin, redireciona
    if (!user || !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    const formatCurrency = (val: number) => {
        return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    if (isLoading) {
        return (
            <div className="flex-1 p-6 md:p-10 space-y-6">
                <div className="h-10 w-48 animate-pulse bg-secondary/30 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 animate-pulse bg-secondary/30 rounded-xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden relative">
            {/* Background glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            {/* Admin Sidebar Exclusiva */}
            <aside className="w-64 border-r border-border/50 bg-sidebar p-6 hidden md:flex flex-col">
                <div className="flex items-center gap-2 mb-10 text-primary">
                    <Shield className="w-6 h-6" />
                    <span className="font-bold text-lg tracking-tight">Admin<span className="text-foreground">Panel</span></span>
                </div>

                <nav className="space-y-1 flex-1">
                    <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 bg-sidebar-accent text-primary rounded-lg text-sm font-medium">
                        <Activity className="w-4 h-4" /> Visão Geral
                    </Link>
                    <button disabled className="flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground/50 rounded-lg text-sm font-medium w-full text-left">
                        <FileText className="w-4 h-4" /> Relatórios (Em breve)
                    </button>
                </nav>

                <div className="mt-auto border-t border-border/50 pt-6">
                    <Link to="/dashboard">
                        <Button variant="outline" className="w-full bg-secondary/20 hover:bg-secondary/50">
                            Voltar ao App Normal
                        </Button>
                    </Link>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">Painel de Controle</h1>
                        <p className="text-muted-foreground mt-1 text-lg">Gerencie a plataforma Liberta.</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 border-border/50 flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Total de Usuários</p>
                                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6 border-border/50 flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Movimentado na Plataforma</p>
                                <p className="text-3xl font-bold">{formatCurrency(stats.totalMoneyHandled)}</p>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-6 border-border/50 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Total de Receitas</p>
                                <p className="text-3xl font-bold">{formatCurrency(stats.totalIncome)}</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Lista de Usuários */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass rounded-xl border border-border/50 overflow-hidden">
                        <div className="p-6 border-b border-border/50 bg-secondary/10 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Usuários Cadastrados</h2>
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">Acesso Live</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Nome / Avatar</th>
                                        <th className="px-6 py-4 font-medium">E-mail (ID)</th>
                                        <th className="px-6 py-4 font-medium">Função</th>
                                        <th className="px-6 py-4 font-medium">Criado Em</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Nenhum usuário encontrado.</td>
                                        </tr>
                                    ) : (
                                        users.map((u) => (
                                            <tr key={u.id} className="hover:bg-secondary/10 transition-colors">
                                                <td className="px-6 py-4 flex items-center gap-3">
                                                    <img
                                                        src={u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${u.full_name || 'U'}`}
                                                        alt="avatar"
                                                        className="w-8 h-8 rounded-full border border-border/50"
                                                    />
                                                    <span className="font-medium">{u.full_name || 'Sem nome'}</span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{u.id}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                                    {format(new Date(u.created_at), "dd MMM yyyy", { locale: ptBR })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
