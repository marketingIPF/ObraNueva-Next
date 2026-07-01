"use client";

import { useState, useTransition } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { updateEstadoVivienda } from "@/lib/actions/viviendas";
import StatusBadge from "@/components/ui/StatusBadge";

const ESTADOS = ["disponible", "reservada", "vendida"];

export default function ViviendaTable({ promoId, initialViviendas }) {
  const [viviendas, setViviendas] = useState(initialViviendas);
  const [rowState, setRowState] = useState({}); // { [id]: 'saving' | 'error' }
  const [isPending, startTransition] = useTransition();

  function handleChange(vivienda, nuevoEstado) {
    if (nuevoEstado === vivienda.estado) return;

    const prevEstado = vivienda.estado;
    // Optimistic update — feels instant, rolled back on failure.
    setViviendas((prev) =>
      prev.map((v) => (v.id === vivienda.id ? { ...v, estado: nuevoEstado } : v))
    );
    setRowState((prev) => ({ ...prev, [vivienda.id]: "saving" }));

    startTransition(async () => {
      try {
        const idToken = await getFirebaseAuth().currentUser?.getIdToken();
        if (!idToken) throw new Error("no-session");

        const result = await updateEstadoVivienda({
          idToken,
          promoId,
          viviendaId: vivienda.id,
          nuevoEstado,
        });

        if (!result.ok) throw new Error(result.error);
        setRowState((prev) => ({ ...prev, [vivienda.id]: undefined }));
      } catch {
        // Roll back on failure.
        setViviendas((prev) =>
          prev.map((v) => (v.id === vivienda.id ? { ...v, estado: prevEstado } : v))
        );
        setRowState((prev) => ({ ...prev, [vivienda.id]: "error" }));
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-line overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-widest text-stone">
            <th className="px-5 py-4 font-bold">Vivienda</th>
            <th className="px-5 py-4 font-bold hidden sm:table-cell">Tipología</th>
            <th className="px-5 py-4 font-bold hidden sm:table-cell">m²</th>
            <th className="px-5 py-4 font-bold hidden md:table-cell">Orientación</th>
            <th className="px-5 py-4 font-bold">Estado</th>
          </tr>
        </thead>
        <tbody>
          {viviendas.map((v) => (
            <tr key={v.id} className="border-b border-line last:border-0">
              <td className="px-5 py-4 font-bold text-ink">{v.numero}</td>
              <td className="px-5 py-4 text-ink-soft hidden sm:table-cell">{v.tipologia}</td>
              <td className="px-5 py-4 text-ink-soft hidden sm:table-cell">{v.m2}</td>
              <td className="px-5 py-4 text-ink-soft hidden md:table-cell">{v.orientacion}</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <select
                    value={v.estado}
                    onChange={(e) => handleChange(v, e.target.value)}
                    disabled={isPending && rowState[v.id] === "saving"}
                    className="text-xs font-bold uppercase tracking-wide border border-line rounded-full px-3 py-1.5 bg-paper outline-none focus:border-brand disabled:opacity-50"
                  >
                    {ESTADOS.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                  <StatusBadge estado={v.estado} className="hidden lg:inline-flex" />
                  {rowState[v.id] === "saving" && (
                    <span className="text-[11px] text-stone">Guardando…</span>
                  )}
                  {rowState[v.id] === "error" && (
                    <span className="text-[11px] text-brand-dark">No se pudo guardar</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
