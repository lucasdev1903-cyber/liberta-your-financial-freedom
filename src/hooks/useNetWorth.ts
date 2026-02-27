import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import type {
    Asset, AssetInsert, AssetUpdate,
    Liability, LiabilityInsert, LiabilityUpdate,
    NetWorthHistory
} from '@/lib/database.types';

export function useNetWorth() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Assets Query
    const assetsQuery = useQuery({
        queryKey: ['assets', user?.id],
        queryFn: async (): Promise<Asset[]> => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('assets')
                .select('*')
                .eq('user_id', user.id)
                .order('name');
            if (error) throw error;
            return (data as unknown as Asset[]) || [];
        },
        enabled: !!user,
    });

    // Liabilities Query
    const liabilitiesQuery = useQuery({
        queryKey: ['liabilities', user?.id],
        queryFn: async (): Promise<Liability[]> => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('liabilities')
                .select('*')
                .eq('user_id', user.id)
                .order('name');
            if (error) throw error;
            return (data as unknown as Liability[]) || [];
        },
        enabled: !!user,
    });

    // History Query
    const historyQuery = useQuery({
        queryKey: ['net-worth-history', user?.id],
        queryFn: async (): Promise<NetWorthHistory[]> => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('net_worth_history')
                .select('*')
                .eq('user_id', user.id)
                .order('snapshot_date', { ascending: true });
            if (error) throw error;
            return (data as unknown as NetWorthHistory[]) || [];
        },
        enabled: !!user,
    });

    // Aggregated Totals
    const totalAssets = assetsQuery.data?.reduce((sum, a) => sum + Number(a.value), 0) || 0;
    const totalLiabilities = liabilitiesQuery.data?.reduce((sum, l) => sum + Number(l.value), 0) || 0;
    const netWorth = totalAssets - totalLiabilities;

    // Mutators
    const addAsset = useMutation({
        mutationFn: async (asset: Omit<AssetInsert, 'user_id'>) => {
            if (!user) throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('assets')
                .insert({ ...asset, user_id: user.id } as any)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            createHistorySnapshot();
        },
    });

    const updateAsset = useMutation({
        mutationFn: async ({ id, ...updates }: AssetUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('assets')
                .update(updates as any)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            createHistorySnapshot();
        },
    });

    const deleteAsset = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('assets').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets'] });
            createHistorySnapshot();
        },
    });

    const addLiability = useMutation({
        mutationFn: async (liability: Omit<LiabilityInsert, 'user_id'>) => {
            if (!user) throw new Error('Not authenticated');
            const { data, error } = await supabase
                .from('liabilities')
                .insert({ ...liability, user_id: user.id } as any)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['liabilities'] });
            createHistorySnapshot();
        },
    });

    const updateLiability = useMutation({
        mutationFn: async ({ id, ...updates }: LiabilityUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('liabilities')
                .update(updates as any)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['liabilities'] });
            createHistorySnapshot();
        },
    });

    const deleteLiability = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('liabilities').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['liabilities'] });
            createHistorySnapshot();
        },
    });

    // Function to create a snapshot after changes - simplified for now
    const createHistorySnapshot = async () => {
        if (!user) return;

        // We'll calculate the snapshot based on current totals
        // In a real app, this might be better handled by a database trigger
        const { error } = await supabase.from('net_worth_history').insert({
            user_id: user.id,
            total_assets: totalAssets,
            total_liabilities: totalLiabilities,
            net_worth: netWorth,
            snapshot_date: new Date().toISOString().split('T')[0]
        } as any);

        if (!error) {
            queryClient.invalidateQueries({ queryKey: ['net-worth-history'] });
        }
    };

    return {
        assets: assetsQuery.data || [],
        liabilities: liabilitiesQuery.data || [],
        history: historyQuery.data || [],
        totalAssets,
        totalLiabilities,
        netWorth,
        isLoading: assetsQuery.isLoading || liabilitiesQuery.isLoading || historyQuery.isLoading,
        addAsset,
        updateAsset,
        deleteAsset,
        addLiability,
        updateLiability,
        deleteLiability
    };
}
