import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";

export default function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a hash in the URL (common for OAuth redirects)
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const errorCode = params.get("error_code");
      const errorDescription = params.get("error_description");

      if (errorCode) {
        console.error("Authentication error:", errorDescription);
        navigate(
          "/login?error=" +
            encodeURIComponent(errorDescription || "Authentication failed"),
        );
        return;
      }

      if (accessToken && refreshToken) {
        // Set the session manually
        supabase.auth
          .setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          .then(({ error }) => {
            if (error) {
              console.error("Error setting session:", error);
              navigate(
                "/login?error=" + encodeURIComponent("Failed to set session"),
              );
            } else {
              // Redirect to dashboard on success
              navigate("/dashboard");
            }
          });
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Processing Authentication...
        </h2>
        <p className="text-gray-500">
          Please wait while we complete your sign-in.
        </p>
      </div>
    </div>
  );
}
