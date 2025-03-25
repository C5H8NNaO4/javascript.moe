import clsx from "clsx";
import { Component } from "./Chip";
import { getNameFromGoogleIDToken } from "@/lib/jwt";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AuthTokens } from "@/types/oauth";

export type IdentifiedNameProps = Component<{
  className?: string;
}>;
export const IdentifiedName = (props: IdentifiedNameProps) => {
  const { className } = props;
  const [identity] = useLocalStorage<AuthTokens | null>(null, "identity");
  const name =
    getNameFromGoogleIDToken(identity?.GOOGLE?.id_token) || "Anonymous";
    
  return <span className={clsx(className)}>{name}</span>;
};
