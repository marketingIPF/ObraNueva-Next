"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await signOut(getFirebaseAuth());
        router.replace("/admin/login");
      }}
      className="text-sm font-semibold text-ink-soft hover:text-ink transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
