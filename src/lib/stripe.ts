import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const PLANS = {
    monthly: {
        id: 'monthly',
        name: 'Plano Mensal',
        price: 21.90,
        interval: 'month' as const,
        stripePriceId: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || '',
    },
    annual: {
        id: 'annual',
        name: 'Plano Anual',
        price: 197.10,
        pricePerMonth: 16.43,
        interval: 'year' as const,
        stripePriceId: import.meta.env.VITE_STRIPE_PRICE_ANNUAL || '',
        discount: '25%',
    },
};
