"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import AdminNav from "@/components/admin/AdminNav";

/**
 * Client-side gate + chrome for everything under /admin. The real security
 * boundary is server-side (Server Actions verify the Firebase ID token
 * before any write, and Firestore denies client writes outright) — this
 * guard is about user experience: don't show admin screens, or the nav/
 * logout button, to someone who isn't signed in.
 */
export default function AuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState({ checked: false, user: null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      setState({ checked: true, user });
      if (!user && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    });
    return unsubscribe;
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return children;
  }

  if (!state.checked) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <p className="text-ink-soft text-sm">Comprobando sesión…</p>
      </div>
    );
  }

  if (!state.user) {
    return null; // redirect in flight
  }

  return (
    <div className="min-h-screen bg-paper">
      <AdminNav />
      {children}
    </div>
  );
}
