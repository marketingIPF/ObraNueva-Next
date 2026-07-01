"use client";

// Firebase client SDK — safe to use in the browser. These values are public
// by design (Firebase's real access control lives in Firestore Security
// Rules and Auth, not in hiding this config). Never put the Admin SDK
// service account credentials here — those belong only in
// lib/firebase/admin.js, which never runs in the browser.
//
// Initialization is lazy: Client Components are still rendered once on the
// server for the initial HTML, and `next build` may import this module
// while analyzing routes — neither of those should crash just because
// .env.local isn't filled in yet. The actual Auth/Firestore connection is
// only created the first time a component calls getFirebaseAuth()/
// getFirebaseDb().
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

function getFirebaseApp() {
  if (getApps().length) return getApp();
  return initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}

let authInstance;
let dbInstance;
let authEmulatorConnected = false;
let dbEmulatorConnected = false;

function emulatorsEnabled() {
  return (
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true" &&
    typeof window !== "undefined"
  );
}

export function getFirebaseAuth() {
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
    if (emulatorsEnabled() && !authEmulatorConnected) {
      connectAuthEmulator(authInstance, "http://127.0.0.1:9099", { disableWarnings: true });
      authEmulatorConnected = true;
    }
  }
  return authInstance;
}

export function getFirebaseDb() {
  if (!dbInstance) {
    dbInstance = getFirestore(getFirebaseApp());
    if (emulatorsEnabled() && !dbEmulatorConnected) {
      connectFirestoreEmulator(dbInstance, "127.0.0.1", 8080);
      dbEmulatorConnected = true;
    }
  }
  return dbInstance;
}
