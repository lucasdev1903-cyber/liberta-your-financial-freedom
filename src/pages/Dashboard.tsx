import { useState } from "react";
import logoWhite from "@/assets/liberta-logo-white.png";
import logoColor from "@/assets/logo_liberta_colorido.png";
import { ModeToggle } from "@/components/mode-toggle";
import {
  BarChart3, Wallet, Target, TrendingUp, Bot, Settings, LogOut, Bell,
  Menu, X, Shield, SmartphoneNfc, Landmark, PieChart, CreditCard, Repeat, FileBarChart, Flame, ChevronRight, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { StreakDisplay } from "@/components/dashboard/StreakDisplay";
import { NotificationDropdown } from "@/components/dashboard/NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { LiaFloatingButton } from "@/components/dashboard/LiaFloatingButton";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Landmark, label: "Patrimônio", href: "/dashboard/net-worth" },
  { icon: Wallet, label: "Lançamentos", href: "/dashboard/transactions" },
  { icon: SmartphoneNfc, label: "Conexões", href: "/dashboard/connections" },
  { icon: Flame, label: "Quitação de Dívidas", href: "/dashboard/dividas", badge: '🚨' },
  { icon: Target, label: "Metas", href: "/dashboard/goals" },
  { icon: PieChart, label: "Orçamentos", href: "/dashboard/budgets" },
  { icon: Repeat, label: "Recorrências", href: "/dashboard/recurring" },
  { icon: TrendingUp, label: "Investimentos", href: "/dashboard/investments" },
  { icon: FileBarChart, label: "Relatórios", href: "/dashboard/reports" },
  { icon: Bot, label: "Assistente IA", href: "/dashboard/assistant", badge: '✨' },
];

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isInstallable, install } = usePwaInstall();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const getFirstName = (fullName?: string) => {
    return fullName?.split(" ")[0] || "Usuário";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      <Link to="/" className="flex items-center gap-2 mb-10 px-4">
        <img src={logoWhite} alt="Liberta" className="h-9 hidden dark:block" />
        <img src={logoColor} alt="Liberta" className="h-9 block dark:hidden" />
      </Link>

      <nav className="flex-1 px-2 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center gap-3 px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-300 relative overflow-hidden",
                isActive
                  ? "bg-primary text-primary-foreground shadow-glow-sm"
                  : "text-muted-foreground/70 hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-primary/60")} />
              <span className="tracking-tight">{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
              {isActive && (
                <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-white rounded-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pt-6 border-t border-white/5 space-y-4">
        {isInstallable && (
          <button
            onClick={install}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 transition-all border border-orange-500/20"
          >
            <SmartphoneNfc className="w-4 h-4" />
            Instalar App
          </button>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground/40 hover:text-red-500 transition-colors w-full group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Sair do Sistema
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Refined Ambient Background Orbs */}
      <div className="orb w-[500px] h-[500px] -top-48 -left-48 bg-primary/10" />
      <div className="orb w-[400px] h-[400px] top-1/2 -right-24 bg-blue-500/5" />
      <div className="orb w-[300px] h-[300px] bottom-0 left-1/4 bg-purple-500/5 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Sidebar - Floating Glass Effect */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 p-4 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:relative lg:translate-x-0 outline-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <aside className="h-full glass-card rounded-[2.5rem] border-white/10 shadow-2xl flex flex-col">
          <SidebarContent />
        </aside>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header - Ultra Clean */}
        <header className="flex items-center justify-between px-6 sm:px-10 py-5 bg-background/40 premium-blur z-20 sticky top-0">
          <div className="flex items-center gap-5 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0 rounded-xl bg-white/5 border border-white/10"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tight leading-none mb-1">
                Dashboard
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                Sistema Operacional • Liberta OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden lg:flex items-center gap-4">
              <StreakDisplay />
              <div className="w-px h-6 bg-white/5" />
            </div>

            <div className="flex items-center gap-2 sm:gap-4 p-1 rounded-2xl bg-white/[0.03] border border-white/5">
              <ModeToggle />
              <NotificationDropdown />
              <Link to="/dashboard/settings" title="Configurações">
                <Button variant="ghost" size="icon" className="text-muted-foreground/60 hover:text-primary transition-all rounded-xl">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <Link to="/dashboard/settings" className="flex items-center gap-3 pl-2 sm:pl-4 group">
              <div className="hidden md:text-right md:block">
                <p className="text-sm font-black tracking-tight group-hover:text-primary transition-colors">{getFirstName(user?.user_metadata?.full_name)}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Membro Premium</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/60 p-[2px] shadow-glow-sm transition-transform group-hover:scale-105 active:scale-95 duration-300">
                <div className="w-full h-full rounded-[0.9rem] bg-background flex items-center justify-center text-sm font-black text-primary overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Content View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative px-6 sm:px-10 pt-8 pb-32">
          <div className="max-w-[1400px] mx-auto page-enter">
            <Outlet />
          </div>
        </div>
      </main>

      <LiaFloatingButton />

      {/* Mobile Sidebar Close Trigger */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
