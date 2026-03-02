import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const PLANS = {
    monthly: {
        id: 'monthly',
        name: 'Plano Mensal',
        price: 21.90,
        interval: 'month' as const,
        stripePriceId: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || 'price_monthly_placeholder',
    },
    annual: {
        id: 'annual',
        name: 'Plano Anual',
        price: 197.10,
        pricePerMonth: 16.43,
        interval: 'year' as const,
        stripePriceId: import.meta.env.VITE_STRIPE_PRICE_ANNUAL || 'price_annual_placeholder',
        discount: '25%',
    },
};
