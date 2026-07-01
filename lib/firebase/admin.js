// Firebase Admin SDK — SERVER ONLY. Never import this file from a Client
// Component ("use client"). It holds elevated, trusted access to Firestore
// and Auth using a service account, and is what Server Components and
// Server Actions use to read/write data directly without a public API.
//
// Initialization is lazy (only happens the first time getAdminDb()/
// getAdminAuth() is actually called) so that `next build` — which imports
// route modules to analyze them — never needs real credentials to succeed.
// Credentials are only required once a request actually asks for data.
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let app;

function getAdminApp() {
  if (app) return app;
  if (getApps().length) {
    app = getApps()[0];
    return app;
  }

  const usingEmulator = Boolean(
    process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FIRESTORE_EMULATOR_HOST
  );

  if (usingEmulator) {
    app = initializeApp({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "demo-sagunto-fusion",
    });
    return app;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // Vercel/.env files store multiline keys with literal "\n" — restore real
  // newlines before handing it to the SDK.
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Faltan credenciales de Firebase Admin. Revisa FIREBASE_ADMIN_PROJECT_ID, " +
        "FIREBASE_ADMIN_CLIENT_EMAIL y FIREBASE_ADMIN_PRIVATE_KEY en tu .env.local " +
        "(ver README para cómo obtenerlas), o arranca el emulador con `npm run emulators`."
    );
  }

  app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  return app;
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}
