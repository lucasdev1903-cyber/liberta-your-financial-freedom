import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export interface Subscription {
    id: string;
    user_id: string;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    plan_id: string;
    status: 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing';
    current_period_end: string | null;
    cancel_at_period_end: boolean;
}

export function useSubscription() {
    const { user } = useAuth();

    const query = useQuery({
        queryKey: ['subscription', user?.id],
        queryFn: async (): Promise<Subscription | null> => {
            if (!user) return null;
            const { data, error } = await (supabase.from('subscriptions') as any)
                .select('*')
                .eq('user_id', user.id)
                .single();
            if (error) return null;
            return data;
        },
        enabled: !!user,
        retry: false,
        staleTime: 1000 * 60 * 2,
    });

    const isPremium = query.data?.status === 'active' || query.data?.status === 'trialing';

    const createCheckout = async (priceId: string) => {
        const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: {
                priceId,
                userId: user?.id,
                email: user?.email,
                successUrl: `${window.location.origin}/dashboard?checkout=success`,
                cancelUrl: `${window.location.origin}/dashboard/subscription?checkout=canceled`,
            },
        });
        if (error) throw error;
        if (data?.url) {
            window.location.href = data.url;
        }
        return data;
    };

    return {
        subscription: query.data,
        isPremium,
        isLoading: query.isLoading,
        createCheckout,
    };
}
