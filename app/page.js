import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { getAllPromociones } from "@/lib/data/promociones";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const promociones = await getAllPromociones();

  return (
    <main className="bg-paper min-h-screen py-20 sm:py-28">
      <Container>
        <p className="text-brand text-xs sm:text-sm font-bold uppercase tracking-[0.22em] mb-3">
          Palanca Fontestad · Motor de promociones
        </p>
        <h1 className="font-black text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.05] tracking-tight text-ink max-w-2xl">
          Todas las promociones activas, desde un único panel.
        </h1>
        <p className="mt-5 text-lg text-ink-soft max-w-xl leading-relaxed">
          Una plantilla, datos reales por promoción. Añade una promoción nueva sin tocar código —
          y su disponibilidad se actualiza en directo desde el panel de administración.
        </p>

        {promociones.length === 0 ? (
          <div className="mt-14 bg-white rounded-2xl p-8 border border-line max-w-xl">
            <p className="text-ink font-semibold mb-1">Todavía no hay promociones cargadas.</p>
            <p className="text-ink-soft text-sm">
              Ejecuta <code className="bg-paper-soft px-1.5 py-0.5 rounded">npm run seed</code> para
              cargar Sagunto Fusión 1 con datos de ejemplo.
            </p>
          </div>
        ) : (
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {promociones.map((p) => (
              <Link
                key={p.id}
                href={`/promociones/${p.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_20px_-8px_rgba(21,19,15,0.12)] hover:shadow-[0_16px_40px_-12px_rgba(21,19,15,0.25)] transition-shadow"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={p.heroImage}
                    alt={p.nombre}
                    fill
                    sizes="(min-width: 1240px) 400px, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-bold text-lg text-ink mb-1">{p.nombre}</h2>
                  <p className="text-sm text-ink-soft mb-4">
                    {p.stats.disponible} disponibles de {p.stats.total}
                  </p>
                  <span className="text-sm font-bold text-brand-dark">Ver promoción →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
