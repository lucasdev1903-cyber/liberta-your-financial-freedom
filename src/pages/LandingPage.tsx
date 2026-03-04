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
              className="absolute w-[90%] sm:w-[80%] md:w-[700px] aspect-video rounded-t-2xl sm:rounded-t-3xl border-4 sm:border-8 border-border bg-background shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Browser Header */}
              <div className="h-6 sm:h-8 border-b border-border bg-secondary/80 flex items-center px-3 sm:px-4 gap-1.5 sm:gap-2 shrink-0">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500/80" />
              </div>

              {/* Dashboard Content (Dynamic) */}
              <div className="flex-1 bg-background/50 backdrop-blur-3xl p-4 sm:p-6 grid grid-cols-3 gap-4 overflow-hidden">
                <div className="col-span-2 space-y-4">
                  <div className="h-4 sm:h-5 w-24 sm:w-32 bg-secondary rounded" />
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-secondary/30 rounded-lg p-2 sm:p-3 border border-border/30">
                        <div className="h-2 sm:h-2.5 w-12 sm:w-16 bg-muted/20 rounded mb-2 sm:mb-3" />
                        <div className="h-4 sm:h-5 w-16 sm:w-20 bg-muted/40 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="h-24 sm:h-40 bg-secondary/30 rounded-lg sm:rounded-xl border border-border/30 flex items-end p-3 sm:p-4 gap-1.5 sm:gap-2">
                    {[30, 50, 40, 70, 55, 80, 60, 90, 40, 60].map((h, i) => (
                      <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex-1 bg-gradient-to-t from-primary to-primary/20 rounded-t-sm" />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-24 sm:h-32 bg-secondary/30 rounded-lg sm:rounded-xl border border-border/30 flex items-center justify-center p-4">
                    <motion.div initial={{ rotate: -90, scale: 0 }} whileInView={{ rotate: 0, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", duration: 1.5 }} className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-[6px] sm:border-[8px] border-primary/20 border-t-primary border-r-primary" />
                  </div>
                  <div className="h-20 sm:h-28 bg-secondary/30 rounded-lg sm:rounded-xl border border-border/30 p-3 sm:p-4 flex flex-col justify-end gap-2 sm:gap-3">
                    <div className="h-1.5 sm:h-2 w-full bg-muted/20 rounded-full"><motion.div initial={{ width: 0 }} whileInView={{ width: "70%" }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 1 }} className="h-full bg-primary rounded-full" /></div>
                    <div className="h-1.5 sm:h-2 w-full bg-muted/20 rounded-full"><motion.div initial={{ width: 0 }} whileInView={{ width: "45%" }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 1 }} className="h-full bg-purple-500 rounded-full" /></div>
                    <div className="h-1.5 sm:h-2 w-full bg-muted/20 rounded-full"><motion.div initial={{ width: 0 }} whileInView={{ width: "85%" }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 1 }} className="h-full bg-orange-500 rounded-full" /></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ──── MOBILE PHONE MOCKUP ──── */}
            <motion.div
              style={{ y: y2 }}
              className="absolute right-[5%] sm:right-[15%] md:right-[15%] bottom-[5%] sm:bottom-[-5%] w-[120px] sm:w-[180px] md:w-[220px] aspect-[9/19] rounded-[2rem] sm:rounded-[2.5rem] border-[6px] sm:border-[8px] border-border bg-background shadow-2xl overflow-hidden z-20"
            >
              {/* Dynamic Island / Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 h-4 sm:h-5 bg-border rounded-full z-30" />

              <div className="flex-1 h-full bg-background/80 backdrop-blur-3xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 overflow-hidden pt-8 sm:pt-10">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 shrink-0" />
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    <div className="h-2 sm:h-2.5 w-16 sm:w-20 bg-muted/40 rounded" />
                    <div className="h-1.5 sm:h-2 w-10 sm:w-12 bg-muted/20 rounded" />
                  </div>
                </div>

                <div className="h-20 sm:h-28 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-lg">
                  <span className="text-[10px] sm:text-xs opacity-80">Saldo Geral</span>
                  <div className="h-4 sm:h-6 w-24 sm:w-32 bg-white/20 rounded" />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-secondary/50 rounded-lg sm:rounded-xl p-2 sm:p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted/40 shrink-0" />
                        <div className="space-y-1">
                          <div className="h-1.5 sm:h-2 w-12 sm:w-16 bg-muted/40 rounded" />
                          <div className="h-1.5 sm:h-2 w-8 sm:w-10 bg-muted/20 rounded" />
                        </div>
                      </div>
                      <div className="h-2 sm:h-3 w-8 sm:w-12 bg-primary/40 rounded" />
                    </div>
                  ))}
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
