import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    // Get the redirect URI from the request or use a default
    const url = new URL(req.url);
    const redirectUri =
      url.searchParams.get("redirect_uri") || `${url.origin}/dashboard`;

    // Generate a random state for CSRF protection
    const state = crypto.randomUUID();

    // Create the authorization URL
    const authUrl = new URL(
      "https://api.picaos.com/v1/passthrough/oauth/authorize",
    );
    authUrl.searchParams.set(
      "client_id",
      Deno.env.get("SUPABASE_LINKEDIN_CLIENT_ID") || "",
    );
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", "r_liteprofile r_emailaddress");
    authUrl.searchParams.set("state", state);

    // Make the request to the Pica passthrough endpoint
    const response = await fetch(authUrl.toString(), {
      method: "GET",
      headers: {
        "x-pica-secret": Deno.env.get("PICA_SECRET_KEY") || "",
        "x-pica-connection-key":
          Deno.env.get("PICA_SUPABASE_CONNECTION_KEY") || "",
        "x-pica-action-id": "conn_mod_def::GC40UNCCy40::InD2wblFRaiRdaOCBwbVZQ",
      },
    });

    if (response.status === 303) {
      // Get the LinkedIn authorization URL from the Location header
      const linkedInAuthUrl = response.headers.get("Location");
      if (!linkedInAuthUrl) {
        throw new Error("No LinkedIn authorization URL returned");
      }

      // Return the LinkedIn authorization URL to the client
      return new Response(JSON.stringify({ url: linkedInAuthUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // Handle error response
      const errorData = await response.json();
      console.error("OAuth authorization error:", errorData);
      return new Response(
        JSON.stringify({
          error: "Failed to get LinkedIn authorization URL",
          details: errorData,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }
  } catch (error) {
    console.error("Error in LinkedIn auth function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
