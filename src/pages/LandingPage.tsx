import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/liberta-logo-white.png";
import logoColor from "@/assets/logo_liberta_colorido.png";
import heroMockup from "@/assets/hero-mockup-devices.png";
import { ArrowRight, Shield, TrendingUp, Bot, Smartphone, BarChart3, Target, Star, ChevronDown, CheckCircle2, Heart, Bell, MessageSquare, Sparkles, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    icon: Heart,
    title: "Categorias Emocionais",
    desc: "Organize gastos por sentimentos como 'Momentos com Amigos' e 'Bem-Estar', não por planilhas frias.",
  },
  {
    icon: Target,
    title: "Metas Visuais",
    desc: "Defina sonhos com progresso visual, prazos e previsões inteligentes de quando você vai alcançá-los.",
  },
  {
    icon: Bot,
    title: "Insights por IA",
    desc: "Receba análises personalizadas sobre seus hábitos e sugestões para economizar mais.",
  },
  {
    icon: BarChart3,
    title: "Relatórios Avançados",
    desc: "Gráficos interativos, evolução patrimonial e exportação em PDF e Excel.",
  },
  {
    icon: Bell,
    title: "Lembretes Inteligentes",
    desc: "Notificações personalizadas para manter você no caminho certo das suas metas.",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    desc: "Seus dados protegidos com criptografia de ponta a ponta e autenticação avançada.",
  },
];

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-hero overflow-hidden">
      {/* Glow effect */}
      <div className="fixed inset-0 bg-glow pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div>
          <img src={logoWhite} alt="Liberta" className="h-8 hidden dark:block" />
          <img src={logoColor} alt="Liberta" className="h-8 block dark:hidden" />
        </div>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link to="/register">
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
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6 tracking-wide">
            7 dias grátis — avaliado com 4.9/5
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          Liberte suas finanças <br className="hidden md:block" />
          <span className="text-gradient">com propósito.</span>
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          Planeje, acompanhe e conquiste seus objetivos financeiros com inteligência artificial, relatórios avançados e uma experiência pensada para simplificar sua vida.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
        >
          <Link to="/register">
            <Button variant="hero" size="lg" className="text-base px-10 py-7 shadow-glow hover:scale-105 transition-transform">
              Começar Grátis Agora <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>

        {/* Hero Stats */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-12 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex text-yellow-500 mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="font-bold text-lg">4.9/5</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avaliação Média</span>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-extrabold text-2xl text-foreground">480+</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Usuários ativos</span>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-extrabold text-2xl text-foreground">26mil+</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Transações/mês</span>
          </div>
        </motion.div>

        {/* Dashboard preview mockup */}
        <motion.div
          className="mt-24 relative mx-auto max-w-5xl px-4 sm:px-0"
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
        >
          <div className="glass-strong rounded-[2.5rem] p-2 sm:p-5 shadow-2xl relative z-10 border-border/80">
            <div className="rounded-[1.5rem] overflow-hidden relative shadow-inner">
              <img
                src={heroMockup}
                alt="Liberta Dashboard Preview"
                className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none mix-blend-overlay" />
            </div>
          </div>
          <div className="absolute -inset-10 bg-gradient-primary opacity-[0.08] rounded-[4rem] blur-[100px] -z-10 animate-pulse-glow" />
        </motion.div>
      </section>

      {/* Features */}
      <section id="recursos" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Tudo que você precisa para <span className="text-gradient">conquistar seus sonhos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Abandone as ferramentas complicadas. Nossa inteligência artificial trabalha por você, simplificando cada detalhe da sua vida financeira.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass rounded-[2rem] p-8 group hover:border-primary/40 transition-all duration-500 hover:shadow-glow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                <f.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lia AI Assistant Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 overflow-hidden border-t border-border/50">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-8 border border-primary/20 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              <span>Sua inteligência 24h</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 leading-[1.15]">
              A Lia é a inteligência <br />
              <span className="text-gradient text-glow">que trabalha para você.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-lg leading-relaxed">
              Diga adeus à digitação manual. Converse com a Lia por texto ou voz para automatizar lançamentos e obter diagnósticos precisos do seu patrimônio.
            </p>

            <div className="space-y-8">
              {[
                { title: "Lançamentos Automáticos", desc: "Diga 'Registrar despesa de R$ 350 com fornecedor X' e pronto." },
                { title: "Alertas Inteligentes", desc: "Rastreio constante de contas, faturas e fluxo de caixa em tempo real." },
                { title: "Análise Preditiva", desc: "Receba previsões de quando suas metas serão atingidas com base no seu perfil." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1 group-hover:bg-primary group-hover:text-white transition-all">
                    <CheckCircle2 className="w-4 h-4 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Chat Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-strong rounded-[2.5rem] p-8 shadow-2xl relative z-10 border-border/80 max-w-md mx-auto shadow-glow">
              <div className="flex items-center gap-4 mb-8 border-b border-border/50 pb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-black text-xl shadow-glow">L</div>
                <div>
                  <h4 className="font-bold text-base">Lia</h4>
                  <p className="text-[10px] text-green-500 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Disponível agora
                  </p>
                </div>
              </div>

              <div className="space-y-6 mb-10 min-h-[220px]">
                <div className="glass p-4 rounded-3xl rounded-tl-none text-sm max-w-[90%] leading-relaxed">
                  Olá! Eu sou a Lia 💙 Sua assistente financeira inteligente. Como posso facilitar seu dia hoje?
                </div>
                <div className="bg-primary/20 p-4 rounded-3xl rounded-tr-none text-sm ml-auto max-w-[85%] border border-primary/20 shadow-sm">
                  Qual o meu saldo total investido hoje?
                </div>
                <div className="glass p-4 rounded-3xl rounded-tl-none text-sm max-w-[90%] font-medium border-primary/10 leading-relaxed shadow-sm">
                  Atualmente seu patrimônio total em ativos é de <span className="text-primary font-bold">R$ 16.750,00</span>. Você está <span className="text-green-500">23%</span> mais perto da sua Meta de Viagem! ✈️
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/50">
                <div className="flex-1 glass h-12 rounded-full px-5 flex items-center text-xs text-muted-foreground/60">
                  Escreva sua dúvida aqui...
                </div>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-glow hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="absolute -inset-10 bg-primary/10 blur-[80px] rounded-full -z-10 animate-pulse" />
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-border/50">
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Comece em 3 passos simples</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Abandone as ferramentas do passado e tome o controle definitivo do seu futuro.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-16 text-center max-w-5xl mx-auto relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[2.75rem] left-[15%] right-[15%] h-0.5 border-t border-dashed border-primary/30 -z-10" />

          {[
            { icon: ClipboardList, title: "Crie sua conta", desc: "Cadastre-se com Google ou email em 2 minutos. Seguro e criptografado." },
            { icon: Target, title: "Ancore metas", desc: "Defina seus objetivos e categorias emocionais que fazem sentido para você." },
            { icon: TrendingUp, title: "Evolua", desc: "Receba diagnósticos da Lia e veja seu patrimônio crescer mês a mês." }
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col items-center group"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-background border-2 border-primary/20 flex items-center justify-center mb-8 mx-auto shadow-sm group-hover:border-primary group-hover:scale-110 transition-all duration-500 relative bg-white dark:bg-zinc-950">
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-white text-sm font-black flex items-center justify-center shadow-glow">
                  {idx + 1}
                </span>
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center border-t border-border/50">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Escolha seu plano ideal</h2>
          <p className="text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Invista na sua liberdade financeira com planos que cabem no seu momento atual.
          </p>
        </motion.div>

        <div className="flex justify-center items-center gap-6 mb-20">
          <span className={`text-sm font-bold tracking-tight ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Assinatura Mensal</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="group relative w-16 h-8 rounded-full bg-secondary border border-border/50 flex items-center px-1.5 transition-all hover:bg-secondary/80 shadow-inner"
          >
            <div className={`w-5.5 h-5.5 rounded-full bg-primary transition-all duration-500 shadow-glow ${isAnnual ? 'translate-x-[2.15rem]' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-bold tracking-tight ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
            Plano Anual <span className="text-primary text-[10px] ml-2 font-black border border-primary/20 px-2 py-0.5 rounded-full bg-primary/5 uppercase">Top Desconto (-20%)</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left items-stretch">
          {/* Starter */}
          <div className="glass rounded-[2.5rem] p-10 border-border/50 flex flex-col hover:border-border transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-foreground/80 lowercase italic">starter</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-foreground">{isAnnual ? "R$ 7,90" : "R$ 9,90"}</span>
              <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">/mês</span>
            </div>
            <ul className="space-y-5 mb-12 flex-1 text-sm">
              {["Até 3 metas financeiras", "5 categorias personalizadas", "Histórico de 90 dias", "Gráficos básicos", "Suporte por email"].map(item => (
                <li key={item} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary opacity-60" /> <span className="text-muted-foreground">{item}</span></li>
              ))}
            </ul>
            <Link to="/register"><Button variant="outline" className="w-full h-14 rounded-2xl font-bold hover:bg-secondary transition-all">Começar Grátis</Button></Link>
          </div>

          {/* Liberta+ */}
          <div className="glass-strong rounded-[2.5rem] p-10 border-primary/30 relative shadow-glow scale-100 md:scale-105 z-10 flex flex-col">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-glow animate-pulse">Recomendado</div>
            <h3 className="text-xl font-bold mb-3 text-primary lowercase italic">liberta+</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black text-gradient">{isAnnual ? "R$ 19,90" : "R$ 24,90"}</span>
              <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">/mês</span>
            </div>
            <ul className="space-y-5 mb-12 flex-1 text-sm">
              {["Metas ilimitadas", "Todas as categorias", "Histórico completo", "Insights da Lia por IA", "Agente 24/7 (Chat Lia) 🤖", "Relatórios avançados (Exclusivo)", "Exportação PDF e Excel"].map(item => (
                <li key={item} className="flex items-center gap-3 font-bold text-foreground/90"><CheckCircle2 className="w-5 h-5 text-primary" /> {item}</li>
              ))}
            </ul>
            <Link to="/register"><Button variant="hero" className="w-full h-14 rounded-2xl text-lg font-black shadow-glow hover:scale-105 transition-all">Quero este plano</Button></Link>
          </div>

          {/* Família */}
          <div className="glass rounded-[2.5rem] p-10 border-border/50 flex flex-col hover:border-border transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-foreground/80 lowercase italic">família</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-foreground">{isAnnual ? "R$ 39,90" : "R$ 49,90"}</span>
              <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">/mês</span>
            </div>
            <ul className="space-y-5 mb-12 flex-1 text-sm">
              {["Até 5 membros", "Dashboard familiar completo", "Metas compartilhadas", "Todos os recursos Liberta+", "Agente de IA Lia 🤖", "Controle parental", "Suporte prioritário VIP"].map(item => (
                <li key={item} className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary opacity-60" /> <span className="text-muted-foreground">{item}</span></li>
              ))}
            </ul>
            <Link to="/register"><Button variant="outline" className="w-full h-14 rounded-2xl font-bold hover:bg-secondary transition-all">Assinar Família</Button></Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-border/50">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-5xl font-black mb-6 text-gradient uppercase tracking-tight">Quem usa, recomenda.</h2>
          <p className="text-muted-foreground text-lg">Junte-se a milhares de Brasileiros que já conquistaram a liberdade financeira com o Liberta.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { name: "Mariana Silva", role: "Empreendedora", content: "Finalmente algo que separa as minhas contas de casa das da PJ. O gráfico de Patrimônio me deu noção real de riqueza." },
            { name: "Carlos Eduardo", role: "Desenvolvedor", content: "Eu lançava gastos no Excel. Agora só converso com a Lia e ela cataloga tudo na nuvem sem esforço algum." },
            { name: "Juliana Santos", role: "Médica", content: "O sistema de Metas Visuais me ajudou a atingir minha reserva de emergência 3 meses antes do previsto. Incrível!" }
          ].map((t, i) => (
            <motion.div key={i} className="glass p-10 rounded-[2.5rem] relative group hover:border-primary/20 transition-all duration-500" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
              <div className="flex gap-1.5 text-yellow-500 mb-6">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}</div>
              <p className="italic text-base mb-8 leading-relaxed text-foreground/80">"{t.content}"</p>
              <div>
                <p className="font-extrabold text-lg text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 border-t border-border/50">
        <h2 className="text-4xl font-extrabold mb-12 text-center">Perguntas Frequentes</h2>
        <Accordion type="single" collapsible className="glass-strong p-8 rounded-[2.5rem] shadow-xl border-border/40">
          <AccordionItem value="1" className="border-border/50 py-2">
            <AccordionTrigger className="text-left font-bold text-lg hover:text-primary transition-colors">Meus dados bancários estão seguros?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pt-2">Sim. Utilizamos criptografia AES-256 de ponta a ponta. Nossa infraestrutura reside na AWS e no Google Cloud, com auditorias constantes. Seus dados são SEUS.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="2" className="border-border/50 py-2">
            <AccordionTrigger className="text-left font-bold text-lg hover:text-primary transition-colors">Como funciona a inteligência da Lia?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pt-2">A Lia utiliza modelos de linguagem avançados treinados em finanças brasileiras. Você pode registrar gastos, pedir análises de faturas e simular metas apenas conversando.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="3" className="border-transparent py-2">
            <AccordionTrigger className="text-left font-bold text-lg hover:text-primary transition-colors">Preciso colocar cartão para testar?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pt-2">Não. Experimente o Liberta+ completo por 7 dias sem qualquer compromisso. O cartão só é solicitado se você decidir continuar sua jornada conosco.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="glass-strong p-16 sm:p-24 rounded-[3.5rem] relative overflow-hidden shadow-glow">
          <div className="absolute inset-0 bg-primary/5 blur-[120px]" />
          <h2 className="text-3xl sm:text-6xl font-black mb-8 leading-tight">Chegou a hora de ser <br /><span className="text-gradient">Livre Financeiramente.</span></h2>
          <p className="text-muted-foreground text-xl mb-12 max-w-lg mx-auto">Sua jornada rumo ao controle absoluto começa com um simples passo.</p>
          <Link to="/register"><Button variant="hero" size="lg" className="px-16 py-10 text-2xl font-black shadow-glow hover:scale-105 transition-all rounded-3xl">Garanta seu Acesso Grátis</Button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-24 bg-background/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-16 text-sm mb-20">
          <div className="col-span-2 md:col-span-1">
            <img src={logoWhite} alt="Liberta" className="h-7 mb-8 hidden dark:block" />
            <img src={logoColor} alt="Liberta" className="h-7 mb-8 block dark:hidden" />
            <p className="text-muted-foreground leading-relaxed">O ecossistema definitivo para a sua evolução patrimonial e liberdade financeira.</p>
          </div>
          <div>
            <h4 className="font-black mb-6 uppercase text-xs tracking-[0.3em] text-primary">Produto</h4>
            <ul className="space-y-4 text-muted-foreground font-bold">
              <li><Link to="#recursos" className="hover:text-primary transition-colors">Funcionalidades</Link></li>
              <li><Link to="#planos" className="hover:text-primary transition-colors">Planos e Preços</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Entrar App</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 uppercase text-xs tracking-[0.3em] text-primary">Conexão</h4>
            <ul className="space-y-4 text-muted-foreground font-bold">
              <li><Link to="/" className="hover:text-primary transition-colors">Instagram</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">WhatsApp Suporte</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 uppercase text-xs tracking-[0.3em] text-primary">Jurídico</h4>
            <ul className="space-y-4 text-muted-foreground font-bold">
              <li>Termos de Uso</li>
              <li>Política de Privacidade</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-zinc-800/50 text-center">
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] mb-4">Feito com ❤️ no Brasil para o mundo</p>
          <p className="text-[10px] text-zinc-600">© 2026 Liberta Finanças LTDA. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
