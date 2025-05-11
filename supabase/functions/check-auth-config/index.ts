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
    // Get the Supabase project reference from the request or environment
    const projectRef = Deno.env.get("SUPABASE_PROJECT_ID") || "";

    if (!projectRef) {
      throw new Error("Missing Supabase project reference");
    }

    // Fetch the current auth configuration
    const response = await fetch(
      `https://api.picaos.com/v1/passthrough/projects/${projectRef}/config/auth`,
      {
        method: "GET",
        headers: {
          "x-pica-secret": Deno.env.get("PICA_SECRET_KEY") || "",
          "x-pica-connection-key":
            Deno.env.get("PICA_SUPABASE_CONNECTION_KEY") || "",
          "x-pica-action-id":
            "conn_mod_def::GC40TM5gJ7A::_NENqM6aTkOuGqUV-fHWbg",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch auth config: ${response.statusText}`);
    }

    const authConfig = await response.json();

    // Return the auth configuration
    return new Response(
      JSON.stringify({
        success: true,
        config: {
          site_url: authConfig.site_url,
          uri_allow_list: authConfig.uri_allow_list,
          linkedin_enabled: authConfig.external_linkedin_oidc_enabled,
          linkedin_client_id: authConfig.external_linkedin_oidc_client_id
            ? "[REDACTED]"
            : null,
          linkedin_secret: authConfig.external_linkedin_oidc_secret
            ? "[REDACTED]"
            : null,
        },
        message:
          "To fix localhost redirect issues, ensure your Supabase project has the following settings:\n" +
          "1. Add 'http://localhost:5173' to the Site URL\n" +
          "2. Add 'http://localhost:5173/auth/callback' to the URI allow list\n" +
          "3. Verify LinkedIn app settings have the same callback URL",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error checking auth config:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: "Failed to check auth configuration",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
