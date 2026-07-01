import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Gallery({ id, eyebrow, title, body, images }) {
  return (
    <section id={id} className="bg-paper-soft py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} body={body} />
        <div className="mt-12 grid sm:grid-cols-3 auto-rows-[220px] gap-4">
          {images.map((src, i) => (
            <div
              key={src}
              className={`relative overflow-hidden rounded-2xl bg-card shadow-[0_2px_20px_-8px_rgba(21,19,15,0.12)] ${
                i === 0 ? "sm:row-span-2" : ""
              }`}
            >
              <Image
                src={src}
                alt={`${title} ${i + 1}`}
                fill
                sizes="(min-width: 1240px) 400px, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
