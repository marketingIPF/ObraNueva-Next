import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import StatusBadge from "@/components/ui/StatusBadge";

const STAT_CARDS = [
  { key: "disponible", label: "Disponibles", dot: "bg-status-available" },
  { key: "reservada", label: "Reservadas", dot: "bg-status-reserved" },
  { key: "vendida", label: "Vendidas", dot: "bg-status-sold" },
];

export default function Availability({ stats, viviendas }) {
  const total = stats.total || 1;
  const vendidoPct = Math.round((stats.vendida / total) * 100);

  return (
    <section id="disponibilidad" className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="Disponibilidad en directo"
            title="Esto no es una maqueta: es el inventario real."
            body="Cada vez que el equipo comercial marca una vivienda como reservada o vendida, esto se actualiza al momento — sin publicar de nuevo la web."
          />
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-soft bg-white rounded-full px-4 py-2 border border-line shrink-0">
            <span className="h-2 w-2 rounded-full bg-status-available animate-pulse" />
            Conectado a Firestore en directo
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-4">
          {STAT_CARDS.map((s) => (
            <div key={s.key} className="bg-card rounded-2xl p-6 shadow-[0_2px_20px_-8px_rgba(21,19,15,0.12)]">
              <div className="flex items-center gap-2 mb-3">
                <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-stone">{s.label}</span>
              </div>
              <p className="font-black text-4xl text-ink">{stats[s.key] || 0}</p>
              <p className="text-sm text-ink-soft mt-1">de {total} viviendas</p>
            </div>
          ))}
        </div>

        <div className="h-2 w-full bg-paper-soft rounded-full overflow-hidden mb-14">
          <div className="h-full flex">
            <div className="bg-status-sold h-full" style={{ width: `${(stats.vendida / total) * 100}%` }} />
            <div className="bg-status-reserved h-full" style={{ width: `${(stats.reservada / total) * 100}%` }} />
            <div className="bg-status-available h-full" style={{ width: `${(stats.disponible / total) * 100}%` }} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {viviendas.map((v) => (
            <div
              key={v.id}
              className="bg-card rounded-2xl p-5 border border-line flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-bold text-ink">{v.numero}</p>
                <p className="text-sm text-ink-soft">
                  {v.tipologia} · {v.m2} m² · {v.orientacion}
                </p>
              </div>
              <StatusBadge estado={v.estado} />
            </div>
          ))}
        </div>

        <p className="text-xs text-stone mt-4">{vendidoPct}% de la promoción vendida hasta ahora.</p>
      </Container>
    </section>
  );
}
