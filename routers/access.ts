import { Router } from "express";
import {
  customError,
  sendExpressError,
  PermissionExpression,
} from "@sector-eleven-ltd/cosmos-core";
import { AccessType, accessNeededByEndpoint } from "../types";

type EndpointList<ReturnType = PermissionExpression<string>[]> = {
  [key in string]: ReturnType;
};

const getUrlPermissions = (
  url: string,
  permissionsNeededByEndpointList: EndpointList<AccessType>
) => {
  if (permissionsNeededByEndpointList[url]) {
    return permissionsNeededByEndpointList[url];
  } else {
    const urlKeys = Object.keys(permissionsNeededByEndpointList);
    const splitUrl = url.split("/");

    for (let i = 0; i < urlKeys.length; i++) {
      const splitTestUrl = urlKeys[i].split("/");
      if (splitUrl.length !== splitTestUrl.length) {
        continue;
      }

      let failed = false;
      for (let j = 0; j < splitTestUrl.length; j++) {
        if (
          splitTestUrl[j] !== splitUrl[j] &&
          !splitTestUrl[j].startsWith(":")
        ) {
          failed = true;
          break;
        }
      }
      if (!failed) {
        return permissionsNeededByEndpointList[urlKeys[i]];
      }
    }

    return;
  }
};

// RBAC Router
export const AccessRouter = (userManagementSvc: IUserManagementSvc) => {
  const router = Router();

  router.use(async (_, res, next) => {
    try {
      const { credentials, anon } = res.locals;

      if (!anon) {
        if (!credentials || !credentials.email) {
          throw customError("Credentials not found from Auth", 403);
        }

        const { user, role } = await userManagementSvc.getUserByEmail(
          credentials.email
        );

        res.locals.role = role;
        res.locals.user = user;
      }

      return next();
    } catch (e: any) {
      sendExpressError(res, e);
    }
  });

  router.use(async (req, res, next) => {
    try {
      const { anon } = res.locals;

      const accessRequired = getUrlPermissions(req.url, accessNeededByEndpoint);

      if (!accessRequired) {
        throw customError("Url not found in Url Mapping", 403);
      }

      const allowed = accessRequired === "Not Secured" || !anon;

      if (!allowed) {
        throw customError("You may not use this Url", 403);
      }

      return next();
    } catch (e: any) {
      sendExpressError(res, e);
    }
  });

  router.post("/login/users", async (_, res) => {
    try {
      const { credentials } = res.locals;

      if (!credentials || !credentials.email) {
        throw customError("Credentials not found from Auth", 403);
      }

      const result = await userManagementSvc.login(credentials.email);

      res.status(200).json(result);
    } catch (e: any) {
      sendExpressError(res, e);
    }
  });

  return router;
};
