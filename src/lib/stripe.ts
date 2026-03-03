import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51T1WgYBjXcAgzhEj7uqPpJGGzjNeTlyGcYy0Hc0hMKvcnamKDOhIldroytc4u1U9Yg4wQn9TRsqQl1YySgfpu3Az008eJKH700';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const PLANS = {
    monthly: {
        id: 'monthly',
        name: 'Plano Mensal',
        price: 21.90,
        interval: 'month' as const,
        stripePriceId: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || 'price_1T59XPBjXcAgzhEjydj6USGk',
    },
    annual: {
        id: 'annual',
        name: 'Plano Anual',
        price: 197.10,
        pricePerMonth: 16.43,
        interval: 'year' as const,
        stripePriceId: import.meta.env.VITE_STRIPE_PRICE_ANNUAL || 'price_1T6bAZBjXcAgzhEjw37fCaOZ',
        discount: '25%',
    },
};
