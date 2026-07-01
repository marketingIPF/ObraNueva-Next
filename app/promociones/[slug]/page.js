import { notFound } from "next/navigation";
import { getPromocion, getViviendas, summarizeViviendas } from "@/lib/data/promociones";
import Hero from "@/components/Hero";
import AuthorityBar from "@/components/AuthorityBar";
import Features from "@/components/Features";
import Availability from "@/components/Availability";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import SocialProof from "@/components/SocialProof";
import WhyJoin from "@/components/WhyJoin";
import LeadFormSection from "@/components/LeadFormSection";
import Footer from "@/components/Footer";

// Data changes whenever the admin panel updates a vivienda, not on a fixed
// schedule — render this route dynamically and let revalidatePath (called
// from the Server Action) refresh it on demand instead of on a timer.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const promocion = await getPromocion(slug);
  if (!promocion) return {};
  return {
    title: `${promocion.nombre} · Palanca Fontestad`,
    description: promocion.subtitulo,
    openGraph: {
      title: promocion.nombre,
      description: promocion.subtitulo,
      images: [promocion.heroImage],
    },
  };
}

export default async function PromocionPage({ params }) {
  const { slug } = await params;
  const promocion = await getPromocion(slug);
  if (!promocion) notFound();

  const viviendas = await getViviendas(slug);
  const stats = summarizeViviendas(viviendas);

  return (
    <main>
      <Hero promocion={promocion} stats={stats} />
      <AuthorityBar promocion={promocion} />
      <Features features={promocion.features} />
      <Availability stats={stats} viviendas={viviendas} />
      <Gallery
        id="exterior"
        eyebrow="Diseño exterior vanguardista"
        title="Un referente arquitectónico para tu nuevo estilo de vida."
        body={promocion.descripcionExterior}
        images={promocion.galeriaExterior}
      />
      <Gallery
        id="interior"
        eyebrow="Interiores y calidades premium"
        title="El máximo confort, con acabados de primera calidad."
        body={promocion.descripcionInterior}
        images={promocion.galeriaInterior}
      />
      <Location promocion={promocion} />
      <SocialProof casos={promocion.casosExito} />
      <WhyJoin />
      <LeadFormSection promoId={slug} promoNombre={promocion.nombre} />
      <Footer />
    </main>
  );
}
