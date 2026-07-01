import Container from "@/components/ui/Container";

export default function AuthorityBar({ promocion }) {
  return (
    <div className="border-y border-line bg-paper-soft">
      <Container className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p className="text-xs sm:text-sm text-ink-soft uppercase tracking-widest font-semibold">
          Promueve {promocion.promotor} · Comercializa {promocion.comercializa}
        </p>
        <p className="text-xs sm:text-sm text-brand-dark font-bold">
          Más de 5.025 viviendas vendidas desde 1976
        </p>
      </Container>
    </div>
  );
}
