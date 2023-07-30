import {
  CreateArgs,
  UpdateArgs,
  FindByIdArgs,
  PaginationResponse,
  FindManyArgs,
  RestoreByIdArgs,
  DeleteByIdArgs,
  customError,
} from "@sector-eleven-ltd/cosmos-core";
import { User } from "../types";
import { Auth } from "firebase-admin/lib/auth/auth";
import { IUserRepo } from "../repositories";

export interface IUserManagementSvc {
  createUser: (args: CreateArgs<User>) => Promise<User | undefined>;
  updateUser: (args: UpdateArgs<User>) => Promise<User | undefined>;
  getUserById: (args: FindByIdArgs) => Promise<User | undefined>;
  getUserAutocomplete: (
    search: string
  ) => Promise<PaginationResponse<Partial<User>>>;
  getUsers: (
    args: FindManyArgs,
    deleted?: boolean
  ) => Promise<PaginationResponse<User>>;
  restoreUserById: (args: RestoreByIdArgs) => Promise<User | undefined>;
  deleteUserById: (args: DeleteByIdArgs) => Promise<User | undefined>;
}

export interface CreateUser extends User {
  password: string;
}

export const UserManagementSvc = (
  auth: Auth,
  userRepo: IUserRepo
): IUserManagementSvc => {
  const createUser = async (args: CreateArgs<CreateUser>) => {
    const { data, createdBy } = args;

    if (!data.email) {
      throw customError("Email is required to create a User", 400);
    }
    let firebaseUser;
    try {
      firebaseUser = await auth.getUserByEmail(data.email);
    } catch (e) {
      console.info("User not found in Firebase");
    }

    if (!firebaseUser) {
      firebaseUser = await auth.createUser({
        displayName: data.displayName,
        email: data.email,
      });
    }

    return await userRepo.create({
      data: {
        ...data,
        id: firebaseUser.uid,
      },
      createdBy,
    });
  };

  const updateUser = async (args: UpdateArgs<User>) => {
    const result = await userRepo.update(args);

    let firebaseUser;
    try {
      firebaseUser = await auth.getUserByEmail(result.email);
    } catch (e) {
      console.info("User not found in Firebase");
    }

    if (firebaseUser) {
      await auth.updateUser(firebaseUser?.uid, {
        displayName: result.displayName,
      });
    }

    return result;
  };

  const getUserById = async (args: FindByIdArgs) => {
    const result = await userRepo.findById(args);

    return result;
  };

  const getUserAutocomplete = async (search: string) => {
    const result = await userRepo.findMany({
      page: 1,
      pageSize: 0,
      query: {
        $or: [
          {
            displayName: { $regex: search, $options: "i" },
          },
          {
            email: { $regex: search, $options: "i" },
          },
        ],
      },
    });

    return {
      documents: result.documents.map((user) => ({
        id: user.id,
        displayName: user.displayName,
        email: user.email,
      })),
      total: result.total,
    };
  };

  const getUsers = async (args: FindManyArgs, deleted?: boolean) => {
    const { query, ...restOfArgs } = args;

    let fullQuery;

    if (deleted) {
      fullQuery = {
        ...query,
        softDeleted: true,
      };
    } else {
      fullQuery = {
        ...query,
        softDeleted: false,
      };
    }

    const result = await userRepo.findMany({
      ...restOfArgs,
      query: fullQuery,
    });

    return result;
  };

  const restoreUserById = async (args: RestoreByIdArgs) => {
    return await userRepo.restoreById(args);
  };

  const deleteUserById = async (args: DeleteByIdArgs) => {
    return await userRepo.deleteById(args);
  };

  return {
    createUser,
    updateUser,
    getUserById,
    getUserAutocomplete,
    getUsers,
    restoreUserById,
    deleteUserById,
  };
};
