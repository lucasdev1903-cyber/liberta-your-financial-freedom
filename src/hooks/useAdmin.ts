import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

export function useAdmin() {
    const { user } = useAuth();
    const isAdmin = user?.user_metadata?.role === 'admin';

    // O RLS policy exige que o usuário chamador seja 'admin' lendo no banco, 
    // mas vamos ser proativos e só buscar se o metadata indicar que ele é admin

    const { data: usersData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['admin_users'],
        queryFn: async () => {
            // Nós pegamos os perfis 
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!user && isAdmin,
    });

    const { data: statsData, isLoading: isLoadingStats } = useQuery({
        queryKey: ['admin_stats'],
        queryFn: async () => {
            // Para o admin, vamos buscar algumas transações e estatísticas globais
            const { data: profiles, error: pErr } = await supabase.from('profiles').select('id');
            if (pErr) throw pErr;

            const { data: transactions, error: tErr } = await supabase.from('transactions').select('amount, type');
            if (tErr) throw tErr;

            const totalUsers = profiles.length;
            let totalMoneyHandled = 0;
            let totalIncome = 0;

            transactions?.forEach(t => {
                totalMoneyHandled += t.amount;
                if (t.type === 'income') totalIncome += t.amount;
            });

            return {
                totalUsers,
                totalMoneyHandled,
                totalIncome
            };
        },
        enabled: !!user && isAdmin,
    });

    return {
        isAdmin,
        users: usersData || [],
        stats: statsData || { totalUsers: 0, totalMoneyHandled: 0, totalIncome: 0 },
        isLoading: isLoadingUsers || isLoadingStats,
    };
}
