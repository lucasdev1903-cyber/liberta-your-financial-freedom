import { useState } from "react";
import { motion } from "framer-motion";
import logoWhite from "@/assets/liberta-logo-white.png";
import {
  BarChart3, Wallet, Target, TrendingUp, Bot, Settings, LogOut, Plus, Bell,
  DollarSign, ArrowUpRight, ArrowDownRight, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const navItems = [
  { icon: BarChart3, label: "Dashboard", active: true },
  { icon: Wallet, label: "Lançamentos" },
  { icon: Target, label: "Metas" },
  { icon: TrendingUp, label: "Investimentos" },
  { icon: Bot, label: "Assistente IA" },
  { icon: Settings, label: "Configurações" },
];

const recentTransactions = [
  { desc: "Supermercado Extra", cat: "Alimentação", value: -342.50, date: "Hoje" },
  { desc: "Salário", cat: "Receita", value: 8200.00, date: "01/03" },
  { desc: "Netflix", cat: "Assinaturas", value: -55.90, date: "28/02" },
  { desc: "Uber", cat: "Transporte", value: -23.40, date: "27/02" },
  { desc: "Freelance", cat: "Receita", value: 1500.00, date: "25/02" },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border p-5">
        <Link to="/">
          <img src={logoWhite} alt="Liberta" className="h-7 mb-10" />
        </Link>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeNav === item.label
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h1 className="text-xl font-bold">Olá, João! 👋</h1>
            <p className="text-sm text-muted-foreground">Aqui está o resumo das suas finanças</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <Button variant="hero" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Novo Lançamento
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Saldo Atual", value: "R$ 12.450,00", icon: DollarSign, change: "+5.2%", positive: true },
              { label: "Receitas (Mês)", value: "R$ 9.700,00", icon: ArrowUpRight, change: "+12%", positive: true },
              { label: "Despesas (Mês)", value: "R$ 3.250,00", icon: ArrowDownRight, change: "-8%", positive: false },
              { label: "Meta do Mês", value: "73%", icon: Target, change: "R$ 2.190 restantes", positive: true },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="glass rounded-xl p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <span className={`text-xs ${stat.positive ? "text-green-400" : "text-red-400"}`}>
                  {stat.change}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Chart area */}
            <motion.div
              className="lg:col-span-3 glass rounded-xl p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold">Fluxo de Caixa</h2>
                <div className="flex gap-2">
                  {["7D", "30D", "90D"].map((p) => (
                    <button
                      key={p}
                      className="px-3 py-1 text-xs rounded-md bg-secondary text-secondary-foreground hover:bg-primary/10 transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-2 h-48">
                {[35, 55, 45, 70, 50, 80, 60, 75, 65, 90, 55, 85].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-primary rounded-t-sm"
                    style={{ opacity: 0.5 + (h / 200) }}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px] text-muted-foreground">
                {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </motion.div>

            {/* Recent transactions */}
            <motion.div
              className="lg:col-span-2 glass rounded-xl p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold">Últimos Lançamentos</h2>
                <button className="text-xs text-primary hover:underline flex items-center gap-1">
                  Ver todos <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {recentTransactions.map((t, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                  >
                    <div>
                      <p className="text-sm font-medium">{t.desc}</p>
                      <p className="text-xs text-muted-foreground">{t.cat} · {t.date}</p>
                    </div>
                    <span className={`text-sm font-semibold ${t.value > 0 ? "text-green-400" : "text-red-400"}`}>
                      {t.value > 0 ? "+" : ""}
                      {t.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* AI Insights */}
          <motion.div
            className="glass rounded-xl p-6 border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="font-semibold">Insights da IA</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                "Seus gastos com alimentação aumentaram 15% em relação ao mês passado. Considere definir um limite mensal.",
                "Você pode economizar R$ 380/mês cancelando assinaturas pouco usadas. Quer ver quais?",
                "Com seu ritmo atual, você atingirá sua meta de reserva de emergência em 3 meses. Continue assim! 🎯",
              ].map((insight, i) => (
                <div key={i} className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed">
                  {insight}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
