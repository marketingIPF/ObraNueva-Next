import Image from "next/image";
import Container from "@/components/ui/Container";

export default function Hero({ promocion, stats }) {
  const total = stats?.total || 0;
  const disponibles = stats?.disponible || 0;

  return (
    <section className="bg-paper pt-16 pb-8 sm:pt-24 sm:pb-12">
      <Container>
        <div className="rise-1 flex flex-wrap items-center gap-3 mb-6">
          <span className="text-brand text-xs sm:text-sm font-bold uppercase tracking-[0.22em]">
            {promocion.eyebrow}
          </span>
        </div>

        <h1 className="rise-2 font-black text-[clamp(2.25rem,5.4vw,4.25rem)] leading-[1.03] tracking-tight text-ink max-w-3xl">
          {promocion.nombre}
        </h1>

        <p className="rise-3 mt-6 text-lg text-ink-soft max-w-xl leading-relaxed">
          {promocion.subtitulo}
        </p>

        <div className="rise-4 mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#lista-vip"
            className="inline-flex items-center justify-center bg-brand hover:bg-brand-dark text-white font-bold text-sm px-7 py-4 rounded-full transition-colors shadow-[0_10px_30px_-8px_rgba(207,115,27,0.55)]"
          >
            Quiero acceso prioritario
          </a>
          <a
            href="#disponibilidad"
            className="inline-flex items-center justify-center text-ink font-semibold text-sm px-7 py-4 rounded-full border border-ink/15 hover:border-ink/30 transition-colors"
          >
            Ver disponibilidad en directo
          </a>
        </div>

        <div className="relative mt-12 sm:mt-16">
          <div className="relative overflow-hidden rounded-[28px] shadow-[0_30px_60px_-25px_rgba(21,19,15,0.35)] h-[46vh] sm:h-[58vh]">
            <Image
              src={promocion.heroImage}
              alt={`Render exterior ${promocion.nombre}`}
              fill
              priority
              sizes="(min-width: 1240px) 1240px, 100vw"
              className="object-cover"
            />
          </div>

          {/* Signature element: live availability, pulled straight from Firestore. */}
          <div className="absolute left-5 bottom-5 sm:left-8 sm:bottom-8 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 sm:px-6 sm:py-5 shadow-[0_16px_40px_-12px_rgba(21,19,15,0.35)] max-w-[220px] sm:max-w-[260px]">
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-stone font-bold mb-1">
              Disponibilidad ahora
            </p>
            <p className="font-black text-3xl sm:text-4xl text-ink leading-none">
              {disponibles}
              <span className="text-base sm:text-lg font-bold text-stone">/{total}</span>
            </p>
            <p className="text-xs sm:text-sm text-ink-soft mt-1">viviendas disponibles</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
