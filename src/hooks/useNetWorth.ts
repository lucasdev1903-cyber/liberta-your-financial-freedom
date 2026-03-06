import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export interface Asset {
    id: string;
    name: string;
    type: 'cash' | 'investment' | 'property' | 'vehicle' | 'crypto' | 'stock' | 'other';
    value: number; // Value acts as Quantity for crypto/stock
    currentPrice?: number; // Fetched live price
    totalValue?: number; // quantity * currentPrice
}

export interface Liability {
    id: string;
    name: string;
    type: 'credit_card' | 'loan' | 'mortgage' | 'other';
    value: number;
}

export interface NetWorthHistory {
    id: string;
    total_assets: number;
    total_liabilities: number;
    net_worth: number;
    snapshot_date: string;
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
            if (error || !data) return [];

            // Enrich crypto assets with live prices using AwesomeAPI (BTC, ETH, etc)
            const enrichedData = await Promise.all(data.map(async (asset: Asset) => {
                let currentPrice = 1;

                try {
                    if (asset.type === 'crypto') {
                        const tickerMatch = asset.name.match(/\(([^)]+)\)/) || [null, asset.name.trim().toUpperCase()];
                        const ticker = tickerMatch[1].toUpperCase();

                        const res = await fetch(`https://economia.awesomeapi.com.br/json/last/${ticker}-BRL`);
                        if (res.ok) {
                            const json = await res.json();
                            const key = `${ticker}BRL`;
                            if (json[key]) {
                                currentPrice = parseFloat(json[key].ask);
                            }
                        }
                    } else if (asset.type === 'stock') {
                        currentPrice = 25.50; // Mock price
                    }
                } catch (e) {
                    console.error("Failed to fetch price for", asset.name, e);
                }

                return {
                    ...asset,
                    currentPrice,
                    totalValue: (asset.type === 'crypto' || asset.type === 'stock') ? asset.value * currentPrice : asset.value
                };
            }));

            return enrichedData;
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

    const historyQuery = useQuery({
        queryKey: ['net_worth_history', user?.id],
        queryFn: async (): Promise<NetWorthHistory[]> => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('net_worth_history')
                .select('*')
                .eq('user_id', user.id)
                .order('snapshot_date', { ascending: true });

            if (error) return [];
            return data || [];
        },
        enabled: !!user,
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

    const deleteAsset = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('assets')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }),
    });

    const deleteLiability = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('liabilities')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['liabilities'] }),
    });

    const totalAssets = assetsQuery.data?.reduce((sum, a) => sum + Number(a.totalValue || a.value), 0) || 0;
    const totalLiabilities = liabilitiesQuery.data?.reduce((sum, l) => sum + Number(l.value), 0) || 0;
    const netWorth = totalAssets - totalLiabilities;

    const saveSnapshot = useMutation({
        mutationFn: async () => {
            const { data, error } = await supabase
                .from('net_worth_history')
                .insert({
                    user_id: user?.id,
                    total_assets: totalAssets,
                    total_liabilities: totalLiabilities,
                    net_worth: netWorth,
                    snapshot_date: new Date().toISOString().split('T')[0]
                })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['net_worth_history'] }),
    });

    return {
        assets: assetsQuery.data || [],
        liabilities: liabilitiesQuery.data || [],
        history: historyQuery.data || [],
        totalAssets,
        totalLiabilities,
        netWorth,
        isLoading: assetsQuery.isLoading || liabilitiesQuery.isLoading || historyQuery.isLoading,
        addAsset,
        addLiability,
        deleteAsset,
        deleteLiability,
        saveSnapshot
    };
}
