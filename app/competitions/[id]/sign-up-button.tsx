"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SignUpButton({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  competitionId,
}: {
  competitionId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleSignUp() {
    setIsLoading(true);
    try {
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
      {isLoading ? "Signing up..." : "Sign Up"}
    </Button>
  );
}
