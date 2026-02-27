import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/liberta-logo-white.png";
import logoColor from "@/assets/logo_liberta_colorido.png";
import heroMockup from "@/assets/hero-mockup.png";
import { ArrowRight, Shield, TrendingUp, Bot, Smartphone, BarChart3, Target, Star, ChevronDown, CheckCircle2 } from "lucide-react";
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
    icon: BarChart3,
    title: "Dashboard Multi-Projetos",
    desc: "Use Tags e Centros de Custo para separar finanças Pessoais e da Empresa.",
  },
  {
    icon: Star,
    title: "Gestão Avançada de Cartões",
    desc: "Acompanhe faturas futuras e saiba o melhor dia para compra com controle de Limite.",
  },
  {
    icon: Bot,
    title: "IA Conselheira Integrada",
    desc: "Agente que analisa seus gastos e alerta sobre tendências antes do fim do mês.",
  },
  {
    icon: Target,
    title: "Engajamento e Metas",
    desc: "Desbloqueie conquistas e ofensivas (streaks) financeiras ao bater alvos de economia.",
  },
  {
    icon: Smartphone,
    title: "Lançamentos via WhatsApp",
    desc: "Mande um áudio no zap e nossa bot-inteligente categoriza a despesa sozinha.",
  },
  {
    icon: Shield,
    title: "Open Finance Ativo",
    desc: "Foque em viver. Nós puxamos seus extratos e nubank automaticamente.",
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
          Seu dinheiro sob o comando <br className="hidden md:block" />
          <span className="text-gradient">da Inteligência Artificial.</span>
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          Esqueça as planilhas. Gerencie cartões, conecte bancos via Open Finance e converse com seu Patrimônio em tempo real pelo WhatsApp.
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
          className="mt-20 relative mx-auto max-w-5xl px-4 sm:px-0"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
        >
          <div className="glass-strong rounded-[2rem] p-2 sm:p-4 shadow-2xl relative z-10 border-border/80">
            <div className="rounded-xl overflow-hidden relative">
              <img
                src={heroMockup}
                alt="Liberta Dashboard Preview"
                className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-700"
              />
              {/* Shiny reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none mix-blend-overlay" />
            </div>
          </div>
          {/* Intense Glow behind card */}
          <div className="absolute -inset-4 bg-gradient-primary opacity-20 rounded-[3rem] blur-3xl -z-10 animate-pulse-glow" />
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
          className="glass rounded-2xl p-8 sm:p-10 shadow-glow border-primary/20 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
        >
          {isAnnual && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
              Economia de R$ 72 no ano!
            </div>
          )}

          <div className="flex justify-center items-center gap-4 mb-8">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Mensal</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full bg-secondary border border-border/50 flex items-center px-1 transition-colors hover:bg-secondary/80 focus:outline-none"
            >
              <div className={`w-5 h-5 rounded-full bg-primary transition-transform duration-300 shadow-sm ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Anual <span className="text-primary text-xs ml-1 font-bold">(-27%)</span>
            </span>
          </div>

          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl font-extrabold text-gradient">{isAnnual ? "R$ 15,90" : "R$ 21,90"}</span>
            <span className="text-muted-foreground">/mês</span>
          </div>
          <p className="text-muted-foreground mb-8 text-sm">
            {isAnnual ? "Cobrado anualmente (R$ 190,80/ano)" : "Cobrado mensalmente. Cancele quando quiser."}
          </p>

          <ul className="text-left max-w-sm mx-auto space-y-3 mb-10">
            {[
              "Acesso Multi-Contas e Projetos",
              "Agente de IA e WhatsApp Integrados",
              "Gestor de Cartões e Limites",
              "Cálculo de Patrimônio Líquido Real",
              "Conexão Bancária (Open Finance)",
              "Exportação Fiscal (PDF/Excel)",
              "Modo Gamificação com Badges",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-3 h-3 text-primary" />
                </div>
                {item}
              </li>
            ))}
          </ul>

          <Link to="/register">
            <Button variant="hero" size="lg" className="w-full text-base py-6">
              Começar Teste Grátis de 4 Dias
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Social Proof */}
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
            Quem usa, <span className="text-gradient">recomenda.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Junte-se a milhares de Brasileiros que já alcançaram a sua liberdade financeira.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Mariana Silva",
              role: "Freelancer & Empreendedora",
              content: "Finalmente algo que separa as minhas contas de casa das da PJ. O gráfico de Patrimônio Líquido me deu noção real de riqueza.",
            },
            {
              name: "Carlos Eduardo",
              role: "Desenvolvedor de Software",
              content: "Eu lançava gastos no Excel. Agora só mando um áudio pro bot do WhatsApp saindo do restaurante e a IA cataloga tudo na nuvem.",
            },
            {
              name: "Juliana Santos",
              role: "Médica",
              content: "O sistema de Ofensivas acabou com o meu consumismo. Não perder meu 'streak' virou um jogo divertido, e minha reserva duplicou.",
            },
          ].map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              className="glass rounded-xl p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i + 1}
            >
              <div className="flex gap-1 mb-4 text-primary">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-foreground/90 italic mb-6">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
          <p className="text-muted-foreground text-lg">
            Tudo o que você precisa saber sobre o Liberta.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="glass rounded-xl p-2 sm:p-4"
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-border/50">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary transition-colors">Precisarei informar cartão de crédito no teste grátis?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Não! Os 4 dias de teste são totalmente gratuitos e você não precisa colocar nenhum dado de pagamento. Só cobramos se você decidir continuar usando o Liberta.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-border/50">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary transition-colors">Meus dados bancários estão seguros?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Sim. Utilizamos criptografia de ponta a ponta e conexão Open Finance regulamentada pelo Banco Central. Nós temos acesso APENAS de leitura aos seus extratos, nunca à sua senha ou movimentações.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-border/50">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary transition-colors">Como funciona o lançamento por WhatsApp?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Ao assinar, você recebe um número de WhatsApp exclusivo. Basta mandar um áudio "Gastei 50 reais no supermercado" e nossa IA categoriza e lança automaticamente no seu dashboard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-transparent">
              <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-primary transition-colors">Posso cancelar quando quiser?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Com certeza. Não há fidelidade. Você pode cancelar sua assinatura a qualquer momento com apenas 2 cliques dentro das configurações do aplicativo.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </section>

      {/* CTA final */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="glass-strong rounded-3xl p-10 sm:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-2xl" />
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 relative z-10">Pronto para assumir o controle?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto relative z-10">
            Sua liberdade financeira está a um clique de distância.
          </p>
          <Link to="/register" className="relative z-10">
            <Button variant="hero" size="lg" className="px-10 py-7 text-lg shadow-glow hover:scale-105 transition-transform duration-300">
              Criar minha conta grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 pt-16 pb-8 bg-background/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <img src={logoWhite} alt="Liberta" className="h-6 mb-4 hidden dark:block" />
            <img src={logoColor} alt="Liberta" className="h-6 mb-4 block dark:hidden" />
            <p className="text-sm text-muted-foreground">O ecossistema definitivo para a sua evolução financeira.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Produto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/#features" className="hover:text-primary transition-colors">Funcionalidades</Link></li>
              <li><Link to="/#pricing" className="hover:text-primary transition-colors">Preços</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Entrar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground border-t border-border/50 pt-8 max-w-7xl mx-auto px-6">
          <p>© 2026 Liberta. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
