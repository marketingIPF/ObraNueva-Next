// Server-only data access layer. Server Components and Server Actions read
// through these functions instead of touching Firestore directly — one
// place to change if the schema evolves, and one place to keep the shape
// of what's returned consistent and minimal (no over-fetching).
import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";

const ESTADOS_VALIDOS = ["disponible", "reservada", "vendida"];

function summarize(viviendas) {
  const stats = { disponible: 0, reservada: 0, vendida: 0, total: viviendas.length };
  for (const v of viviendas) {
    if (ESTADOS_VALIDOS.includes(v.estado)) stats[v.estado] += 1;
  }
  return stats;
}

export async function getAllPromociones() {
  const snap = await getAdminDb().collection("promociones").orderBy("nombre").get();
  const promociones = await Promise.all(
    snap.docs.map(async (doc) => {
      const viviendasSnap = await doc.ref.collection("viviendas").get();
      const viviendas = viviendasSnap.docs.map((v) => v.data());
      return {
        id: doc.id,
        ...doc.data(),
        stats: summarize(viviendas),
      };
    })
  );
  return promociones;
}

export async function getPromocion(slug) {
  const doc = await getAdminDb().collection("promociones").doc(slug).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function getViviendas(slug) {
  const snap = await getAdminDb()
    .collection("promociones")
    .doc(slug)
    .collection("viviendas")
    .orderBy("planta")
    .orderBy("numero")
    .get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export function summarizeViviendas(viviendas) {
  return summarize(viviendas);
}

export { ESTADOS_VALIDOS };
