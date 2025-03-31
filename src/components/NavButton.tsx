import clsx from "clsx";
import { IconButton, IconButtonProps } from "./Button";
import { Icon } from "./Icon";

export const NavButton = (props: IconButtonProps & { internal?: boolean }) => {
  const { internal, className } = props;
  return (
    <IconButton
      {...props}
      className={clsx(
        " border-2 overflow-hidden group",
        {
          "hover:!bg-blue-200/70": 1,
          "!border-internal-400": 1,
        },
        className
      )}
    >
      {props.children}

      <div
        className={clsx(
          "bg-sky-600/55 absolute  h-8 w-8 flex justify-center items-center z-20",
          {
            "rotate-45 -bottom-4 -left-4": internal,
            "rotate-45 -top-4 -right-4": !internal,
          }
        )}
      >
        <Icon
          icon={internal ? "CgInternal" : "FaExternalLinkAlt"}
          className={clsx("h-3 w-3 m-1  absolute  group-hover:!text-white/80", {
            "rotate-0 !bottom-[-0px]": internal,
            "-rotate-0 !top-[0px] h-3 w-3  p-[2px]": !internal,
          })}
        ></Icon>
      </div>
    </IconButton>
  );
};
