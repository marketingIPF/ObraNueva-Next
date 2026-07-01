"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [state, setState] = useState({ loading: false, error: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setState({ loading: true, error: "" });
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), values.email, values.password);
      router.replace("/admin");
    } catch {
      setState({ loading: false, error: "Correo o contraseña incorrectos." });
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-[28px] p-8 sm:p-10 shadow-[0_20px_60px_-25px_rgba(21,19,15,0.35)]">
        <p className="text-brand text-xs font-bold uppercase tracking-[0.22em] mb-2">
          Panel RK Palanca
        </p>
        <h1 className="font-black text-2xl text-ink mb-7">Acceso al equipo</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-stone mb-1.5">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              className="w-full bg-paper border border-line focus:border-brand rounded-xl px-4 py-3 text-ink outline-none transition-colors"
              placeholder="tu@rkpalanca.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-stone mb-1.5">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={values.password}
              onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
              className="w-full bg-paper border border-line focus:border-brand rounded-xl px-4 py-3 text-ink outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {state.error && <p className="text-brand-dark text-sm font-medium">{state.error}</p>}

          <button
            type="submit"
            disabled={state.loading}
            className="mt-2 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-bold text-sm px-8 py-4 rounded-full transition-colors"
          >
            {state.loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
