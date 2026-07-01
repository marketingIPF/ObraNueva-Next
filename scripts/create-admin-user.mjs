#!/usr/bin/env node
// Creates (or updates the password of) a team member who can log into
// /admin. Run against the emulator by default; add :prod counterpart env
// vars to point at your real Firebase project.
//
// Usage:
//   npm run create-admin -- correo@rkpalanca.com "unaContraseñaSegura"

import "dotenv/config";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

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
    console.error("❌ Faltan credenciales de Firebase Admin en .env.local.");
    process.exit(1);
  }
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const [, , email, password] = process.argv;
if (!email || !password) {
  console.error('Uso: npm run create-admin -- correo@rkpalanca.com "contraseña"');
  process.exit(1);
}
if (password.length < 6) {
  console.error("❌ Firebase Auth exige contraseñas de al menos 6 caracteres.");
  process.exit(1);
}

const auth = getAuth(createApp());

try {
  const existing = await auth.getUserByEmail(email).catch(() => null);
  if (existing) {
    await auth.updateUser(existing.uid, { password });
    console.log(`✓ Contraseña actualizada para ${email}`);
  } else {
    await auth.createUser({ email, password, emailVerified: true });
    console.log(`✓ Usuario creado: ${email}`);
  }
} catch (err) {
  console.error("❌ Error:", err.message);
  process.exit(1);
}
process.exit(0);
