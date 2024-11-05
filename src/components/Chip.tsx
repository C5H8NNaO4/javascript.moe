/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { Icon } from "./Icon";
import { IconButton } from "./Button";
import { OdorColors } from "@/static/descriptions";
export type Component<T> = T;
export type ChipProps = Component<{
  className?: string;
  label: string;
  icon?: string;
  iconClsn?: string;
  containerClsn?: string;
  containerStyle?: any;
  onRemove?: (ek: React.MouseEvent) => void;
}> &
  React.HTMLProps<HTMLButtonElement>;
export const Chip = (props: ChipProps) => {
  const {
    className,
    label,
    icon,
    onRemove,
    iconClsn,
    containerClsn,
    containerStyle,
    
    ...rest
  } = props;
  return (
    <button
      {...rest as any}
      className={clsx(
        "chip select-none rounded-full border-white/80 hover:border-white/100 hover:brightness-105 h-fit flex gap-1",
        {
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
    </button>
  );
};

function getContrastYIQ(hexcolor: string) {
  const r = parseInt(hexcolor.substring(1, 3), 16);
  const g = parseInt(hexcolor.substring(3, 5), 16);
  const b = parseInt(hexcolor.substring(5, 7), 16);
  const a = parseInt(hexcolor.substring( 7,9) || 'FF', 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  if (a < 128) return "white";
  return yiq >= 128 ? "black" : "white";
}
export type OdorChipProps = Component<{
  className?: string;
  odor: string;
  onClick?: (e: React.MouseEvent) => void;
  filter?: string[];
}>;
export const OdorChip = (props: OdorChipProps) => {
  const { className, odor, filter, onClick } = props;
  const bgColor = OdorColors[odor] +
  (OdorColors[odor]?.length < 8
    ? filter?.includes(odor) || !filter?.length
      ? "FF"
      : "33"
    : "");
  return (
    <Chip
      label={odor}
      style={{
        background:bgColor,
          
        color: getContrastYIQ(bgColor || '#FFFFFF'),
      }}
      className={clsx(
        "pb-[2px] border-[1.7px]",
        {
          "text-gray-400": !filter?.includes(odor) && filter?.length,
          "border-yellow-500": filter?.includes(odor),
        },
        className
      )}
      onClick={(e) => {
        onClick?.(e);
      }}
    ></Chip>
  );
};
