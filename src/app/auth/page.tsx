'use client';

import { Container, Button, Heading, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebase from "../lib/firebase";

export default function Auth() {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const auth = getAuth();

    // Check if the user is already authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/user"); // Redirect to dashboard if already authenticated
      }
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in:", user);
      router.push("/dashboard"); // Redirect to dashboard after successful sign-in

      // Show success notification
      toast({
        title: "Login Successful",
        description: "You have successfully signed in with Google.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
      // Handle error

      // Show error notification
      toast({
        title: "Error",
        description: "There was an error signing in. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container>
      <Heading>Login to FormulaAssist</Heading>
      <Button onClick={signInWithGoogle}>Sign in with Google</Button>
    </Container>
  );
}
