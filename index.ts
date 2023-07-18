import mongoose from "mongoose";
import { DEV, FIREBASE_SERVICE_ACCOUNT, MONGO_CONNECTION_STRING } from "./env";
import { initializeApp, credential, auth, storage, firestore } from "firebase-admin";

const main = async () => {
  // Set up database connection
  mongoose.set({ strictQuery: true });
  const database = await mongoose.connect(MONGO_CONNECTION_STRING);#


  initializeApp({ credential: credential.cert(FIREBASE_SERVICE_ACCOUNT) })
  const authInstance = auth()
  const storageInstance = storage()
  const firestoreInstance = firestore()
  const firestoreEnvCollection = firestoreInstance.collection(DEV ? 'staging' : 'production')

};
main();
