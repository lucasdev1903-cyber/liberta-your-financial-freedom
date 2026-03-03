// supabase/functions/pluggy-connect/index.ts
// Deploy: supabase functions deploy pluggy-connect --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLUGGY_API = "https://api.pluggy.ai";

async function getPluggyToken(): Promise<string> {
    const res = await fetch(`${PLUGGY_API}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            clientId: Deno.env.get("PLUGGY_CLIENT_ID"),
            clientSecret: Deno.env.get("PLUGGY_CLIENT_SECRET"),
        }),
    });
    const data = await res.json();
    if (!data.apiKey) throw new Error("Failed to get Pluggy API key");
    return data.apiKey;
}

serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { action, itemId, userId } = await req.json();
        const apiKey = await getPluggyToken();

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // Create a connect token for the widget
        if (action === "create-token") {
            const res = await fetch(`${PLUGGY_API}/connect_token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-KEY": apiKey,
                },
                body: JSON.stringify({ clientUserId: userId }),
            });
            const data = await res.json();
            return new Response(JSON.stringify({ connectToken: data.accessToken }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Fetch accounts from a connected item
        if (action === "get-accounts" && itemId) {
            const res = await fetch(`${PLUGGY_API}/accounts?itemId=${itemId}`, {
                headers: { "X-API-KEY": apiKey },
            });
            const data = await res.json();

            // Save accounts to bank_connections
            for (const account of data.results || []) {
                await supabase.from("bank_connections").upsert({
                    user_id: userId,
                    bank_name: account.bankData?.transferNumber ? account.name : account.name,
                    bank_code: account.bankData?.compe || "",
                    account_type: account.type === "CREDIT" ? "credit" : account.subtype === "SAVINGS_ACCOUNT" ? "savings" : "checking",
                    last_four: account.number?.slice(-4) || "",
                    balance: account.balance || 0,
                    status: "connected",
                    last_synced_at: new Date().toISOString(),
                }, { onConflict: "user_id,bank_code" });
            }

            return new Response(JSON.stringify({ accounts: data.results }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Fetch transactions from a connected item
        if (action === "get-transactions" && itemId) {
            const res = await fetch(`${PLUGGY_API}/transactions?itemId=${itemId}&pageSize=500`, {
                headers: { "X-API-KEY": apiKey },
            });
            const data = await res.json();

            // Save transactions
            const rows = (data.results || []).map((t: any) => ({
                user_id: userId,
                description: t.description || t.descriptionRaw || "Transação",
                amount: Math.abs(t.amount),
                type: t.amount >= 0 ? "income" : "expense",
                category: t.category || "Outros",
                date: t.date?.split("T")[0] || new Date().toISOString().split("T")[0],
            }));

            if (rows.length > 0) {
                await supabase.from("transactions").insert(rows);
            }

            return new Response(JSON.stringify({ imported: rows.length }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ error: "Unknown action" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
