import mongoose from "mongoose";
import { DEV, FIREBASE_SERVICE_ACCOUNT, MONGO_CONNECTION_STRING } from "./env";
import {
  initializeApp,
  credential,
  auth,
  storage,
  firestore,
} from "firebase-admin";
import { UserRepo } from "./repositories";
import {
  AccessSvc,
  AuthFirebaseSvc,
  UploadManagement,
  UserManagementSvc,
} from "./svc";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { AccessRouter } from "./routers/access";
import { AuthRouter } from "./routers/auth";

const main = async () => {
  const app = express();

  app.use(express.json({ limit: `2mb` }));
  app.use(cors());
  app.use(morgan(`dev`));

  // Set up database connection
  mongoose.set({ strictQuery: true });
  const database = await mongoose.connect(MONGO_CONNECTION_STRING);

  initializeApp({ credential: credential.cert(FIREBASE_SERVICE_ACCOUNT) });
  const authInstance = auth();
  const storageInstance = storage();

  const userRepo = await UserRepo(database);

  const authService = AuthFirebaseSvc(authInstance);
  const accessService = AccessSvc(userRepo);
  const uploadService = UploadManagement(storageInstance);
  const userManagement = UserManagementSvc(authInstance, userRepo);

  const accessRouter = AccessRouter(accessService);
  const authRouter = AuthRouter(authService);

  app.use("/api", authRouter);
  app.use("/api", accessRouter);
};
main();
