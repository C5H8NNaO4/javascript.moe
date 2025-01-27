import clsx from "clsx";
import { Button, IconButton, IconButtonProps, ReactButton } from "./Button";
import { Confirm } from "@/hooks/usePrompt";
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
  };
export const ActionButton = ({
  className,
  round,
  promptTitle,
  promptText,
  renderPrompt = Confirm,
  needsLogin,
  onDestruct,
  onConstruct,
  level = 1,
  params,
  icon,
  constructive,
  tooltipPlacement = "left",
  id,
  ...rest
}: ActionButtonProps) => {
  const Cmp = icon ? IconButton : Button;

  //   const { prompt, overlay } = usePrompt(
  //     { title: promptTitle, text: promptText, Component: renderPrompt },
  //     onDestruct
  //   );
  const ref = useRef<any>();
  useOnClickOutside(ref, () => {
    setConirm(false);
  });
  const { trackUse, active } = useIdentity();
  const identity = useMemo(() => {
    return trackUse();
  }, [active]);
  const [confirm, setConirm] = useState(false);
  return (
    <>
      <Cmp
        {...rest}
        disabled={confirm || rest.disabled}
        round={round}
        onClick={() => {
          const fn = constructive ? onConstruct : onDestruct;
          if (level > 1) {
            setConirm(true);
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
            "blur-sm": confirm,
          },
          "relative",
          "overflow-hidden group",
          className
        )}
        id="confirmButton"
      >
        {rest.children}
        {needsLogin &&
        !identity?.active?.GOOGLE?.id_token && (
          <div
            className="hidden pointer-events-none group-hover:flex absolute w-full h-full bg-red-500/40 -ml-1  items-center justify-center "
            id={id + "lock"}
          >
            <Icon icon="FaLock" className="ml-2 !mr-3 h-fit w-fit "></Icon>
          </div>
        )}
      </Cmp>
      {ReactDOM.createPortal(
        <Tooltip
          anchorSelect="#confirmButton"
          isOpen={confirm}
          clickable
          place={tooltipPlacement}
        >
          <span
            ref={ref}
            className="flex gap-2 items-center font-bold text-base"
          >
            Confirm
            <IconButton icon="FaCheck" className="bg-green-400"></IconButton>
          </span>
        </Tooltip>,
        document.body
      )}

      {needsLogin &&
        !identity?.active?.GOOGLE?.id_token &&
        ReactDOM.createPortal(
          <Tooltip anchorSelect="#confirmButton" place="right" clickable>
            <span className="flex gap-2 items-center font-bold text-base">
              <GoogleLoginButton  className="h-4 w-4"></GoogleLoginButton>
              Login Required
            </span>
          </Tooltip>,
          document.body
        )}
    </>
  );
};
