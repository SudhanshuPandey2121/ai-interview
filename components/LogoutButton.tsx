"use client";

import { Button } from "./ui/button";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // Sign out from Firebase client
      await firebaseSignOut(auth);
      
      // Clear server session
      await signOut();
      
      // Redirect to sign-in page
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant="outline" 
      className="btn-secondary"
      disabled={isLoading}
    >
      {isLoading ? "Signing out..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;