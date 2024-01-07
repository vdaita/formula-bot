"use client";

import { useUser } from "@/app/lib/auth";
import { ReactNode } from "react";
import AuthGuard from "@/app/components/AuthGuard";

export default function Layout({ children }: { children: ReactNode }) {
  const user = useUser();

  // if (user === false) return <>Auth loading...</>;
  // if (!user) return <AuthGuard />;
  return children;
}