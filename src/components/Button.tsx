/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { Icon } from "./Icon";
import ReactDOM from "react-dom";
import { useRef, useState } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { PlacesType, Tooltip } from "react-tooltip";


export type ButtonProps = {
  tooltip?: string;
  variant?: string;
  allowDisabledClick?: boolean;
  onDisabledClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  tooltipPlacement?: PlacesType;
};
export type ReactButton = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonProps 

export const Button = ({
  className,
  children,
  onClick,
  tooltip,
  variant,
  allowDisabledClick,
  onDisabledClick,
  disabled,
  id,
  tooltipPlacement,
  ...rest
}: ReactButton) => {
  return (
    <>
      <button
        id={id}
        title={rest.title}
        onClick={(e) => {
          if (disabled && allowDisabledClick) {
            onDisabledClick?.(e);
          } else {
            onClick?.(e);
          }
        }}
        className={clsx(
          "select-none p-1 rounded-sm shadow-sm text-white flex items-center w-max h-max leading-[1rem]",
          "bg-black/20 hover:bg-white/40",
          "backdrop-blur-[2px]",
          "disabled:bg-gray-500 disabled:hover:!bg-gray-500 disabled:hover:!brightness-100 disabled:text-black-400",
          className,
          "hover:border-[1.5px]",
          {
            "bg-gray-500 cursor-default": disabled && allowDisabledClick,
            "border-[1.5px]": true,
            "border-black": variant === "noborder",
            "border-white/50": 1,
            "hover:border-white/70": 1,
          }
        )}
        {...rest}
        disabled={!allowDisabledClick && disabled}
      >
        {children}
      </button>
      {ReactDOM.createPortal(
        <Tooltip
          anchorSelect={"#" + id}
          place={tooltipPlacement}
          className="z-[10000]"
        >
          {tooltip}
        </Tooltip>,
        document.querySelector("dialog[open]") || document.body
      )}
    </>
  );
};

export type IconButtonProps = ReactButton & {
  round?: boolean;
  icon?: string;
  iconClsn?: string;
  allowDisabledClick?: boolean;
};
export const IconButton = ({
  className,
  iconClsn = "p-[4px]",
  round,
  tooltip,
  icon,
  allowDisabledClick,
  onDisabledClick,
  ...rest
}: IconButtonProps) => {
  return (
    <Button
      className={clsx(
        "IconButton",
        " flex items-center justify-center w-full  disabled:text-gray-400",
        className,
        {
          "text-gray-400": rest.disabled,
          "!rounded-[200px]": round,
        }
        // "!m-0"
      )}
      tooltip={tooltip}
      {...rest}
      disabled={rest.disabled}
      allowDisabledClick={allowDisabledClick}
      onDisabledClick={onDisabledClick}
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