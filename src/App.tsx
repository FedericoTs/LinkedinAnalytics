import { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import AuthCallback from "./components/auth/AuthCallback";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import { useAuth } from "../supabase/auth";
import { Toaster } from "./components/ui/toaster";
import LinkedInAuthHelper from "./components/auth/LinkedInAuthHelper";
import RedirectHandler from "./components/auth/RedirectHandler";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  // For the tempo routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <>
      {tempoRoutes}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/success" element={<Success />} />
        <Route path="/auth-helper" element={<LinkedInAuthHelper />} />
        {/* Add this before the catchall route to ensure Tempo can access storyboards */}
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
        {/* Add a catch-all route for handling OAuth redirects */}
        <Route path="*" element={<RedirectHandler />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AppRoutes />
      <Toaster />
    </Suspense>
  );
}

export default App;
