import * as React from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Define as a named function declaration instead of an arrow function
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Convert to regular functions returning promises
  function signUp(email: string, password: string, fullName: string) {
    return supabase.auth
      .signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      .then(({ error }) => {
        if (error) throw error;
      });
  }

  function signIn(email: string, password: string) {
    return supabase.auth
      .signInWithPassword({
        email,
        password,
      })
      .then(({ error }) => {
        if (error) throw error;
      });
  }

  async function signInWithLinkedIn() {
    // Use Supabase's official OAuth method
    const redirectTo = `${window.location.origin}/dashboard`;
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (error) {
      console.error("LinkedIn OAuth error:", error);
      throw error;
    }
  }

  function signOut() {
    return supabase.auth.signOut().then(({ error }) => {
      if (error) throw error;
    });
  }

  // Create the context value object
  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithLinkedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Define as a named function declaration
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
