/* eslint-disable @typescript-eslint/no-explicit-any */
import * as FontAwesome from "react-icons/fa";
import * as MUI from "react-icons/md";
import * as LU from "react-icons/lu";
import * as FA7 from "react-icons/fa6";
import * as CG from "react-icons/cg";
import * as TB from "react-icons/tb";
import * as GI from "react-icons/gi";
import * as IO5 from "react-icons/io5";
import * as IO from "react-icons/io";
import clsx from "clsx";

export const Icon = ({
  icon,
  children,
  ...rest
}: React.PropsWithChildren<{
  icon: string;
  className?: string;
}>) => {
  const Cmp =
    (FontAwesome as any)[icon] ||
    (FA7 as any)[icon] ||
    (MUI as any)[icon] ||
    (LU as any)[icon] ||
    (CG as any)[icon] ||
    (TB as any)[icon] ||
    (GI as any)[icon] ||
    (IO5 as any)[icon] ||
    (IO as any)[icon] ||
    MUI.MdQuestionMark;
  return (
    <span className={clsx("relative inline-block h-fit w-fit flex justify-center items-center")}>
      <Cmp color="inherit" {...rest} />
      <span className="absolute">
        {children}
      </span>
    </span>
  );
};
