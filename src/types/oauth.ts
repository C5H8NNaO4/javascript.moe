import { Maybe } from "graphql/jsutils/Maybe";

export type AuthProvider = "GOOGLE" | "REDDIT";

export type GoogleAccessToken = {
  access_token?: string;
};

export type GoogleIdentityToken = {
  id_token?: Maybe<string>;
};

export type RedditAuthToken = {
  access_token: string;
};
export type AuthTokens = Partial<{
  GOOGLE: Maybe<GoogleAccessToken & GoogleIdentityToken>;
  REDDIT: Maybe<RedditAuthToken>;
  signed: string;
}>;

export type OAuthToken = AuthTokens[AuthProvider];
