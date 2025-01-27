import { useGoogleLogin } from "@react-oauth/google";
import { IconButton } from "../Button";

import clsx from "clsx";

import client from "@/config/apolloClient";
import {
  IdentifyDocument,
  IdentifyMutation,
} from "@/apollo/queries/generated/graphql";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AuthTokens } from "@/types/oauth";
const swapToken = async (code: string) => {
  const token = await client.mutate<IdentifyMutation>({
    mutation: IdentifyDocument,
    variables: {
      provider: "GOOGLE",
      providerToken: {
        code,
      },
      redirectUri: window.location.protocol + '//' + window.location.host
    },
  });
  return token;
};
export const GoogleLoginButton = ({ className, scheme, id, tooltip }: any) => {
  const [identity, setIdentity] = useLocalStorage<AuthTokens | null>(
    null,
    "identity"
  );
  const [, setActiveIdentity] = useLocalStorage<AuthTokens | null>(
    null,
    "activeIdentity"
  );
  const startLogin = useGoogleLogin({
    flow: "auth-code",
    scope: ["email", "profile"].join(" "),
    onError: (error) => {
      console.log("Google OAuth Error", error);
    },
    onSuccess: async (tokenResponse) => {
      console.log("RESPONSE", tokenResponse);
      const response = await swapToken(tokenResponse.code);

      if (response.data?.identify) {
        setIdentity(response.data?.identify);
        setActiveIdentity(response.data?.identify);
      }
      console.log("GOOGLE RESPONSE SWAPPED", response.data?.identify);
    },
  });

  return (
    <IconButton
      id={id}
      icon="FaGoogle"
      onClick={() => startLogin()}
      tooltip={tooltip}
      className={clsx(
        {
          "bg-green-700/80": !identity?.GOOGLE?.id_token,
          "bg-yellow-700/80": identity?.GOOGLE?.id_token,
          "bg-white/80 border-0 shadow-md": scheme === "white",
        },
        className
      )}
    ></IconButton>
  );
};
