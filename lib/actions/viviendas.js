"use server";

// Server Action: the only way the admin UI is allowed to change a
// vivienda's status. Every exported action here is effectively a public
// POST endpoint (that's how Next.js Server Actions work), so it must
// authenticate and validate on its own — never trust the client.
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { ESTADOS_VALIDOS } from "@/lib/data/promociones";

const inputSchema = z.object({
  idToken: z.string().min(10, "Falta el token de sesión."),
  promoId: z.string().min(1),
  viviendaId: z.string().min(1),
  nuevoEstado: z.enum(ESTADOS_VALIDOS),
});

export async function updateEstadoVivienda(input) {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Datos inválidos." };
  }
  const { idToken, promoId, viviendaId, nuevoEstado } = parsed.data;

  // Authentication: verify the Firebase ID token server-side. A well-formed
  // request body is not authorization — this is what actually confirms the
  // person calling this action is a signed-in team member.
  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(idToken);
  } catch {
    return { ok: false, error: "Sesión no válida. Vuelve a iniciar sesión." };
  }
  if (!decoded?.uid) {
    return { ok: false, error: "No autenticado." };
  }

  const viviendaRef = getAdminDb()
    .collection("promociones")
    .doc(promoId)
    .collection("viviendas")
    .doc(viviendaId);

  const snap = await viviendaRef.get();
  if (!snap.exists) {
    return { ok: false, error: "La vivienda no existe." };
  }

  await viviendaRef.update({
    estado: nuevoEstado,
    updatedAt: new Date().toISOString(),
    updatedBy: decoded.email || decoded.uid,
  });

  // Make the public promotion page reflect this immediately, plus the
  // admin screen and the promotions index (its counts changed too).
  revalidatePath(`/promociones/${promoId}`);
  revalidatePath(`/admin/promociones/${promoId}`);
  revalidatePath("/");
  revalidatePath("/admin");

  return { ok: true };
}
