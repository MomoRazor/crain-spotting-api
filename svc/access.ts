import { customError } from "@sector-eleven-ltd/cosmos-core";
import { IUserRepo } from "../repositories";
import { User } from "../types";

export interface IAccessSvc {
  login: (email: string) => Promise<User>;
}

// Service
export const AccessSvc = (userRepo: IUserRepo): IAccessSvc => {
  const login = async (email: string) => {
    const user = await userRepo.findOne({
      query: {
        email,
      },
    });

    if (!user) {
      throw customError("User not found!", 400);
    }

    if (user.softDeleted) {
      throw customError("User is blocked!", 403);
    }

    return user;
  };

  return {
    login,
  };
};
