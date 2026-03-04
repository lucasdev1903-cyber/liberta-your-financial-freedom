import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logoWhite from '@/assets/liberta-logo-white.png';
import logoColor from '@/assets/logo_liberta_colorido.png';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Smartphone, Fingerprint } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { signUpWithEmail, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: 'Senhas não conferem',
                description: 'A senha e a confirmação devem ser iguais.',
                variant: 'destructive',
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: 'Senha muito curta',
                description: 'A senha deve ter pelo menos 6 caracteres.',
                variant: 'destructive',
            });
            return;
        }

        if (cpf.length < 11) {
            toast({
                title: 'CPF inválido',
                description: 'Por favor, insira um CPF válido.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        const cleanCpf = cpf.replace(/\D/g, '');

        // 1. Check if Email already exists in profiles
        const { data: emailData, error: emailCheckError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (emailCheckError) {
            console.error('Email check error:', emailCheckError);
        }

        if (emailData) {
            toast({
                title: 'E-mail já cadastrado',
                description: 'Este e-mail já está sendo utilizado por outra conta.',
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }

        // 2. Check if CPF already exists in profiles
        const { data: cpfData, error: cpfCheckError } = await supabase
            .from('profiles')
            .select('id')
            .eq('cpf', cleanCpf)
            .maybeSingle();

        if (cpfCheckError) {
            console.error('CPF check error:', cpfCheckError);
        }

        if (cpfData) {
            toast({
                title: 'CPF já cadastrado',
                description: 'Este CPF já está sendo utilizado por outra conta.',
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }

        const { error } = await signUpWithEmail(email, password, fullName, cleanCpf, phone);

        if (error) {
            toast({
                title: 'Erro ao criar conta',
                description: error.message,
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Conta criada com sucesso! 🎉',
                description: 'Verifique seu email para confirmar a conta ou faça login.',
            });
            navigate('/login');
        }

        setIsLoading(false);
    };

    const handleGoogleRegister = async () => {
        const { error } = await signInWithGoogle();
        if (error) {
            toast({
                title: 'Erro ao cadastrar com Google',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background glow */}
            <div className="fixed inset-0 bg-glow pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse-glow" />

            <motion.div
                className="relative z-10 w-full max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                {/* Logo */}
                <Link to="/" className="flex justify-center mb-8">
                    <img src={logoWhite} alt="Liberta" className="h-8 hidden dark:block" />
                    <img src={logoColor} alt="Liberta" className="h-8 block dark:hidden" />
                </Link>

                {/* Card */}
                <div className="glass rounded-2xl p-8 shadow-glow">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">Crie sua conta</h1>
                        <p className="text-muted-foreground text-sm">
                            Teste grátis por 7 dias — requer cartão de crédito
                        </p>
                    </div>

                    {/* Google Button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full py-5 mb-6 border-border/60 hover:bg-secondary/50 transition-all"
                        onClick={handleGoogleRegister}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Cadastrar com Google
                    </Button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-border/50" />
                        <span className="text-xs text-muted-foreground">ou cadastre com email</span>
                        <div className="flex-1 h-px bg-border/50" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm text-muted-foreground">
                                Nome completo
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Seu nome"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="pl-10 py-5 bg-secondary/30 border-border/50 focus:border-primary/50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cpf" className="text-sm text-muted-foreground">
                                    CPF
                                </Label>
                                <div className="relative">
                                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="cpf"
                                        type="text"
                                        placeholder="000.000.000-00"
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                        className="pl-10 py-5 bg-secondary/30 border-border/50 focus:border-primary/50"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm text-muted-foreground">
                                    Telefone
                                </Label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-10 py-5 bg-secondary/30 border-border/50 focus:border-primary/50"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm text-muted-foreground">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 py-5 bg-secondary/30 border-border/50 focus:border-primary/50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm text-muted-foreground">
                                Senha
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 py-5 bg-secondary/30 border-border/50 focus:border-primary/50"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">
                                Confirmar senha
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Repita a senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 py-5 bg-secondary/30 border-border/50 focus:border-primary/50"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="hero"
                            className="w-full py-5 mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Criar Conta <ArrowRight className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer link */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Já tem conta?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Entrar
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
