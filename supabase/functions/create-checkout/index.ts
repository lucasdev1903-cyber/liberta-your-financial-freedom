// supabase/functions/create-checkout/index.ts
// Deploy with: supabase functions deploy create-checkout --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.11.0?target=deno";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
            apiVersion: "2023-10-16",
        });

        const { priceId, userId, email, successUrl, cancelUrl } = await req.json();

        if (!priceId || !userId || !email) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Check if customer already exists
        const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const { data: existingSub } = await supabase
            .from("subscriptions")
            .select("stripe_customer_id")
            .eq("user_id", userId)
            .single();

        let customerId = existingSub?.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email,
                metadata: { supabase_user_id: userId },
            });
            customerId = customer.id;

            // Upsert subscription record
            await supabase.from("subscriptions").upsert({
                user_id: userId,
                stripe_customer_id: customerId,
                plan_id: "free",
                status: "inactive",
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: "subscription",
            success_url: successUrl || `${req.headers.get("origin")}/dashboard?checkout=success`,
            cancel_url: cancelUrl || `${req.headers.get("origin")}/dashboard/subscription?checkout=canceled`,
            subscription_data: {
                trial_period_days: 7,
                metadata: { supabase_user_id: userId },
            },
            metadata: { supabase_user_id: userId },
        });

        return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
