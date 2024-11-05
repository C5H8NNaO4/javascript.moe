import clsx from "clsx";
import { PropsWithChildren } from "react";

export type ListProps = PropsWithChildren<{
  className?: string;
}>;
export const List = (props: ListProps) => {
  const { className, children } = props;
  return <ul className={clsx("", {}, className)}>{children}</ul>;
};

export type ListItemProps = PropsWithChildren<{
  className?: string;
}> & React.HTMLProps<HTMLLIElement>;
export const ListItem = (props: ListItemProps) => {
  const { className, children, ...rest } = props;
  return <li {...rest} className={clsx("", {}, className)} >{children}</li>;
};
