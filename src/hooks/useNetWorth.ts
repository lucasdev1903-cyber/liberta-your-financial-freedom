import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export interface Asset {
    id: string;
    name: string;
    type: 'cash' | 'investment' | 'property' | 'vehicle' | 'other';
    value: number;
}

export interface Liability {
    id: string;
    name: string;
    type: 'credit_card' | 'loan' | 'mortgage' | 'other';
    value: number;
}

export function useNetWorth() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const assetsQuery = useQuery({
        queryKey: ['assets', user?.id],
        queryFn: async (): Promise<Asset[]> => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('assets')
                .select('*')
                .eq('user_id', user.id);
            if (error) return [];
            return data || [];
        },
        enabled: !!user,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const liabilitiesQuery = useQuery({
        queryKey: ['liabilities', user?.id],
        queryFn: async (): Promise<Liability[]> => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('liabilities')
                .select('*')
                .eq('user_id', user.id);
            if (error) return [];
            return data || [];
        },
        enabled: !!user,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const addAsset = useMutation({
        mutationFn: async (asset: Omit<Asset, 'id'>) => {
            const { data, error } = await (supabase
                .from('assets') as any)
                .insert({ ...asset, user_id: user?.id })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
    });

    const addLiability = useMutation({
        mutationFn: async (liability: Omit<Liability, 'id'>) => {
            const { data, error } = await (supabase
                .from('liabilities') as any)
                .insert({ ...liability, user_id: user?.id })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['liabilities'] }),
    });

    const totalAssets = assetsQuery.data?.reduce((sum, a) => sum + Number(a.value), 0) || 0;
    const totalLiabilities = liabilitiesQuery.data?.reduce((sum, l) => sum + Number(l.value), 0) || 0;
    const netWorth = totalAssets - totalLiabilities;

    return {
        assets: assetsQuery.data || [],
        liabilities: liabilitiesQuery.data || [],
        totalAssets,
        totalLiabilities,
        netWorth,
        isLoading: assetsQuery.isLoading || liabilitiesQuery.isLoading,
        addAsset,
        addLiability,
    };
}
