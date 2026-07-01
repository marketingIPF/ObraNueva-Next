import "./globals.css";

export const metadata = {
  title: "Palanca Fontestad · Promociones",
  description:
    "Motor de promociones de obra nueva de Palanca Fontestad: disponibilidad en directo por vivienda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
