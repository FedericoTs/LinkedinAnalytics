import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Check for hash parameters (common in OAuth redirects)
      if (location.hash) {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const errorCode = hashParams.get("error_code");
        const errorDescription = hashParams.get("error_description");

        if (errorCode) {
          setError(errorDescription || "Authentication failed");
          return;
        }

        if (accessToken && refreshToken) {
          try {
            // Set the session manually
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) throw error;
            navigate("/dashboard");
            return;
          } catch (err) {
            console.error("Error setting session:", err);
            setError("Failed to set session");
            return;
          }
        }
      }

      // Handle code exchange flow
      const code = searchParams.get("code");
      const next = searchParams.get("next") ?? "/dashboard";

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setError(error.message);
            return;
          }
          navigate(next);
        } catch (err) {
          console.error("Error exchanging code for session:", err);
          setError("Failed to authenticate");
        }
      } else if (!location.hash) {
        setError("No authentication code or token provided");
      }
    };

    handleCallback();
  }, [searchParams, navigate, location.hash]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Authenticating...</h2>
        <p className="text-gray-500">
          Please wait while we complete your sign-in.
        </p>
      </div>
    </div>
  );
}
