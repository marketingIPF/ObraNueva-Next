export default function SectionHeading({ eyebrow, title, body, align = "left" }) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <p className="text-brand text-xs sm:text-sm font-bold uppercase tracking-[0.22em] mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-black text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] tracking-tight text-ink">
        {title}
      </h2>
      {body && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink-soft">
          {body}
        </p>
      )}
    </div>
  );
}
