import { useState } from "react";
import logoWhite from "@/assets/liberta-logo-white.png";
import logoColor from "@/assets/logo_liberta_colorido.png";
import { ModeToggle } from "@/components/mode-toggle";
import {
  BarChart3, Wallet, Target, TrendingUp, Bot, Settings, LogOut, Bell,
  Menu, X, Shield, SmartphoneNfc, Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { StreakDisplay } from "@/components/dashboard/StreakDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Landmark, label: "Patrimônio", href: "/dashboard/net-worth" },
  { icon: Wallet, label: "Lançamentos", href: "/dashboard/transactions" },
  { icon: SmartphoneNfc, label: "Contas Bancárias", href: "/dashboard/connections" },
  { icon: Target, label: "Metas", href: "/dashboard/goals" },
  { icon: TrendingUp, label: "Investimentos", href: "/dashboard/investments" },
  { icon: Bot, label: "Assistente IA", href: "/dashboard/assistant" },
  { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
];

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const getFirstName = (fullName?: string) => {
    return fullName?.split(" ")[0] || "Usuário";
  };

  const SidebarContent = () => (
    <>
      <Link to="/" className="flex items-center gap-2 mb-10 px-2" onClick={() => setMobileOpen(false)}>
        <img src={logoWhite} alt="Liberta" className="h-7 hidden dark:block" />
        <img src={logoColor} alt="Liberta" className="h-7 block dark:hidden" />
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}

        {user?.user_metadata?.role === 'admin' && (
          <div className="pt-4 mt-4 border-t border-sidebar-border">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <Shield className="w-4 h-4 text-primary" />
              Painel Admin
            </Link>
          </div>
        )}
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-3 py-2.5 mt-auto text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        <LogOut className="w-4 h-4" />
        Sair
      </button>
    </>
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
        <SidebarContent />
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
                <h1 className="text-xl font-bold">Olá, {getFirstName(user?.user_metadata?.full_name)}! 👋</h1>
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
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getFirstName(user?.user_metadata?.full_name).charAt(0).toUpperCase()
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-20">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
