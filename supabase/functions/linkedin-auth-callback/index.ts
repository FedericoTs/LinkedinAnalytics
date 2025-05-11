import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get the code and state from the request URL
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      throw new Error("Missing code or state parameter");
    }

    // Log the received parameters for debugging
    console.log("Received code and state:", { code, state });

    // Exchange the code for a token using Supabase's API
    const { data, error } =
      await supabaseClient.auth.exchangeCodeForSession(code);

    if (error) {
      throw error;
    }

    // Redirect to the dashboard with the session
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: `${url.origin}/dashboard`,
        "Set-Cookie": `supabase-auth-token=${data.session?.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
      },
    });
  } catch (error) {
    console.error("Error in LinkedIn callback:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
