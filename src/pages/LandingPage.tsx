import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/liberta-logo-white.png";
import { ArrowRight, Shield, TrendingUp, Bot, Smartphone, BarChart3, Target } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const features = [
  {
    icon: BarChart3,
    title: "Dashboard de BI",
    desc: "Gráficos interativos e relatórios avançados do seu fluxo financeiro.",
  },
  {
    icon: Bot,
    title: "Assistente com IA",
    desc: "Insights inteligentes e lançamentos por texto ou voz.",
  },
  {
    icon: Target,
    title: "Metas Financeiras",
    desc: "Defina, acompanhe e conquiste seus objetivos de economia.",
  },
  {
    icon: TrendingUp,
    title: "Simulador de Investimentos",
    desc: "Projete rendimentos e compare estratégias em tempo real.",
  },
  {
    icon: Smartphone,
    title: "Lançamentos via WhatsApp",
    desc: "Registre despesas enviando uma simples mensagem.",
  },
  {
    icon: Shield,
    title: "Conexão Bancária Segura",
    desc: "Sincronize transações automaticamente com Open Finance.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-hero overflow-hidden">
      {/* Glow effect */}
      <div className="fixed inset-0 bg-glow pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <img src={logoWhite} alt="Liberta" className="h-8" />
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="hero" size="sm">Teste Grátis</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            4 dias grátis — sem cartão de crédito
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          Sua liberdade financeira{" "}
          <span className="text-gradient">começa aqui.</span>
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          Controle gastos, invista melhor e receba insights inteligentes — tudo em um só lugar, com a ajuda da IA.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
        >
          <Link to="/dashboard">
            <Button variant="hero" size="lg" className="text-base px-8 py-6">
              Começar Teste Grátis <ArrowRight className="ml-1" />
            </Button>
          </Link>
          <Button variant="heroOutline" size="lg" className="text-base px-8 py-6">
            Ver Demonstração
          </Button>
        </motion.div>

        {/* Dashboard preview mockup */}
        <motion.div
          className="mt-20 relative mx-auto max-w-5xl"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
        >
          <div className="glass rounded-2xl p-1 shadow-glow">
            <div className="bg-gradient-card rounded-xl p-6 sm:p-10">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Saldo", value: "R$ 12.450,00", color: "text-green-400" },
                  { label: "Receitas", value: "R$ 8.200,00", color: "text-primary" },
                  { label: "Despesas", value: "R$ 3.750,00", color: "text-red-400" },
                ].map((item) => (
                  <div key={item.label} className="glass rounded-lg p-4 text-left">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className={`text-lg sm:text-2xl font-bold ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              {/* Chart placeholder bars */}
              <div className="flex items-end gap-2 h-32 px-4">
                {[40, 65, 50, 80, 55, 90, 70, 85, 60, 75, 95, 68].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-primary rounded-t-sm opacity-70"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Glow behind card */}
          <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl -z-10 animate-pulse-glow" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Tudo que você precisa, <span className="text-gradient">nada que não precisa.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Ferramentas poderosas e simples para transformar sua relação com o dinheiro.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass rounded-xl p-6 group hover:border-primary/30 transition-all duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Um preço. <span className="text-gradient">Sem surpresas.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            Comece grátis por 4 dias. Depois, apenas R$ 21,90/mês.
          </p>
        </motion.div>

        <motion.div
          className="glass rounded-2xl p-8 sm:p-10 shadow-glow border-primary/20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
        >
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl font-extrabold text-gradient">R$ 21,90</span>
            <span className="text-muted-foreground">/mês</span>
          </div>
          <p className="text-muted-foreground mb-8">Acesso completo a todas as funcionalidades</p>

          <ul className="text-left max-w-sm mx-auto space-y-3 mb-10">
            {[
              "Dashboard de BI completo",
              "Assistente financeiro com IA",
              "Simulador de investimentos",
              "Lançamentos via WhatsApp",
              "Metas e planejamento",
              "Conexão bancária segura",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-3 h-3 text-primary" />
                </div>
                {item}
              </li>
            ))}
          </ul>

          <Link to="/dashboard">
            <Button variant="hero" size="lg" className="w-full text-base py-6">
              Começar Teste Grátis de 4 Dias
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-10 text-center text-sm text-muted-foreground">
        <p>© 2026 Liberta. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
