import { Maybe } from "graphql/jsutils/Maybe";
import { decodeJwt } from "jose";

export const getNameFromGoogleIDToken = (token: Maybe<string>) => {
  if (!token) return null;

  const dec = decodeJwt(token);
  return dec?.name as string;
};

export const getSubFromGoogleIDToken = (token: Maybe<string>) => {
  if (!token) return null;

  const dec = decodeJwt(token);
  return ("GOOGLE:" + dec?.sub) as string;
};
