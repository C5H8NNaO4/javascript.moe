import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AuthTokens } from "@/types/oauth";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const idtAtm = atom<string | null>(null);
export const useIdentity = () => {
  const [identity] = useLocalStorage<AuthTokens | null>(null, "identity");
  const [active] = useLocalStorage<AuthTokens | null>(null, "activeIdentity");

  const [used, setUsed] = useAtom(idtAtm);
  const Use = <T>(msg: string, res: T) => {
    return () => {
      setUsed(msg);
      return res;
    };
  };

  useEffect(() => {
    if (used) setTimeout(setUsed, 3000, null);
  }, [used]);
  return {
    trackUse: Use("Read", {
      local: [identity],
      active,
    }),
    trackSent: Use("Send", {
      active,
    }),
    used,
    active,
  };
};
