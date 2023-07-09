// These are the Endpoints. This type is added to help mapping ensure that each
// endpoint is being set their own permissions
export type Endpoint =
  //User Endpoints
  "/register/users" | "/update/users/:id" | "/login/users";

export type AccessType = "Secured" | "Not Secured";

export const accessNeededByEndpoint: {
  [key in Endpoint]: AccessType;
} = {
  //User Mapping
  "/register/users": "Not Secured",
  "/update/users/:id": "Secured",
  "/login/users": "Secured",
};
