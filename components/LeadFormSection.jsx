import Container from "@/components/ui/Container";
import LeadForm from "@/components/LeadForm";

export default function LeadFormSection({ promoId, promoNombre }) {
  return (
    <section id="lista-vip" className="bg-brand-tint py-20 sm:py-28">
      <Container className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-brand-dark text-xs sm:text-sm font-bold uppercase tracking-[0.22em] mb-3">
            No te quedes sin tu plaza
          </p>
          <h2 className="font-black text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] tracking-tight text-ink">
            La demanda de VPP en esta zona es altísima.
          </h2>
          <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-md">
            Únete a la lista VIP hoy y asegura tu acceso prioritario antes de que la promoción
            salga a portales inmobiliarios.
          </p>
        </div>

        <div className="bg-white rounded-[28px] p-8 sm:p-10 shadow-[0_20px_60px_-25px_rgba(21,19,15,0.35)]">
          <h3 className="font-black text-2xl text-ink mb-1">Garantiza tu acceso prioritario</h3>
          <p className="text-ink-soft text-sm mb-7">
            Déjanos tus datos para recibir precios y planos en primicia.
          </p>
          <LeadForm promoId={promoId} promoNombre={promoNombre} />
        </div>
      </Container>
    </section>
  );
}
