import { useState } from "react";
import logoWhite from "@/assets/liberta-logo-white.png";
import logoColor from "@/assets/logo_liberta_colorido.png";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";
import {
  Wallet, Target, TrendingUp, Bot, Settings, LogOut, Bell,
  Menu, X, Shield, SmartphoneNfc, PieChart, Repeat, Flame,
  LayoutDashboard, Building, CreditCard, BarChart2, CheckSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { StreakDisplay } from "@/components/dashboard/StreakDisplay";
import { NotificationDropdown } from "@/components/dashboard/NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { LiaFloatingButton } from "@/components/dashboard/LiaFloatingButton";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { cn } from "@/lib/utils";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Building, label: "Patrimônio", href: "/dashboard/net-worth" },
  { icon: Wallet, label: "Lançamentos", href: "/dashboard/transactions" },
  { icon: SmartphoneNfc, label: "Contas Bancárias", href: "/dashboard/connections" },
  { icon: Target, label: "Metas", href: "/dashboard/goals" },
  { icon: PieChart, label: "Orçamentos", href: "/dashboard/budgets" },
  { icon: Flame, label: "Dívidas", href: "/dashboard/dividas" },
  { icon: Repeat, label: "Recorrências", href: "/dashboard/recurring" },
  { icon: TrendingUp, label: "Investimentos", href: "/dashboard/investments" },
  { icon: BarChart2, label: "Relatórios", href: "/dashboard/reports" },
  { icon: Bot, label: "Assistente IA", href: "/dashboard/assistant", badge: '✨' },
  { icon: CreditCard, label: "Assinatura", href: "/dashboard/subscription" },
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

  const sidebarContent = (
    <div className="flex flex-col h-full w-full">
      <Link to="/" className="flex items-center justify-center mb-6 mt-2 px-2 shrink-0" onClick={() => setMobileOpen(false)}>
        <img src={logoWhite} alt="Liberta" className="h-14 hidden dark:block transition-all" />
        <img src={logoColor} alt="Liberta" className="h-14 block dark:hidden transition-all" />
      </Link>

      {/* Navegação Seca e Lisa */}
      <nav className="flex-1 space-y-0 mt-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "sidebar-link group flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                isActive
                  ? "active bg-primary/10 text-primary shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              {isActive && (
                <motion.div layoutId="active-nav-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full shadow-glow-sm" />
              )}
              <div className={cn("p-1.5 rounded-lg transition-colors duration-300", isActive ? "bg-primary text-white shadow-glow-sm" : "bg-transparent text-sidebar-foreground group-hover:bg-background/80")}>
                <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
              </div>
              <span className="transition-transform group-hover:translate-x-1">{item.label}</span>
              {(item as any).badge && (
                <span className="ml-auto text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">{(item as any).badge}</span>
              )}
            </Link>
          );
        })}

        {user?.user_metadata?.role === 'admin' && (
          <div className="pt-2 mt-2 border-t border-border/20">
            <Link
              to="/admin"
              className="group flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors relative overflow-hidden"
            >
              <div className="p-1.5 rounded-lg bg-transparent text-sidebar-foreground group-hover:bg-background/80 transition-colors duration-300">
                <Shield className="w-4 h-4 text-primary transition-transform group-hover:scale-110" />
              </div>
              <span className="transition-transform group-hover:translate-x-1">Painel Admin</span>
            </Link>
          </div>
        )}

        {isInstallable && (
          <div className="pt-2 mt-2 border-t border-border/20">
            <button
              onClick={() => {
                install();
                setMobileOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-bold text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 text-left transition-colors drop-shadow-glow shadow-glow-sm"
            >
              <div className="p-1.5 rounded-lg bg-orange-500 text-white shadow-glow-sm">
                <SmartphoneNfc className="w-4 h-4" />
              </div>
              Instalar App
            </button>
          </div>
        )}
      </nav>

      <div className="mt-auto mb-2 px-3 flex">
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-300 group shadow-sm bg-secondary/10 hover:shadow-md"
          title="Sair da Conta"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border p-5 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Glow effect for main content */}
        <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/50 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="hidden sm:block">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">{getGreeting()}, {getFirstName(user?.user_metadata?.full_name)}! 👋</h1>
                <StreakDisplay />
              </div>
              <p className="text-sm text-muted-foreground">Aqui está o resumo das suas finanças</p>
            </div>
            <div className="sm:hidden">
              <img src={logoWhite} alt="Liberta" className="h-6 hidden dark:block" />
              <img src={logoColor} alt="Liberta" className="h-6 block dark:hidden" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <NotificationDropdown />
            <Link to="/dashboard/settings" title="Configurações">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard/settings" title="Perfil">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary overflow-hidden hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-glow-sm">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getFirstName(user?.user_metadata?.full_name).charAt(0).toUpperCase()
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto pb-20 page-enter">
            <Outlet />
          </div>
        </div>
      </main>
      <LiaFloatingButton />
    </div>
  );
}
