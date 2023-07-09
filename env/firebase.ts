import { ServiceAccount } from "firebase-admin";

if (!process.env.FIREBASE_CLIENT_EMAIL)
  throw new Error("FIREBASE_CLIENT_EMAIL variable is missing!");

if (!process.env.FIREBASE_PRIVATE_KEY)
  throw new Error("FIREBASE_PRIVATE_KEY variable is missing!");

if (!process.env.FIREBASE_PROJECT_ID)
  throw new Error("FIREBASE_PROJECT_ID variable is missing!");

export const FIREBASE_SERVICE_ACCOUNT: ServiceAccount = {
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  projectId: process.env.FIREBASE_PROJECT_ID,
};

if (!process.env.FIREBASE_BUCKET)
  throw new Error("FIREBASE_BUCKET variable is missing!");

export const FIREBASE_BUCKET = process.env.FIREBASE_BUCKET;
