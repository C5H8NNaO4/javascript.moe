/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { Icon } from "./Icon";
import { IconButton } from "./Button";
import { OdorColors } from "@/static/descriptions";
import { Tooltip } from "react-tooltip";
import ReactDOM from "react-dom";

export type Component<T> = T;
export type ChipProps = Component<{
  className?: string;
  label: any;
  icon?: string;
  iconClsn?: string;
  containerClsn?: string;
  containerStyle?: any;
  onRemove?: (ek: React.MouseEvent) => void;
  onClick?: React.MouseEventHandler;
  style?: any;
  tooltip?: string;
  id?: string;
}>;
export const Chip = (props: React.PropsWithChildren<ChipProps>) => {
  const {
    className,
    label,
    icon,
    onRemove,
    iconClsn,
    containerClsn,
    containerStyle,
    tooltip,
    id,
    ...rest
  } = props;
  const Cmp = typeof rest.onClick === "function" ? "button" : "div";
  return (
    <div id={id + "chip"}>
      <Cmp
        {...(rest as any)}
        className={clsx(
          "chip select-none rounded-full border-white/80  h-fit flex gap-1",
          {
            "hover:border-white/100 hover:brightness-105": Cmp === "button",
            "pl-2": !icon,
            "pr-2": !onRemove,
          },
          className
        )}
      >
        <span
          className={clsx("flex gap-1 items-center ", containerClsn)}
          style={containerStyle}
        >
          {icon && (
            <div className="rounded-full bg-white/40 p-1 text-yellow-800/40">
              <Icon
                icon={icon}
                className={clsx(iconClsn ? iconClsn : "h-auto w-auto")}
              ></Icon>
            </div>
          )}
          <span className="label flex">{label}</span>
          {onRemove && (
            <IconButton
              onClick={onRemove}
              icon={"FaX"}
              round
              className="rounded-full bg-red-500/70 !p-[3px] !h-6 !w-6 "
            ></IconButton>
          )}
        </span>
        {rest.children}
      </Cmp>
      {tooltip &&
        ReactDOM.createPortal(
          <Tooltip anchorSelect={"#" + id + "chip"} place="top">
            {tooltip}
          </Tooltip>,
          document.body
        )}
    </div>
  );
};

function getContrastYIQ(hexcolor: string) {
  const r = parseInt(hexcolor.substring(1, 3), 16);
  const g = parseInt(hexcolor.substring(3, 5), 16);
  const b = parseInt(hexcolor.substring(5, 7), 16);
  const a = parseInt(hexcolor.substring(7, 9) || "FF", 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  if (a < 128) return "white";
  return yiq >= 128 ? "black" : "white";
}
export type OdorChipProps = Component<{
  className?: string;
  odor: string;
  onClick?: (e: React.MouseEvent) => void;
  filter?: string[] | null;
  size?: "md" | "sm" | "xs";
}>;
export const OdorChip = (props: OdorChipProps) => {
  const { className, size = "md", odor, filter, onClick } = props;
  const bgColor =
    OdorColors[odor] +
    (OdorColors[odor]?.length < 8
      ? filter?.includes(odor) || !filter?.length
        ? "FF"
        : "33"
      : "");
  return (
    <Chip
      label={odor}
      style={{
        background: bgColor,

        color: getContrastYIQ(bgColor || "#FFFFFF"),
        boxShadow: "0px 0px 3px 2px " + bgColor, //getContrastYIQ(bgColor || "#FFFFFF"),
      }}
      className={clsx(
        "pb-[2px] p-0 ",
        {
          "hover:!border-yellow-400 hover:!shadow-none":
            typeof onClick === "function",
          "!h-6 items-center text-xs": size === "sm",
          "!h-4 items-center text-xs !px-[3px]": size === "xs",
          "text-gray-400": !filter?.includes(odor) && filter?.length,
          "border-yellow-500": filter?.includes(odor),
        },
        className
      )}
      onClick={onClick}
    ></Chip>
  );
};
