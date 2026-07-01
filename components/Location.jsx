import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Location({ promocion }) {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <Container className="grid lg:grid-cols-2 gap-12 items-center">
        <SectionHeading
          eyebrow="Ubicación estratégica"
          title="En el corazón del nuevo boom de Valencia."
          body={promocion.descripcionUbicacion}
        />
        <div className="relative min-h-[320px] rounded-[28px] overflow-hidden shadow-[0_20px_50px_-20px_rgba(21,19,15,0.3)]">
          <Image
            src={promocion.ubicacionImagen}
            alt={`Entorno ${promocion.nombre}`}
            fill
            sizes="(min-width: 1240px) 600px, 100vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
