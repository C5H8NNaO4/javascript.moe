import clsx from "clsx";
import { Component } from "./Chip";
import { Icon } from "./Icon";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getNameFromGoogleIDToken } from "@/lib/jwt";
import { AuthTokens } from "@/types/oauth";
import { IdentifiedName } from "./Text";

export type IdentifyItemProps = Component<{
  className?: string;
  disabled?: string;
}>;
export const IdentifyItem = (props: IdentifyItemProps) => {
  const { className } = props;
  const [identity] = useLocalStorage<AuthTokens | null>(null, "identity");
  if (identity && getNameFromGoogleIDToken(identity?.GOOGLE?.id_token))
    return (
      <div className="flex gap-1 relative">
        <Icon
          icon="FaFingerprint"
          className="!h-5 !p-0 !m-0 !text-green-500"
        ></Icon>
        <IdentifiedName></IdentifiedName>
        <Icon
          icon="FaUnlock"
          className="!h-5 !p-0 w-5 !text-gray-200 ml-[-1rem] translate-x-8"

        ></Icon>
      </div>
    );
  return (
    <div className={clsx("", {}, className)}>
      <div className="flex flex-row gap-1 !p-0">
        <Icon icon="FaGoogle" className="!h-5 !p-0 !m-0 !text-green-500"></Icon>
        <span className="group-hover:font-bold font-semibold">Identify</span>
      </div>
    </div>
  );
};
