import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="bg-paper border-t border-line py-10">
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone">
        <p>© 2026 RK Palanca Fontestad. Proyecto comercializado en exclusiva.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-ink transition-colors">Aviso Legal</a>
          <a href="#" className="hover:text-ink transition-colors">Política de Privacidad</a>
        </div>
      </Container>
    </footer>
  );
}
