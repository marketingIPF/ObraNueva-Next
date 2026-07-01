import Container from "@/components/ui/Container";

const REASONS = [
  {
    title: "Acceso prioritario",
    body: "Recibirás el dossier oficial con planos y precios antes de su publicación en portales inmobiliarios.",
  },
  {
    title: "Cero compromiso",
    body: "Apuntarte a la lista VIP es 100% gratuito y no te obliga a reservar ni a comprar.",
  },
  {
    title: "Elige tú primero",
    body: "Al ser VPP, el precio se fija por m² — prioridad absoluta para elegir altura y orientación, al mismo precio que el resto.",
  },
];

export default function WhyJoin() {
  return (
    <section className="bg-paper pt-4 pb-20 sm:pb-28">
      <Container>
        <p className="text-brand text-xs sm:text-sm font-bold uppercase tracking-[0.22em] mb-6">
          ¿Por qué apuntarte a la lista VIP?
        </p>
        <div className="grid sm:grid-cols-3 gap-5">
          {REASONS.map((r) => (
            <div key={r.title} className="bg-paper-soft rounded-2xl p-7">
              <h3 className="font-bold text-ink mb-2">{r.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
