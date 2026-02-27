import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/liberta-logo-white.png";
import { ArrowRight, Shield, TrendingUp, Bot, Smartphone, BarChart3, Target, Star, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
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
              role: "Empreendedora",
              content: "O Liberta mudou completamente como eu vejo meu dinheiro. A IA me ajudou a cortar gastos que eu nem percebia!",
            },
            {
              name: "Carlos Eduardo",
              role: "Desenvolvedor",
              content: "Interface incrível, super rápida. Finalmente um app de finanças que não parece ter sido feito nos anos 90.",
            },
            {
              name: "Juliana Santos",
              role: "Médica",
              content: "Atingi minha meta da reserva de emergência 3 meses antes do previsto graças ao acompanhamento visual das metas.",
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
            <img src={logoWhite} alt="Liberta" className="h-6 mb-4" />
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
