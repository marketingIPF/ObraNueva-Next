"use server";

// Public Server Action: anyone can call this (it's a lead-capture form, that's
// the point), so there's no auth check — but input is still validated
// server-side, and it never trusts the client for anything beyond the
// submitted fields themselves.
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase/admin";

const leadSchema = z.object({
  promoId: z.string().min(1),
  nombre: z.string().trim().min(2, "Indica tu nombre."),
  telefono: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Correo electrónico no válido."),
  privacidad: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad." }),
  }),
});

export async function submitLead(input) {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Datos inválidos." };
  }
  const { promoId, nombre, telefono, email } = parsed.data;

  await getAdminDb()
    .collection("promociones")
    .doc(promoId)
    .collection("leads")
    .add({
      nombre,
      telefono: telefono || null,
      email,
      createdAt: new Date().toISOString(),
    });

  return { ok: true };
}
