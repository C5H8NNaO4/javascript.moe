/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { Confirm, usePrompt } from "../hooks/usePrompt";
import { Icon } from "./Icon";
import ReactDOM from "react-dom";
import { useRef, useState } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";

export type ButtonProps = {
  tooltip?: string;
  variant?: string;
};
export type ReactButton = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonProps;

export const Button = ({
  className,
  children,
  onClick,
  tooltip,
  variant,
  ...rest
}: ReactButton) => {
  return (
    <button
      title={tooltip}
      onClick={onClick}
      className={clsx(
        "select-none p-1 rounded-sm shadow-sm text-white flex items-center w-max h-max leading-[1rem]",
        "bg-black/20 hover:bg-white/40",
        "backdrop-blur-[2px]",
        "disabled:bg-gray-500 disabled:hover:!bg-gray-500 disabled:hover:!brightness-100 disabled:text-black-400",
        className,
        "hover:border-[1.5px]",
        {
          "border-[1.5px]": true,
          "border-black": variant === "noborder",
          "border-white/50": 1,
          "hover:border-white/70": 1,
        }
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export type IconButtonProps = ReactButton & { round?: boolean; icon?: string, iconClsn?: string};
export const IconButton = ({
  className,
  iconClsn = "p-[4px]",
  round,
  tooltip,
  icon,
  ...rest
}: IconButtonProps) => {
  return (
    <Button
      className={clsx(
        "IconButton",
        " flex items-center justify-center w-full  disabled:text-gray-400",
        className,
        {
          "!rounded-[200px]": round,
        }
        // "!m-0"
      )}
      tooltip={tooltip}
      {...rest}
    >
      {icon && <Icon className={clsx(iconClsn, " w-fit h-fit")} icon={icon} />}
      {rest.children}
    </Button>
  );
};

export const MenuButton = ({
  className,
  tooltip,
  icon,
  ...rest
}: IconButtonProps) => {
  const [menuOpen, setMenuOpen] = useState<number[] | null>(null);
  const [x, y] = menuOpen || [0, 0];
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    setMenuOpen(null);
  });
  return (
    <div>
      <div ref={ref}>
        <Button
          onClick={() => {
            const { x, y, width } = ref.current?.getBoundingClientRect() || {
              x: 0,
              y: 0,
              width: 0,
            };
            setMenuOpen([x + width - 8, y]);
          }}
          className={clsx("relative", className)}
          tooltip={tooltip}
          {...rest}
        >
          {icon && <Icon icon={icon} />}
        </Button>
      </div>
      {ReactDOM.createPortal(
        <div
          className={clsx(
            "absolute bottom-[100%] z-[4000] w-[100px] h-[100px]",
            {
              hidden: !menuOpen,
            }
          )}
          style={{
            left: x - 48,
            top: y,
          }}
        >
          {rest.children}
        </div>,
        document.body
      )}
    </div>
  );
};

export type DestructiveButtonProps = ReactButton &
  IconButtonProps & {
    promptTitle?: string;
    promptText?: string;
    renderPrompt?: any;
    round?: boolean;
    onDestruct?: (confirmed: boolean, props: any) => void;
    level?: number;
    params?: any;
  };
export const DestructiveButton = ({
  className,
  round,
  promptTitle,
  promptText,
  renderPrompt = Confirm,
  onDestruct,
  level = 1,
  params,
  icon,
  ...rest
}: DestructiveButtonProps) => {
  const Cmp = icon ? IconButton : Button;

  const { prompt, overlay } = usePrompt(
    { title: promptTitle, text: promptText, Component: renderPrompt },
    onDestruct
  );
  return (
    <div>
      {ReactDOM.createPortal(
        overlay,
        document.getElementById("root") || document.body
      )}
      <Cmp
        {...rest}
        round={round}
        onClick={() => {
          level === 1
            ? onDestruct?.(true, params)
            : level > 1
            ? prompt(params)
            : null;
        }}
        icon={icon ? icon : undefined}
        className={clsx(
          {
            "bg-red-400/70 hover:!bg-red-600/70": level === 1,
            "bg-red-500/70 hover:!bg-red-700/70": level === 2,
          },
          className
        )}
      ></Cmp>
    </div>
  );
};
