import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";
import { useAuth } from "../../../supabase/auth";

export default function LinkedInButton() {
  const { signInWithLinkedIn } = useAuth();

  const handleLinkedInSignIn = async () => {
    try {
      await signInWithLinkedIn();
    } catch (error) {
      console.error("LinkedIn sign in error:", error);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full flex items-center gap-2"
      onClick={handleLinkedInSignIn}
    >
      <Linkedin className="h-4 w-4" />
      Sign in with LinkedIn
    </Button>
  );
}
