// supabase/functions/stripe-webhook/index.ts
// Deploy with: supabase functions deploy stripe-webhook --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.11.0?target=deno";

serve(async (req: Request) => {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
        apiVersion: "2023-10-16",
    });

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
    } catch (err) {
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const handleSubscriptionUpdate = async (subscription: Stripe.Subscription) => {
        const userId = subscription.metadata?.supabase_user_id;
        if (!userId) return;

        const priceId = subscription.items.data[0]?.price?.id;

        await supabase.from("subscriptions").upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            plan_id: priceId || "premium",
            status: subscription.status === "active" || subscription.status === "trialing" ? subscription.status : subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
    };

    switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
            await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
            break;

        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            if (session.subscription) {
                const sub = await stripe.subscriptions.retrieve(session.subscription as string);
                await handleSubscriptionUpdate(sub);
            }
            break;
        }
    }

    return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
});
