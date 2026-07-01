import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { getPromocion, getViviendas, summarizeViviendas } from "@/lib/data/promociones";
import ViviendaTable from "@/components/admin/ViviendaTable";

export const dynamic = "force-dynamic";

export default async function AdminPromocionPage({ params }) {
  const { slug } = await params;
  const promocion = await getPromocion(slug);
  if (!promocion) notFound();

  const viviendas = await getViviendas(slug);
  const stats = summarizeViviendas(viviendas);

  return (
    <Container className="py-12">
      <Link href="/admin" className="text-sm font-semibold text-ink-soft hover:text-ink">
        ← Todas las promociones
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4 mt-4 mb-8">
        <div>
          <h1 className="font-black text-2xl text-ink">{promocion.nombre}</h1>
          <p className="text-ink-soft text-sm mt-1">
            {stats.disponible} disponibles · {stats.reservada} reservadas · {stats.vendida} vendidas ·{" "}
            {stats.total} en total
          </p>
        </div>
        <Link
          href={`/promociones/${slug}`}
          target="_blank"
          className="text-sm font-bold text-brand-dark hover:underline"
        >
          Ver página pública ↗
        </Link>
      </div>

      <ViviendaTable promoId={slug} initialViviendas={viviendas} />
    </Container>
  );
}
