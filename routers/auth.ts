import { Router } from "express";
import { customError, sendExpressError } from "@sector-eleven-ltd/cosmos-core";
import { IAuthFirebaseSvc } from "../svc/auth-firebase";

export const AuthRouter = (authSvc: IAuthFirebaseSvc) => {
  const router = Router();

  router.use(async (req, res, next) => {
    try {
      // Call Service
      const { authorization } = req.headers;

      if (!authorization) {
        throw customError('"authorization" header missing!', 401);
      }

      const [authType, token] = authorization.split(" ");

      if (authType !== "Bearer") {
        throw customError(`Bearer authentication required!`, 401);
      }

      if (!token) {
        throw customError(`Token is required!`, 401);
      }

      const { credentials, anon } = await authSvc.validateIdToken(token);

      res.locals.credentials = credentials;
      res.locals.anon = anon;

      return next();
    } catch (e: any) {
      sendExpressError(res, e);
    }
  });

  return router;
};
