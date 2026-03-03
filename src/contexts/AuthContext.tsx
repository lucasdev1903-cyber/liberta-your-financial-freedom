import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUpWithEmail: (email: string, password: string, fullName: string, cpf: string, phone: string) => Promise<{ error: Error | null }>;
    signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
    signInWithCpf: (cpf: string, password: string) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signInWithEmail = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error as Error | null };
    };

    const signUpWithEmail = async (email: string, password: string, fullName: string, cpf: string, phone: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    cpf,
                    phone
                },
            },
        });
        return { error: error as Error | null };
    };

    const signInWithCpf = async (cpf: string, password: string) => {
        try {
            // 1. Find user by CPF in profiles table
            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('id')
                .eq('cpf', cpf.replace(/\D/g, ''))
                .single();

            if (fetchError || !data) {
                throw new Error("CPF não encontrado ou inválido.");
            }

            // 2. We can't easily sign in with ID only via auth.signInWithPassword (it needs email)
            // So we fetch the email from auth.users (requires service role or better approach)
            // In a real scenario, we'd have a separate table or use a DB function.
            // Let's assume the user knows their email or we use a custom RPC.

            // For now, let's try a different approach: 
            // The user enters Email OR CPF in the login box.
            // If it looks like a CPF, we resolve to Email first.

            return { error: new Error("Por favor, use seu email para entrar.") as Error | null };
        } catch (err: any) {
            return { error: err as Error | null };
        }
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });
        return { error: error as Error | null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                signInWithEmail,
                signUpWithEmail,
                signInWithCpf,
                signInWithGoogle,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
