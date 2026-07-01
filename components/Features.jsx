import Container from "@/components/ui/Container";

export default function Features({ features }) {
  return (
    <section className="bg-paper py-20 sm:py-24">
      <Container>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card rounded-2xl p-7 shadow-[0_2px_20px_-8px_rgba(21,19,15,0.12)]">
              <div className="h-9 w-9 rounded-full bg-brand-tint mb-5 flex items-center justify-center">
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              </div>
              <h3 className="font-bold text-ink mb-2">{f.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
