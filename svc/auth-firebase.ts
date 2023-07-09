import { Auth } from "firebase-admin/lib/auth/auth";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export interface IAuthFirebaseSvc {
  validateIdToken: (idToken: string) => Promise<{
    credentials: DecodedIdToken;
    anon: boolean;
  }>;
}

export const AuthFirebaseSvc = (auth: Auth): IAuthFirebaseSvc => {
  const validateIdToken = async (idToken: string) => {
    const credentials = await auth.verifyIdToken(idToken);

    return {
      credentials,
      anon: credentials.firebase.sign_in_provider === "anonymous",
    };
  };

  return { validateIdToken };
};
