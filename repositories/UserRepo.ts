import { Mongoose, Schema } from "mongoose";
import { User } from "../types/project";
import { BaseRepo, MongooseBaseRepo } from "@sector-eleven-ltd/cosmos-core";

export type IUserRepo = BaseRepo<User>;

export const UserRepo = async (database: Mongoose): Promise<IUserRepo> => {
  const { String } = Schema.Types;

  const userSchema = new Schema<User>({
    email: { type: String, required: true, trim: true },
    displayName: { type: String, required: true, trim: true },
  });

  const repo = await MongooseBaseRepo<User>(database, "Users", userSchema, {
    indexes: [
      {
        indexSpec: "email",
        options: {
          unique: true,
        },
      },
    ],
  });

  return repo;
};
