import clsx from "clsx";
import { Button, IconButton, IconButtonProps, ReactButton } from "./Button";
import ReactDOM from "react-dom";
import { Tooltip } from "react-tooltip";
import { useMemo, useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { Icon } from "./Icon";
import { useIdentity } from "@/lib/hooks/useIdentity";
import { GoogleLoginButton } from "./oauth/Google";

export type ActionButtonProps = ReactButton &
  IconButtonProps & {
    promptTitle?: string;
    promptText?: string;
    renderPrompt?: any;
    round?: boolean;
    needsLogin?: boolean;
    onDestruct?: (confirmed: boolean, props: any) => void;
    onConstruct?: (confirmed: boolean, props: any) => void;
    level?: number;
    params?: any;
    constructive?: boolean;
    confirmTooltip?: string;
  };
export const ActionButton = ({
  className,
  round,
  needsLogin,
  onDestruct,
  onConstruct,
  level = 1,
  params,
  icon,
  constructive,
  tooltipPlacement = "left",
  confirmTooltip,
  promptText,
  promptTitle,
  id,
  ...rest
}: ActionButtonProps) => {
  const Cmp = icon ? IconButton : Button;

  //   const { prompt, overlay } = usePrompt(
  //     { title: promptTitle, text: promptText, Component: renderPrompt },
  //     onDestruct
  //   );
  const ref = useRef<any>();
  useOnClickOutside(ref, (e) => {
    setTimeout(() => {
      setConfirm(false);
    }, 0);
  });
  const { trackUse, active } = useIdentity();
  const identity = useMemo(() => {
    return trackUse();
  }, [active]);
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <Cmp
        {...rest}
        disabled={rest.disabled}
        round={round}
        onClick={() => {
          const fn = constructive ? onConstruct : onDestruct;
          if (level > 1) {
            if (!confirm) setConfirm(true);
          } else if (level === 1) {
            fn?.(true, params);
          }
        }}
        icon={icon ? icon : undefined}
        className={clsx(
          {
            "bg-red-400/70 hover:!bg-red-600/70": level === 1 && !constructive,
            "bg-red-500/70 hover:!bg-red-700/70": level === 2 && !constructive,
            "bg-green-400/70 hover:!bg-green-600/70":
              level === 1 && constructive,
            "bg-green-500/70 hover:!bg-green-700/70":
              level === 2 && constructive,
            "blur-[1px]": confirm,
            "disabled:bg-red-500/40 hover:disabled:!bg-red-700/40":
              confirm && level === 2 && !constructive,
          },
          "relative",
          "overflow-hidden group",
          className
        )}
        id={id + "confirmButton" + confirm}
        tooltipPlacement={tooltipPlacement}
        tooltip={confirm ? confirmTooltip || "" : rest.tooltip}
      >
        {rest.children}
        {needsLogin && !identity?.active?.GOOGLE?.id_token && (
          <div
            className="hidden pointer-events-none group-hover:flex absolute w-full h-full bg-red-500/40 -ml-1  items-center justify-center "
            id={id + "lock"}
          >
            <Icon icon="FaLock" className="ml-2 !mr-3 h-fit w-fit "></Icon>
          </div>
        )}
      </Cmp>

      {needsLogin &&
        !identity?.active?.GOOGLE?.id_token &&
        ReactDOM.createPortal(
          <Tooltip anchorSelect={`#${id}confirmButton`} place="right" clickable>
            <span className="flex gap-2 items-center font-bold text-base">
              <GoogleLoginButton className="h-4 w-4"></GoogleLoginButton>
              Login Required
            </span>
          </Tooltip>,
          document.body
        )}
      {level === 2 &&
        confirm &&
        ReactDOM.createPortal(
          <Tooltip
            anchorSelect={`#${id}confirmButton${confirm}`}
            isOpen={level === 2 && confirm}
            clickable
            place={tooltipPlacement}
          >
            <span className="flex gap-2 items-center text-base w-fit" ref={ref}>
              <div className="flex flex-col text-end  ">
                <span className="font-semibold w-full">{promptTitle}</span>
                <span className="italic  ml-auto">{promptText}</span>
              </div>
              <IconButton
                icon="FaCheck"
                className="bg-green-400"
                onClick={async () => {
                  const fn = constructive ? onConstruct : onDestruct;
                  fn?.(true, params);
                  setConfirm(false);
                }}
              ></IconButton>
            </span>
          </Tooltip>,
          document.body
        )}
    </>
  );
};
