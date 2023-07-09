import dotenv from "dotenv";
dotenv.config();

if (process.env.PORT === undefined) {
  throw new Error("PORT is undefined");
}
export const PORT = parseInt(process.env.PORT);

if (process.env.NODE_ENV === undefined) {
  throw new Error("NODE_ENV is undefined");
}
export const DEV = process.env.NODE_ENV !== "production";

export * from "./firebase";
export * from "./mongo";
