import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/liberta-logo-white.png";
import logoColor from "@/assets/logo_liberta_colorido.png";
import heroMockupDevices from "@/assets/hero-mockup-devices.png";
import { ArrowRight, Shield, TrendingUp, Bot, Smartphone, BarChart3, Target, Star, CheckCircle2, Heart, Sparkles, PieChart, Landmark, ArrowUpRight, Lock, Zap, ChevronRight, PlayCircle } from "lucide-react";
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
  const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -50]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/20">

      {/* ──── AMBIENT BACKGROUND ──── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-primary/10 blur-[150px] mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/10 blur-[150px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-[20%] w-[50vw] h-[50vw] rounded-full bg-orange-500/10 blur-[150px] mix-blend-screen animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-grain opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* ──── NAVIGATION ──── */}
      <header className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "bg-background/80 backdrop-blur-2xl border-b border-white/10 dark:border-white/5 py-4 shadow-sm" : "bg-transparent py-6"
      )}>
        <nav className="flex items-center justify-between px-6 lg:px-12 max-w-[1400px] mx-auto">
          <Link to="/" className="flex items-center gap-2 relative group">
            <div className="absolute -inset-2 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={logoWhite} alt="Liberta" className="h-10 relative z-10 hidden dark:block transition-transform group-hover:scale-105" />
            <img src={logoColor} alt="Liberta" className="h-10 relative z-10 block dark:hidden transition-transform group-hover:scale-105" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-6">
            <ModeToggle />
            <Link to="/login" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              Entrar
            </Link>
            <Link to="/register">
              <Button className="rounded-full px-6 sm:px-8 bg-foreground text-background hover:bg-foreground/90 font-bold shadow-xl shadow-foreground/10 transition-all hover:scale-105 active:scale-95 h-10 sm:h-11">
                Criar Conta
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ──── HERO SECTION ──── */}
      <section className="relative z-10 pt-40 pb-20 sm:pt-48 sm:pb-32 px-6 overflow-hidden">
        <motion.div style={{ opacity: opacityHero }} className="max-w-5xl mx-auto text-center flex flex-col items-center justify-center min-h-[70vh]">

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}></motion.div>

          <motion.h1
            className="text-5xl sm:text-7xl lg:text-[6rem] font-bold tracking-tighter leading-[1.05] mb-8"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            A inteligência que <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-orange-500 animate-gradient-x">
              multiplica seu tempo.
            </span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-lg sm:text-2xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Conecte suas contas. Converse com a IA. E deixe o trabalho sujo de categorização e planilhas para o nosso sistema.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full sm:w-auto items-center"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg h-16 px-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 font-bold group">
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ──── BANK MARQUEE ──── */}
      <section className="relative z-10 py-10 border-y border-border/40 bg-background/40 backdrop-blur-md overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex flex-col items-center gap-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Sincronização oficial com</p>
          <motion.div
            className="flex gap-16 sm:gap-24 items-center min-w-max px-12"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {[
              ...[
                { name: 'Nubank', logo: '/banks/nubank.png' },
                { name: 'Itaú', logo: '/banks/itau.png' },
                { name: 'Bradesco', logo: '/banks/bradesco.png' },
                { name: 'Santander', logo: '/banks/santander.png' },
                { name: 'Inter', logo: '/banks/inter.png' },
                { name: 'C6 Bank', logo: '/banks/c6_bank.png' },
                { name: 'XP', logo: '/banks/xp_investimentos.png' },
                { name: 'Caixa', logo: '/banks/caixa.png' }
              ],
              ...[
                { name: 'Nubank', logo: '/banks/nubank.png' },
                { name: 'Itaú', logo: '/banks/itau.png' },
                { name: 'Bradesco', logo: '/banks/bradesco.png' },
                { name: 'Santander', logo: '/banks/santander.png' },
                { name: 'Inter', logo: '/banks/inter.png' },
                { name: 'C6 Bank', logo: '/banks/c6_bank.png' },
                { name: 'XP', logo: '/banks/xp_investimentos.png' },
                { name: 'Caixa', logo: '/banks/caixa.png' }
              ]
            ].map((bank, i) => (
              <div key={i} className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-opacity duration-300 cursor-default">
                <img src={bank.logo} alt={bank.name} className="h-10 sm:h-12 w-auto object-contain" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──── FEATURE: LIA AI CHAT ──── */}
      <section id="demo" className="relative z-10 max-w-7xl mx-auto px-6 py-32 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="w-20 h-20 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary/20 flex items-center justify-center mb-8 shadow-2xl">
              <img src={liaAvatar} alt="Lia AI" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
              A inteligência artificial que entende o <span className="text-primary italic">seu bolso.</span>
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl mb-10 leading-relaxed font-medium">
              Escreva ou grave um áudio: "Gastei 150 reais no mercado". A Lia categoriza, debita do orçamento certo e te avisa se você está gastando demais.
            </p>

            <div className="flex flex-col gap-6">
              {[
                { title: "Categorização Zero Effort", desc: "Acabe com a dor de classificar transações uma a uma." },
                { title: "Contextos Complexos", desc: "A IA entende o histórico dos seus meses anteriores e aponta anomalias." },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-purple-500/10 to-transparent blur-[80px] -z-10 rounded-full" />
            <div className="bg-background/80 dark:bg-[#111] border border-border/50 rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-2xl">
              <div className="p-6 border-b border-border/40 flex items-center gap-4 bg-secondary/30">
                <div className="w-12 h-12 rounded-full border border-primary/20 overflow-hidden relative">
                  <img src={liaAvatar} alt="Lia" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight">Lia 2.0</h4>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Assistente Ativa</p>
                </div>
              </div>
              <div className="p-6 sm:p-8 space-y-6">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-secondary/50 border border-border/50 p-4 rounded-2xl rounded-tl-sm text-sm font-medium max-w-[90%] shadow-sm">
                  Bom dia! Notei que entrou o seu salário da XP ontem. Devo alocar 20% para a sua meta de Reserva de Emergência como de costume?
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }} className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-sm text-sm font-medium max-w-[85%] ml-auto shadow-md">
                  Sim, por favor! E me diga quanto sobrou livre para gastos variáveis.
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 1.5 }} className="bg-secondary/50 border border-border/50 p-4 rounded-2xl rounded-tl-sm text-sm font-medium max-w-[90%] shadow-sm flex flex-col gap-3">
                  <p>Alocado! ✅</p>
                  <p>Você tem <strong className="text-foreground">R$ 2.450,00</strong> livres este mês para gastos variáveis.</p>
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-primary w-[30%] rounded-full" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──── FEATURE: DASHBOARD PREVIEW ──── */}
      <section className="relative z-10 py-32 bg-secondary/20 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">Um Dashboard feito para impressionar e funcionar.</h2>
            <p className="text-lg text-muted-foreground font-medium">Relatórios complexos (Pareto, Radar, Treemap) simplificados em uma interface de cair o queixo.</p>
          </div>

          <div className="relative flex justify-center items-center h-[400px] sm:h-[600px] w-full perspective-[1000px]">
            {/* ──── LAPTOP MOCKUP ──── */}
            <motion.div
              style={{ y: y1 }}
              className="absolute w-[95%] sm:w-[85%] md:w-[800px] aspect-[16/10] sm:aspect-video rounded-t-2xl sm:rounded-t-3xl border-4 sm:border-8 border-border bg-background shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Browser Header */}
              <div className="h-6 sm:h-8 border-b border-border bg-secondary/80 flex items-center px-3 sm:px-4 gap-1.5 sm:gap-2 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>

              {/* Liberta Real UI - Relatórios */}
              <div className="flex-1 flex bg-background overflow-hidden text-[10px] sm:text-xs">
                {/* Sidebar */}
                <div className="w-32 sm:w-48 border-r border-border p-2 sm:p-4 flex flex-col gap-1 sm:gap-2 hidden md:flex shrink-0">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base mb-4 px-2 tracking-tight">
                    <img src={logoColor} alt="Liberta" className="h-4 block dark:hidden" />
                    <img src={logoWhite} alt="Liberta" className="h-4 hidden dark:block" />
                  </div>
                  {[
                    { n: 'Dashboard', active: false },
                    { n: 'Patrimônio', active: false },
                    { n: 'Lançamentos', active: false },
                    { n: 'Metas', active: false },
                    { n: 'Orçamentos', active: false },
                    { n: 'Investimentos', active: false },
                    { n: 'Relatórios', active: true },
                    { n: 'Assistente IA', active: false },
                  ].map(item => (
                    <div key={item.n} className={`px-2 py-1.5 sm:py-2 rounded-md flex items-center gap-2 font-medium transition-colors ${item.active ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:bg-secondary/50'}`}>
                      {item.active && <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />}
                      {!item.active && <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></div>}
                      {item.n}
                    </div>
                  ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 sm:p-8 flex flex-col gap-4 sm:gap-6 overflow-hidden bg-[#FAFAFA] dark:bg-background">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="font-bold text-sm sm:text-xl text-foreground">Boa noite, Jean! 👋</h1>
                      <p className="text-muted-foreground text-[8px] sm:text-xs mt-0.5">Aqui está o resumo das suas finanças</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-border flex items-center justify-center"><Sparkles className="w-3 h-3 sm:w-4 sm:h-4 opacity-50" /></div>
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] sm:text-xs">J</div>
                    </div>
                  </div>

                  {/* Title & Tabs */}
                  <div>
                    <h2 className="font-bold text-base sm:text-2xl flex items-center gap-2 text-foreground">
                      <BarChart3 className="w-5 h-5 text-primary" /> Relatórios & Análises
                    </h2>
                    <div className="flex gap-2 mt-4 border-b border-border/50 pb-0">
                      <div className="px-4 py-2 border-b-2 border-primary text-primary font-bold bg-primary/5 rounded-t-lg">Visão Geral</div>
                      <div className="px-4 py-2 text-muted-foreground font-medium hidden sm:block">Análise de Gastos</div>
                      <div className="px-4 py-2 text-muted-foreground font-medium hidden sm:block">Tendências</div>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                    {/* Receitas */}
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 p-3 sm:p-4 rounded-xl shadow-sm">
                      <p className="text-[8px] sm:text-[10px] text-green-700 dark:text-green-500 font-bold uppercase tracking-wider mb-1">Receitas</p>
                      <p className="text-base sm:text-2xl font-black text-green-600 dark:text-green-400">R$ 14.500,00</p>
                      <p className="text-[7px] sm:text-[10px] text-green-600/70 dark:text-green-400/70 font-medium mt-1">↗ 12% vs mês anterior</p>
                    </div>
                    {/* Despesas */}
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-3 sm:p-4 rounded-xl shadow-sm">
                      <p className="text-[8px] sm:text-[10px] text-red-700 dark:text-red-500 font-bold uppercase tracking-wider mb-1">Despesas</p>
                      <p className="text-base sm:text-2xl font-black text-red-600 dark:text-red-400">R$ 4.230,00</p>
                      <p className="text-[7px] sm:text-[10px] text-red-600/70 dark:text-red-400/70 font-medium mt-1">↘ 5% vs mês anterior</p>
                    </div>
                    {/* Taxa de Poupança */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 p-3 sm:p-4 rounded-xl shadow-sm">
                      <p className="text-[8px] sm:text-[10px] text-blue-700 dark:text-blue-500 font-bold uppercase tracking-wider mb-1">Taxa de Poupança</p>
                      <p className="text-base sm:text-2xl font-black text-blue-600 dark:text-blue-400">70%</p>
                    </div>
                    {/* Gasto Médio */}
                    <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50 p-3 sm:p-4 rounded-xl shadow-sm">
                      <p className="text-[8px] sm:text-[10px] text-orange-700 dark:text-orange-500 font-bold uppercase tracking-wider mb-1">Gasto Médio/Dia</p>
                      <p className="text-base sm:text-2xl font-black text-orange-600 dark:text-orange-400">R$ 141,00</p>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="flex-1 bg-white dark:bg-secondary/20 shadow-sm border border-border rounded-xl p-4 sm:p-5 flex flex-col">
                    <h3 className="font-bold text-[10px] sm:text-sm text-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Fluxo de Caixa Acumulado</h3>
                    <div className="flex-1 mt-4 relative flex items-end ml-4 sm:ml-8 border-l border-b border-border/50">
                      {/* Grids */}
                      <div className="absolute inset-0 flex flex-col justify-between opacity-10">
                        <div className="w-full border-t border-dashed border-foreground"></div>
                        <div className="w-full border-t border-dashed border-foreground"></div>
                        <div className="w-full border-t border-dashed border-foreground"></div>
                        <div className="w-full border-t border-dashed border-foreground"></div>
                      </div>

                      <svg viewBox="0 0 100 40" className="w-full h-full preserve-3d overflow-visible z-10" preserveAspectRatio="none">
                        <motion.path
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          d="M0,35 C10,25 20,30 30,15 C40,0 50,10 60,5 C70,0 80,20 90,10 L100,0"
                          fill="none"
                          stroke="currentColor"
                          className="text-primary stroke-[0.5] sm:stroke-[0.3]"
                        />
                        <motion.path
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 0.1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          d="M0,35 C10,25 20,30 30,15 C40,0 50,10 60,5 C70,0 80,20 90,10 L100,0 L100,40 L0,40 Z"
                          fill="currentColor"
                          className="text-primary"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ──── MOBILE PHONE MOCKUP (Patrimônio) ──── */}
            <motion.div
              style={{ y: y2 }}
              className="absolute right-[2%] sm:right-[10%] md:right-[15%] bottom-[0%] sm:bottom-[-5%] w-[130px] sm:w-[180px] md:w-[220px] aspect-[9/19] rounded-[2rem] sm:rounded-[2.5rem] border-[6px] sm:border-[8px] border-border bg-background shadow-2xl overflow-hidden z-20"
            >
              {/* Dynamic Island / Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 h-4 sm:h-5 bg-black dark:bg-border rounded-full z-30" />

              <div className="flex-1 h-full bg-[#FAFAFA] dark:bg-background flex flex-col overflow-hidden pt-8 sm:pt-10">
                {/* Header Mobile */}
                <div className="px-3 sm:px-4 pb-2 sm:pb-3 flex justify-between items-center mt-2">
                  <div className="font-bold text-[10px] sm:text-xs">
                    <img src={logoColor} alt="Liberta" className="h-2.5 sm:h-3 block dark:hidden" />
                    <img src={logoWhite} alt="Liberta" className="h-2.5 sm:h-3 hidden dark:block" />
                  </div>
                  <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[8px] sm:text-[10px]">J</div>
                </div>

                <div className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 flex-1">
                  <div>
                    <h2 className="font-bold text-[10px] sm:text-sm text-foreground flex items-center gap-1.5 leading-tight"><Landmark className="w-3 h-3 text-primary" /> Consolidação de Patrimônio</h2>
                  </div>

                  {/* Patrimônio total card */}
                  <div className="border border-primary/20 bg-primary/5 rounded-xl p-3 sm:p-4 text-center shadow-sm">
                    <p className="text-[7px] sm:text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Patrimônio Líquido</p>
                    <p className="text-[12px] sm:text-lg font-black text-primary">R$ 38.500,00</p>
                  </div>

                  {/* Donut Chart Simulation */}
                  <div className="border border-border bg-white dark:bg-secondary/10 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center relative shadow-sm">
                    <p className="text-[7px] sm:text-[9px] font-bold absolute top-2 sm:top-3 left-2 sm:left-3 text-muted-foreground uppercase tracking-widest">Distribuição</p>
                    <motion.div
                      initial={{ rotate: -90, scale: 0.5 }}
                      whileInView={{ rotate: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, type: "spring" }}
                      className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-[5px] sm:border-[8px] border-red-500 border-t-green-500 border-r-green-500 mt-5 shadow-inner"
                    />
                    <div className="flex gap-3 mt-4 text-[7px] sm:text-[9px] font-bold text-muted-foreground">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Ativos</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Passivos</span>
                    </div>
                  </div>

                  {/* Saúde Financeira */}
                  <div className="border border-border bg-white dark:bg-secondary/10 rounded-xl p-3 sm:p-4 flex-1 flex flex-col justify-center shadow-sm">
                    <p className="text-[8px] sm:text-[11px] font-bold mb-1 text-foreground">Sua Saúde Financeira</p>
                    <p className="text-[5px] sm:text-[7.5px] text-muted-foreground leading-snug mb-3">Manter uma proporção acima de 70% é o ideal para sua liberdade.</p>
                    <div className="flex justify-between text-[6px] sm:text-[8px] font-bold mb-1.5">
                      <span className="text-muted-foreground uppercase tracking-wider text-[5px] sm:text-[7px]">Índice de Liquidez</span>
                      <span className="text-green-500">85%</span>
                    </div>
                    <div className="h-1.5 sm:h-2 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-green-400 to-green-500"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──── PRICING ──── */}
      <section id="planos" className="relative z-10 max-w-5xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">Acesso ilimitado ao seu futuro.</h2>
          <p className="text-lg text-muted-foreground font-medium mb-12">Sem planos confusos. Apenas um plano com tudo liberado.</p>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Mensal</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 rounded-full bg-secondary border border-border/50 flex items-center px-1 transition-all hover:bg-secondary/80 focus:outline-none"
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-primary"
                animate={{ x: isAnnual ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Anual <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider">Economize 15%</span>
            </span>
          </div>
        </div>

        <motion.div
          className="bg-background/80 dark:bg-[#111] border border-border/60 rounded-[2.5rem] p-10 sm:p-14 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Lock className="w-64 h-64" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center justify-between">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black uppercase tracking-widest text-primary mb-2">Liberta Premium</h3>
              <p className="text-muted-foreground font-medium mb-8">Todas as funcionalidades. Sem restrições.</p>

              <div className="flex items-baseline justify-center md:justify-start gap-2 mb-2">
                <span className="text-6xl font-black tracking-tighter">
                  {isAnnual ? "R$ 197,10" : "R$ 21,90"}
                </span>
                <span className="text-muted-foreground font-bold">{isAnnual ? '/ano' : '/mês'}</span>
              </div>
              {isAnnual && <p className="text-sm text-primary font-bold">Equivale a apenas R$ 16,42 por mês (25% off)</p>}
            </div>

            <div className="w-full md:w-auto">
              <ul className="space-y-4 mb-8 text-left">
                {[
                  "Inteligência Artificial Lia 2.0 Ilimitada",
                  "Sincronização com +25 Bancos (Open Finance)",
                  "Metas e Orçamentos Ilimitados",
                  "Gráficos Diretos (Radar, Pareto, Fluxo)",
                  "Gestão Consolidada de Patrimônio",
                  "Suporte Prioritário VIP",
                  "Sem surpresas. Zero anúncios."
                ].map(item => (
                  <li key={item} className="flex items-center gap-4 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register">
                <Button className="w-full h-16 rounded-xl text-xl font-bold bg-foreground text-background hover:bg-foreground/90 transition-transform active:scale-95 shadow-xl">
                  Criar Conta Premium
                </Button>
              </Link>
              <p className="text-center mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Cancele a qualquer momento</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ──── MASSIVE FOOTER CTA ──── */}
      <section className="relative z-10 px-6 py-32 border-t border-border/40">
        <div className="max-w-6xl mx-auto rounded-[3rem] px-6 py-24 sm:py-32 text-center relative overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-orange-500 shadow-2xl">
          <div className="absolute inset-0 bg-grain opacity-20 mix-blend-overlay" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative z-10">
            <h2 className="text-4xl sm:text-7xl font-bold mb-8 tracking-tighter text-white">
              É hora de virar a chave.
            </h2>
            <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">
              Junte-se a milhares de pessoas que já deixaram as planilhas no passado.
            </p>
            <Link to="/register">
              <Button size="lg" className="h-20 px-12 rounded-full bg-white text-primary hover:bg-white/90 font-black text-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300">
                Começar Agora Mesmo <ArrowUpRight className="ml-3 w-8 h-8" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ──── FOOTER ──── */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 opacity-50">
          <img src={logoWhite} alt="Liberta" className="h-6 hidden dark:block" />
          <img src={logoColor} alt="Liberta" className="h-6 block dark:hidden" />
          <span className="text-sm font-medium">© {new Date().getFullYear()} Liberta Finance.</span>
        </div>
        <div className="flex gap-8 text-sm font-bold text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Termos</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
          <a href="#" className="hover:text-foreground transition-colors">Contato</a>
        </div>
      </footer>
    </div>
  );
}
