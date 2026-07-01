import Link from "next/link";
import Container from "@/components/ui/Container";
import { getAllPromociones } from "@/lib/data/promociones";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const promociones = await getAllPromociones();

  return (
    <Container className="py-12">
      <h1 className="font-black text-2xl text-ink mb-1">Promociones</h1>
      <p className="text-ink-soft text-sm mb-8">
        Selecciona una promoción para gestionar la disponibilidad de sus viviendas.
      </p>

      {promociones.length === 0 ? (
        <p className="text-ink-soft text-sm">
          No hay promociones todavía. Ejecuta <code>npm run seed</code>.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {promociones.map((p) => (
            <Link
              key={p.id}
              href={`/admin/promociones/${p.id}`}
              className="bg-white rounded-2xl p-6 border border-line hover:border-brand/40 transition-colors"
            >
              <h2 className="font-bold text-ink mb-1">{p.nombre}</h2>
              <p className="text-sm text-ink-soft">
                {p.stats.disponible} disp. · {p.stats.reservada} res. · {p.stats.vendida} vend.
              </p>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
