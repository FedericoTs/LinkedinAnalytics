import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "../../../supabase/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, CheckCircle, XCircle } from "lucide-react";

export default function LinkedInAuthHelper() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkAuthConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-check-auth-config",
      );

      if (error) throw error;
      setResult(data);
    } catch (err) {
      console.error("Error checking auth config:", err);
      setError(err.message || "Failed to check auth configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>LinkedIn Authentication Helper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>LinkedIn Authentication Troubleshooter</AlertTitle>
          <AlertDescription>
            This tool helps diagnose and fix issues with LinkedIn authentication
            redirects, especially for localhost development.
          </AlertDescription>
        </Alert>

        <Button onClick={checkAuthConfig} disabled={loading}>
          {loading ? "Checking..." : "Check Auth Configuration"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-4">
            <Alert variant="default" className="bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Configuration Retrieved</AlertTitle>
              <AlertDescription className="whitespace-pre-line">
                {result.message}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Current Configuration:</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(result.config, null, 2)}
                </pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Manual Steps Required:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  Go to your{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Supabase Dashboard
                  </a>
                </li>
                <li>Select your project</li>
                <li>Navigate to Authentication → URL Configuration</li>
                <li>
                  Add{" "}
                  <code className="bg-gray-100 px-1">
                    http://localhost:5173
                  </code>{" "}
                  to the Site URL (or your specific localhost port)
                </li>
                <li>
                  Add{" "}
                  <code className="bg-gray-100 px-1">
                    http://localhost:5173/auth/callback
                  </code>{" "}
                  to the Redirect URLs / URI allow list
                </li>
                <li>Save the changes</li>
                <li>
                  Also verify your LinkedIn Developer App has the same callback
                  URL configured
                </li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
