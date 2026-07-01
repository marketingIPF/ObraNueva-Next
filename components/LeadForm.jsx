"use client";

import { useState } from "react";
import { submitLead } from "@/lib/actions/leads";

export default function LeadForm({ promoId, promoNombre }) {
  const [values, setValues] = useState({ nombre: "", telefono: "", email: "", privacidad: false });
  const [state, setState] = useState({ status: "idle", error: "" });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setState({ status: "loading", error: "" });
    const result = await submitLead({ promoId, ...values });
    if (result.ok) {
      setState({ status: "success", error: "" });
    } else {
      setState({ status: "idle", error: result.error });
    }
  }

  if (state.status === "success") {
    return (
      <div className="text-center py-6">
        <h3 className="font-black text-2xl text-ink mb-2">Ya estás en la lista.</h3>
        <p className="text-ink-soft">
          Te avisaremos por email antes que a nadie en cuanto se publiquen planos y precios de{" "}
          {promoNombre}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label htmlFor="nombre" className="block text-xs font-bold uppercase tracking-widest text-stone mb-1.5">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          className="w-full bg-paper border border-line focus:border-brand rounded-xl px-4 py-3 text-ink outline-none transition-colors"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label htmlFor="telefono" className="block text-xs font-bold uppercase tracking-widest text-stone mb-1.5">
          Teléfono
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          value={values.telefono}
          onChange={handleChange}
          className="w-full bg-paper border border-line focus:border-brand rounded-xl px-4 py-3 text-ink outline-none transition-colors"
          placeholder="Tu teléfono"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-stone mb-1.5">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          className="w-full bg-paper border border-line focus:border-brand rounded-xl px-4 py-3 text-ink outline-none transition-colors"
          placeholder="tu@email.com"
        />
      </div>
      <label className="flex items-start gap-3 text-xs text-ink-soft mt-1 cursor-pointer">
        <input
          type="checkbox"
          name="privacidad"
          checked={values.privacidad}
          onChange={handleChange}
          className="mt-0.5 accent-brand"
        />
        <span>
          He leído y acepto la <a href="#" className="underline">Política de Privacidad</a>
        </span>
      </label>

      {state.error && <p className="text-brand-dark text-sm font-medium">{state.error}</p>}

      <button
        type="submit"
        disabled={state.status === "loading"}
        className="mt-2 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-bold text-sm px-8 py-4 rounded-full transition-colors"
      >
        {state.status === "loading" ? "Enviando…" : "Quiero apuntarme"}
      </button>
    </form>
  );
}
