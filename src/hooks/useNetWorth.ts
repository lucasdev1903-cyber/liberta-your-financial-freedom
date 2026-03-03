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
                let currentPrice = 1; // Default multiplier for normal assets (BRL)

                try {
                    if (asset.type === 'crypto') {
                        // Extract ticker (e.g., "BTC" from "Bitcoin (BTC)" or just "BTC")
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
                        // For stocks (B3 mock/proxy), we would use Brapi or Yahoo Finance
                        // Example using a free public endpoint or fallback if not found
                        // Here we simulate a price for demonstration since free stock APIs without auth are rare
                        currentPrice = 25.50; // Mock price for stocks
                    }
                } catch (e) {
                    console.error("Failed to fetch price for", asset.name, e);
                }

                return {
                    ...asset,
                    currentPrice,
                    totalValue: asset.type === 'crypto' || asset.type === 'stock' ? asset.value * currentPrice : asset.value
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

    const totalAssets = assetsQuery.data?.reduce((sum, a) => sum + Number(a.totalValue || a.value), 0) || 0;
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
