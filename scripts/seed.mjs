#!/usr/bin/env node
// Seed script: creates the Sagunto Fusión 1 promotion + a realistic set of
// viviendas in Firestore, so there's real data to look at the first time
// you run the project. Safe to re-run — it overwrites the same documents.
//
// Usage:
//   npm run seed              (writes to the emulator if it's running)
//   npm run seed:prod         (writes to your real Firebase project)

import "dotenv/config";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const usingEmulator = Boolean(
  process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FIRESTORE_EMULATOR_HOST
);

function createApp() {
  if (usingEmulator) {
    return initializeApp({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "demo-sagunto-fusion",
    });
  }
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      "\n❌ Faltan credenciales de Firebase Admin en .env.local.\n" +
        "   (o arranca el emulador con `npm run emulators` y usa `npm run seed`)\n"
    );
    process.exit(1);
  }
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const app = createApp();
const db = getFirestore(app);

const IMG = "https://www.inmobiliariapalanca.com/wp-content/uploads/2026/04";
const IMG_03 = "https://www.inmobiliariapalanca.com/wp-content/uploads/2026/03";

const promocion = {
  nombre: "Neobricks Sagunto Fusión 1",
  eyebrow: "Próximo lanzamiento · Sagunto, Camp de Morvedre",
  subtitulo:
    "298 viviendas VPP de 1, 2 y 3 habitaciones con terraza y garaje incluido, en la zona de mayor expansión del Camp de Morvedre.",
  promotor: "Neobricks",
  comercializa: "Palanca Fontestad",
  heroImage: `${IMG}/Sagunto-Fusion-1-17.jpeg`,
  ubicacionImagen: `${IMG_03}/Sagunto-Fusion-1-13.png`,
  descripcionExterior:
    "Líneas modernas y una fachada proyectada para maximizar la luz natural, con viviendas abiertas al exterior y amplias terrazas. Pensado para el clima mediterráneo y la tranquilidad de tu propio hogar.",
  descripcionInterior:
    "Pavimentos LinkFloor de Porcelanosa y tecnología de alta eficiencia con sistemas de aerotermia. Además, puedes personalizar tu cocina y tus baños para que tu casa sea un fiel reflejo de ti desde el primer día.",
  descripcionUbicacion:
    "Sagunto se ha convertido en el epicentro tecnológico e industrial del Camp de Morvedre. Vivir aquí significa invertir en una zona con una proyección imparable, rodeado de servicios, excelentes conexiones y a un paso de la playa.",
  galeriaExterior: [
    `${IMG}/Sagunto-Fusion-1-16.jpeg`,
    `${IMG}/Sagunto-Fusion-1-15.jpeg`,
    `${IMG}/Sagunto-Fusion-1-2.jpeg`,
    `${IMG}/Sagunto-Fusion-1-4.jpeg`,
    `${IMG}/Sagunto-Fusion-1-8.jpeg`,
    `${IMG}/Sagunto-Fusion-1-20.jpeg`,
  ],
  galeriaInterior: [
    `${IMG}/Interiores-Sagunto-Fusion-1-45.jpeg`,
    `${IMG}/Interiores-Sagunto-Fusion-1-35.jpeg`,
    `${IMG}/Interiores-Sagunto-Fusion-1-1.jpg`,
    `${IMG}/Interiores-Sagunto-Fusion-1-46.jpeg`,
    `${IMG}/Interiores-Sagunto-Fusion-1-17.jpeg`,
    `${IMG}/Interiores-Sagunto-Fusion-1-52.jpeg`,
  ],
  features: [
    { title: "Terrazas y vistas", body: "Espacios abiertos en todas las viviendas para disfrutar del clima mediterráneo." },
    { title: "Calificación VPP", body: "Calidad de obra nueva a un precio regulado y accesible." },
    { title: "Garaje incluido", body: "Plaza de aparcamiento para tu total comodidad desde el primer día." },
    { title: "Eficiencia energética", body: "Diseño moderno con aerotermia, pensado para el máximo ahorro y confort." },
  ],
  casosExito: [
    { nombre: "Parque Central", lugar: "Torrent", porcentaje: 100 },
    { nombre: "Calderona Homes", lugar: "Massamagrell", porcentaje: 70 },
  ],
  updatedAt: new Date().toISOString(),
};

// A realistic slice of the 298-unit building: mixed types, floors and
// statuses, enough to demo the admin flow and the live availability panel.
const tipologias = [
  { tipologia: "1 habitación", m2: 52 },
  { tipologia: "2 habitaciones", m2: 68 },
  { tipologia: "2 habitaciones", m2: 71 },
  { tipologia: "3 habitaciones", m2: 89 },
];
const orientaciones = ["Norte", "Sur", "Este", "Oeste"];
const letras = ["A", "B", "C", "D"];

function buildViviendas() {
  const viviendas = [];
  let counter = 0;
  for (let planta = 1; planta <= 6; planta++) {
    letras.forEach((letra, i) => {
      counter += 1;
      const { tipologia, m2 } = tipologias[(planta + i) % tipologias.length];
      // Bias: lower floors mostly sold/reserved, higher floors more available —
      // a believable distribution for a promotion mid-way through its VIP launch.
      let estado = "disponible";
      const roll = (planta * 7 + i * 3) % 10;
      if (planta <= 2) estado = roll < 7 ? "vendida" : "reservada";
      else if (planta <= 4) estado = roll < 4 ? "reservada" : roll < 6 ? "vendida" : "disponible";
      else estado = roll < 2 ? "reservada" : "disponible";

      viviendas.push({
        id: `p${planta}-${letra}`,
        numero: `${planta}º${letra}`,
        planta,
        tipologia,
        m2,
        orientacion: orientaciones[(planta + i) % orientaciones.length],
        estado,
        updatedAt: new Date().toISOString(),
      });
    });
  }
  return viviendas;
}

async function seed() {
  const slug = "sagunto-fusion-1";
  const promoRef = db.collection("promociones").doc(slug);
  await promoRef.set(promocion, { merge: true });
  console.log(`✓ Promoción "${promocion.nombre}" escrita en promociones/${slug}`);

  const viviendas = buildViviendas();
  const batch = db.batch();
  for (const v of viviendas) {
    const { id, ...data } = v;
    batch.set(promoRef.collection("viviendas").doc(id), data, { merge: true });
  }
  await batch.commit();
  console.log(`✓ ${viviendas.length} viviendas escritas en promociones/${slug}/viviendas`);

  const resumen = viviendas.reduce(
    (acc, v) => ({ ...acc, [v.estado]: (acc[v.estado] || 0) + 1 }),
    {}
  );
  console.log("  →", resumen);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error al sembrar datos:", err);
  process.exit(1);
});
