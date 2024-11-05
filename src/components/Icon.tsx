/* eslint-disable @typescript-eslint/no-explicit-any */
import * as FontAwesome from "react-icons/fa";
import * as MUI from "react-icons/md";
import * as LU from "react-icons/lu";
import * as FA7 from "react-icons/fa6";
import * as CG from "react-icons/cg";
export const Icon = ({
  icon,
  ...rest
}: {
  icon: string;
  className?: string;
}) => {
  const Cmp =
    (FontAwesome as any)[icon] ||
    (FA7 as any)[icon] ||
    (MUI as any)[icon] ||
    (LU as any)[icon] ||
    (CG as any)[icon] ||
    MUI.MdQuestionMark;
  return <Cmp color="inherit" {...rest} />;
};
