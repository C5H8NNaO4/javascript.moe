import { useLocalStorage } from "@/hooks/useLocalStorage";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const idtAtm = atom<string | null>(null);
export const useIdentity = () => {
  const [identity] = useLocalStorage(null, "identity");
  const [active] = useLocalStorage(null, "activeIdentity");

  const [used, setUsed] = useAtom(idtAtm);
  const Use = (msg: string, res: any) => {
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
    trackSent: Use("Send", null),
    used,
  };
};
