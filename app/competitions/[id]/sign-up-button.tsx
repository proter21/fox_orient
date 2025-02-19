"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/firebase/firebase";

interface SignUpButtonProps {
  competitionId: string;
  buttonText?: string;
}

export default function SignUpButton({
  competitionId,
  buttonText = "Sign Up",
}: SignUpButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleSignUp() {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      // Replace with your actual signup logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Success!",
        description: "You have been signed up for this competition.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to sign up for the competition.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button onClick={handleSignUp} disabled={isLoading}>
      {isLoading ? "Signing up..." : buttonText}
    </Button>
  );
}
