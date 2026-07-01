import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function SocialProof({ casos }) {
  return (
    <section className="bg-paper-soft py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Casos de éxito"
          title="La confianza de apostar por un proyecto consolidado."
          body="Neobricks cuenta con un historial impecable de promociones entregadas y éxitos de venta."
        />
        <div className="mt-12 grid sm:grid-cols-2 gap-6 max-w-2xl">
          {casos.map((c) => (
            <div key={c.nombre} className="bg-card rounded-2xl p-7 shadow-[0_2px_20px_-8px_rgba(21,19,15,0.12)]">
              <h3 className="font-bold text-lg text-ink">{c.nombre}</h3>
              <p className="text-sm text-stone mb-5">{c.lugar}</p>
              <div className="h-2 w-full bg-paper-soft rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full"
                  style={{ width: `${c.porcentaje}%` }}
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-black text-2xl text-brand-dark">{c.porcentaje}%</span>
                <span className="text-xs uppercase tracking-widest text-stone font-semibold">Vendido</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
