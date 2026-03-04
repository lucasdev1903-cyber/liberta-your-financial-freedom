import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/liberta-logo-white.png";
import logoColor from "@/assets/logo_liberta_colorido.png";
import { ArrowRight, Shield, TrendingUp, Bot, Smartphone, BarChart3, Target, Star, CheckCircle2, Heart, Sparkles, PieChart, Landmark, ArrowUpRight, Lock, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import liaAvatar from "@/assets/lia-avatar.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-[#0a0a0a] overflow-hidden bg-grain selection:bg-primary/30">
      {/* ══════════════ ADVANCED AMBIENT GLOWS ══════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60 dark:opacity-100 mix-blend-screen">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px]"
        />
      </div>

      {/* ══════════════ NAVIGATION ══════════════ */}
      <header className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
        scrolled ? "bg-background/70 backdrop-blur-xl border-border/50 shadow-sm py-4" : "bg-transparent border-transparent py-6"
      )}>
        <nav className="flex items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <img src={logoWhite} alt="Liberta" className="h-7 hidden dark:block hover:scale-105 transition-transform" />
            <img src={logoColor} alt="Liberta" className="h-7 block dark:hidden hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <ModeToggle />
            <Link to="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Entrar
            </Link>
            <Link to="/register">
              <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 font-bold shadow-xl shadow-foreground/10 transition-all hover:scale-105">
                Começar Agora
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ══════════════ HERO SECTION ══════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-20 sm:pt-48 sm:pb-32 text-center flex flex-col items-center justify-center min-h-[85vh]">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-border/50 backdrop-blur-md mb-8 shadow-sm hover:bg-secondary/50 transition-colors cursor-pointer group">
            <Sparkles className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              O novo padrão em inteligência financeira
            </span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05] mb-8 max-w-5xl mx-auto"
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
        >
          Sua vida financeira, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-purple-500">
            no automático.
          </span>
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-lg sm:text-2xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
          initial="hidden" animate="visible" variants={fadeUp} custom={2}
        >
          Planeje, acompanhe e multiplique seu patrimônio com a primeira plataforma que une Open Finance real e Inteligência Artificial.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
          initial="hidden" animate="visible" variants={fadeUp} custom={3}
        >
          <Link to="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-10 py-7 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 font-bold">
              Começar Agora <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <a href="#demo" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-10 py-7 rounded-full border-2 hover:bg-secondary/20 transition-all duration-300 font-bold">
              Ver Demonstração
            </Button>
          </a>
        </motion.div>

        <motion.div className="mt-16 flex items-center justify-center gap-4 text-sm font-semibold text-muted-foreground" initial="hidden" animate="visible" variants={fadeUp} custom={4}>
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start">
            <div className="flex text-yellow-500"><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /></div>
            <span>Junte-se a +10.000 usuários</span>
          </div>
        </motion.div>
      </section>

      {/* ══════════════ DASHBOARD MOCKUP ══════════════ */}
      <section id="demo" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-32 perspective-1000">
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, rotateX: 20, y: 100 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          className="relative rounded-3xl sm:rounded-[2.5rem] border border-border/50 bg-background/50 backdrop-blur-2xl shadow-2xl overflow-hidden glass-strong"
        >
          {/* Top Window Bar */}
          <div className="h-12 bg-secondary/30 border-b border-border/50 flex items-center px-6 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>

          <div className="p-4 sm:p-8 grid lg:grid-cols-3 gap-6">
            {/* Sidebar Mock */}
            <div className="hidden lg:flex flex-col gap-4 border-r border-border/30 pr-6">
              <div className="h-8 w-24 bg-primary/20 rounded mb-4" />
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 w-full bg-secondary/30 rounded-xl" />)}
            </div>

            {/* Main Content Mock */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-8 w-48 bg-primary/10 rounded-lg" />
                <div className="h-10 w-10 bg-secondary/50 rounded-full" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Saldo Total", value: "R$ 45.230", color: "text-foreground" },
                  { label: "Receitas", value: "R$ 12.400", color: "text-green-500" },
                  { label: "Despesas", value: "R$ 4.100", color: "text-red-500" },
                  { label: "Rentabilidade", value: "+ 1.2%", color: "text-primary" },
                ].map((c, i) => (
                  <div key={i} className="glass rounded-2xl p-4">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{c.label}</div>
                    <div className={cn("text-xl font-black", c.color)}>{c.value}</div>
                  </div>
                ))}
              </div>

              <div className="glass rounded-2xl p-6 h-64 flex flex-col justify-end gap-2 relative overflow-hidden">
                <div className="absolute top-4 left-4 text-sm font-bold">Fluxo Acumulado</div>
                <div className="flex items-end gap-2 h-3/4 w-full">
                  {[30, 45, 40, 60, 50, 80, 70, 95].map((h, i) => (
                    <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.1 }} className="flex-1 bg-gradient-to-t from-primary/80 to-purple-500/80 rounded-t-sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements Over Mockup */}
          <motion.div style={{ y: y2 }} className="absolute -right-8 top-1/3 glass-strong p-4 rounded-2xl shadow-2xl border border-border/50 hidden md:flex items-center gap-4">
            <img src={liaAvatar} alt="Lia" className="w-12 h-12 rounded-full" />
            <div>
              <p className="text-sm font-bold">Sua meta foi batida! 🎯</p>
              <p className="text-xs text-muted-foreground">Você atingiu R$ 10k na reserva.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════ BANK MARQUEE ══════════════ */}
      <section className="relative z-10 py-12 border-y border-border/10 bg-background/30 overflow-hidden flex items-center">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div
          className="flex gap-12 sm:gap-24 items-center min-w-max px-12"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        >
          {/* Duplicate array for seamless infinite loop */}
          {[...['NUBANK', 'ITAÚ', 'BRADESCO', 'SANTANDER', 'INTER', 'C6 BANK', 'XP', 'BTG PACTUAL', 'CAIXA'], ...['NUBANK', 'ITAÚ', 'BRADESCO', 'SANTANDER', 'INTER', 'C6 BANK', 'XP', 'BTG PACTUAL', 'CAIXA']].map((bank, i) => (
            <div key={i} className="flex items-center gap-2 text-xl sm:text-2xl font-black text-muted-foreground/30 grayscale hover:grayscale-0 hover:text-primary transition-all duration-300">
              <Landmark className="w-5 h-5 sm:w-8 sm:h-8" /> {bank}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════ LIA 2.0 (Restored & Enhanced) ══════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold mb-8 border border-primary/20 uppercase tracking-widest shadow-glow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Sua inteligência 24h</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
              A Lia é a inteligência <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                que trabalha para você.
              </span>
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-lg leading-relaxed">
              Diga adeus à digitação manual. Converse com a Lia por texto ou voz para automatizar lançamentos e obter diagnósticos precisos do seu patrimônio.
            </p>

            <div className="space-y-8">
              {[
                { title: "Lançamentos Automáticos", desc: "Diga 'Registrar despesa de R$ 350 com fornecedor X' e pronto." },
                { title: "Alertas Inteligentes", desc: "Rastreio constante de contas, faturas e fluxo de caixa em tempo real." },
                { title: "Análise Preditiva", desc: "Receba previsões de quando suas metas serão atingidas com base no seu perfil." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className="w-10 h-10 rounded-full bg-secondary border border-border/50 flex items-center justify-center shrink-0 mt-1 shadow-sm group-hover:bg-primary group-hover:border-primary transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Chat Preview */}
          <motion.div
            className="relative perspective-1000"
            initial={{ opacity: 0, scale: 0.9, x: 40, rotateY: -10 }}
            whileInView={{ opacity: 1, scale: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="glass-strong rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative z-10 border border-primary/20 max-w-md mx-auto shadow-glow-lg float-slow bg-background/60 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-8 border-b border-border/30 pb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/50 shadow-glow"><img src={liaAvatar} alt="Lia" className="w-full h-full object-cover" /></div>
                <div>
                  <h4 className="font-extrabold text-lg">Lia 2.0</h4>
                  <p className="text-[10px] text-green-500 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-glow-sm" /> Online Agora
                  </p>
                </div>
              </div>

              <div className="space-y-6 mb-8 min-h-[220px]">
                <div className="glass p-4 rounded-3xl rounded-tl-none text-sm max-w-[90%] leading-relaxed border-border/30 shadow-sm">
                  Olá! Eu sou a Lia 👋 Sua assistente financeira. Com base no seu saldo atual de <strong className="text-foreground">R$ 12.450</strong>, como posso ajudar seu patrimônio a crescer hoje?
                </div>
                <div className="bg-primary/20 p-4 rounded-3xl rounded-tr-none text-sm ml-auto max-w-[85%] border border-primary/30 shadow-sm font-medium text-foreground">
                  Quanto gastei de iFood esse mês?
                </div>
                <div className="glass p-4 rounded-3xl rounded-tl-none text-sm max-w-[90%] font-medium border-primary/20 leading-relaxed shadow-glow-sm bg-primary/5">
                  Você gastou <span className="text-red-500 font-bold">R$ 480,00</span> em Delivery este mês. Isso representa <span className="font-bold">12%</span> do seu orçamento. Quer que eu restrinja esse limite? 🎯
                </div>
              </div>
            </div>
            {/* Ambient Background Blur for Chat */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] rounded-full -z-10 pulse-glow" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════ PRICING (Restored & Enhanced) ══════════════ */}
      <section id="planos" className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32 border-t border-border/10">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none -z-10">
          <Sparkles className="w-64 h-64 text-primary" />
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight">Um investimento na sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">liberdade.</span></h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Acesso completo a todas as ferramentas premium por um valor justo e transparente.
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          <div className="flex justify-center items-center gap-4 sm:gap-6 mb-12">
            <span className={`text-sm sm:text-base font-bold tracking-tight ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Mensal</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="group relative w-16 h-8 sm:w-20 sm:h-10 rounded-full bg-secondary border border-border/50 flex items-center px-1.5 transition-all hover:bg-secondary/80 shadow-inner focus:outline-none"
            >
              <motion.div
                className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-primary transition-all duration-500 shadow-glow"
                animate={{ x: isAnnual ? (window.innerWidth >= 640 ? 36 : 28) : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm sm:text-base font-bold tracking-tight flex items-center gap-2 ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Anual <span className="text-primary text-[10px] font-black border border-primary/20 px-2 py-0.5 rounded-full bg-primary/10 uppercase tracking-wider hidden sm:inline-block">2 meses grátis</span>
            </span>
          </div>

          <motion.div
            className="glass-strong rounded-[2.5rem] p-8 sm:p-12 border border-primary/30 relative shadow-glow-lg overflow-hidden card-hover bg-background/60"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />

            <div className="relative z-10 text-center">
              <h3 className="text-2xl font-black mb-2 text-primary uppercase tracking-widest">Plano Liberta</h3>
              <p className="text-muted-foreground text-sm mb-8 font-medium">Tudo o que você precisa para dominar suas finanças.</p>

              <div className="flex items-baseline justify-center gap-1 mb-10">
                <span className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
                  {isAnnual ? "R$ 29,90" : "R$ 34,90"}
                </span>
                <span className="text-muted-foreground text-sm sm:text-base font-bold uppercase tracking-widest">/mês</span>
              </div>

              <ul className="space-y-4 mb-10 text-left max-w-sm mx-auto">
                {[
                  "Metas financeiras ilimitadas",
                  "Histórico de transações completo",
                  "Consolidação de Patrimônio",
                  "Inteligência Artificial Lia 2.0 (Chat 24/7)",
                  "Relatórios Avançados (Pareto, Radar)",
                  "Conexão Open Finance Inclusa"
                ].map(item => (
                  <li key={item} className="flex items-start gap-4 text-foreground/90 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register">
                <Button variant="hero" className="w-full h-16 sm:h-20 rounded-2xl text-xl sm:text-2xl font-black shadow-glow hover:scale-[1.03] transition-all">
                  Assinar Premium
                </Button>
              </Link>
              <p className="mt-6 text-xs text-muted-foreground font-bold uppercase tracking-widest">Cancele quando quiser</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ MASSIVE FOOTER CTA ══════════════ */}
      <section className="relative z-10 px-6 py-32 mb-10">
        <div className="max-w-5xl mx-auto glass-strong rounded-[3rem] p-10 sm:p-20 text-center relative overflow-hidden border border-primary/30">
          <div className="absolute inset-0 left-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-orange-500/20 opacity-50" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black mb-6">
              Pronto para assumir <br />o controle?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Crie sua conta em menos de 2 minutos e descubra como a tecnologia pode transformar sua relação com o dinheiro.
            </p>
            <Link to="/register">
              <Button size="lg" className="text-lg px-12 py-8 rounded-full bg-foreground text-background hover:bg-foreground/90 font-black shadow-2xl hover:scale-105 transition-all duration-300">
                Criar Minha Conta <ArrowUpRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-8 border-t border-border/20 text-center flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img src={logoWhite} alt="Liberta" className="h-6 hidden dark:block opacity-50" />
          <img src={logoColor} alt="Liberta" className="h-6 block dark:hidden opacity-50" />
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Liberta Finance.</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground font-medium">
          <a href="#" className="hover:text-foreground transition-colors">Termos</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
          <a href="#" className="hover:text-foreground transition-colors">Contato</a>
        </div>
      </footer>
    </div>
  );
}
