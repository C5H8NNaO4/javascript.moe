import clsx from "clsx";
import { Component } from "./Chip";
import { useEffect, useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AuthTokens } from "@/types/oauth";
import { getNameFromGoogleIDToken } from "@/lib/jwt";
import { Icon } from "./Icon";
import { GoogleLoginButton } from "./oauth/Google";
import { ActionButton } from "./ActionButton";

export type IdentifyOverlayProps = Component<{
  className?: string;
  open?: boolean;
  onClose?: () => void;
}>;
export const IdentifyOverlay = (props: IdentifyOverlayProps) => {
  const { className, open, onClose } = props;
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    ref?.current?.addEventListener("close", () => {
      onClose?.();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key == "Escape") {
        onClose?.();
      }
    });
  }, [ref?.current?.addEventListener, onClose]);
  useEffect(() => {
    if (open) ref?.current?.showModal();
    if (!open) ref?.current?.close();
  }, [open]);

  const [identity] = useLocalStorage<AuthTokens | null>(null, "identity");
  const [active, setActiveID] = useLocalStorage<AuthTokens | null>(
    null,
    "activeIdentity"
  );

  const idIsActive = active?.GOOGLE?.id_token === identity?.GOOGLE?.id_token;
  return (
    <dialog
      ref={ref}
      className={clsx(
        "max-w-screen-2xs w-full h-2/3 z-[10000] bg-black/30 flex justify-center  p-0 outline-none   ",
        {},
        className
      )}
      onClick={onClose}
    >
      <div
        className="flex flex-col w-full items-center backdrop-blur-md"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="shadow w-full h-full border-white rounded-md border-2 flex flex-col">
          <h2 className="bg-white/70 p-2 w-full text-center text-gray-900">
            Identify
          </h2>
          <hr className="bg-white h-[1px] w-full "></hr>
          {identity && (
            <div className="w-full">
              <h3 className="text-white p-1 bg-white/10 ">Local</h3>
              <div
                className={clsx(
                  "p-2 rounded-sm flex flex-row gap-1 items-center w-full",
                  {
                    "bg-white/70": idIsActive,
                    "bg-black/10 text-white": !idIsActive,
                  }
                )}
              >
                <Icon
                  icon={idIsActive ? "FaCheck" : "FaLock"}
                  className={clsx("!h-5 !p-0 !m-0 ", {
                    "!text-green-500":
                      active?.GOOGLE?.id_token === identity?.GOOGLE?.id_token,
                    "!text-gray-300": !active?.GOOGLE?.id_token,
                  })}
                ></Icon>

                {getNameFromGoogleIDToken(identity?.GOOGLE?.id_token)}
                {!idIsActive && (
                  <ActionButton
                    level={1}
                    icon={idIsActive ? "MdLogout" : "MdLogin"}
                    constructive={!idIsActive}
                    className="ml-auto"
                    onConstruct={() => {
                      setActiveID(identity);
                    }}
                    onDestruct={() => {
                      setActiveID(null);
                    }}
                  ></ActionButton>
                )}
              </div>
            </div>
          )}

          <div className="w-full">
            <h3 className="text-white p-1 bg-white/20 ">Obtain</h3>
            <div
              className={clsx(
                "p-2 rounded-sm flex flex-row gap-1 items-center w-full ",
                {
                  "!text-white": idIsActive,
                  "!text-gray-200": !idIsActive,
                  "bg-white/10": active?.GOOGLE?.id_token,
                  "bg-white/40": !active?.GOOGLE?.id_token,
                }
              )}
            >
              <Icon
                icon="FaGoogle"
                className={clsx("!h-5 !p-0 !m-0 ", {
                  "!text-white":
                    active?.GOOGLE?.id_token === identity?.GOOGLE?.id_token,
                  "!text-gray-200": !active?.GOOGLE?.id_token,
                })}
              ></Icon>
              <span className="font-semibold">Google</span>
              <GoogleLoginButton
                scheme="dark"
                id="googleloginButton"
                className="ml-auto"
                // tooltip={
                //   active?.GOOGLE?.id_token
                //     ? "Refresh Identity"
                //     : "Obtain Identity"
                // }
              ></GoogleLoginButton>
            </div>
          </div>

          {active && (
            <div className="w-full mt-auto">
              <h3 className="text-white p-1 bg-white/20 ">Active</h3>
              <div className="p-2 bg-green-500/70 rounded-sm flex flex-row gap-1 items-center w-full">
                <Icon
                  icon="FaGoogle"
                  className={clsx("!h-5 !p-0 !m-0 ", {
                    "!text-black":
                      active?.GOOGLE?.id_token === identity?.GOOGLE?.id_token,
                    "!text-gray-300": !active?.GOOGLE?.id_token,
                  })}
                ></Icon>

                {getNameFromGoogleIDToken(identity?.GOOGLE?.id_token)}
                <ActionButton
                  level={1}
                  icon={idIsActive ? "MdLogout" : "MdLogin"}
                  constructive={!idIsActive}
                  className="ml-auto"
                  onConstruct={() => {
                    setActiveID(identity);
                  }}
                  onDestruct={() => {
                    setActiveID(null);
                  }}
                ></ActionButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};
