import clsx from "clsx";
import { IconButton, IconButtonProps } from "./Button";

export const ToggleButton = (props: IconButtonProps & { active: boolean }) => {
  return (
    <IconButton
      {...props}
      className={clsx("!border-orange-400 border-2", {
        "bg-blue-200/80 hover:!bg-red-500/30": props.active,
        "hover:!bg-green-500/20": !props.active,
      })}
    ></IconButton>
  );
};
