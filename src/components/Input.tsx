/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { IconButton } from "./Button";
import { Component } from "./Chip";
import { RefObject } from "react";

export type InputProps = Component<{
  value?: string;
  onSubmit?: (v?: string) => void;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent) => void;
  fullWidth?: boolean;
  forwardRef?: RefObject<HTMLInputElement>;
}> &
  React.InputHTMLAttributes<HTMLInputElement>;
export const Input = ({
  value,
  onSubmit,
  placeholder,
  onChange,
  className,
  fullWidth,
  onKeyUp,
  name,
  type,
  checked,
  forwardRef,
  ...rest
}: InputProps) => {
  return (
    <input
      ref={forwardRef}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      checked={checked}
      onKeyUp={(e) => {
        onKeyUp?.(e);
        if (e.key === "Enter") {
          onSubmit?.(value);
        }
      }}
      onChange={onChange}
      className={clsx(
        "p-1 bg-black/40 border-b-2 border-white text-white",
        {
          "w-full flex-1": fullWidth,
        },
        className
      )}
      {...rest}
    />
  );
};

export const ActionInput = ({
  value,
  onChange,
  actionLabel,
  onSubmit,
  className,
  name,
  type,
  children,
  placeholder,
  icon,
  ...rest
}: any) => {
  return (
    <div
      className={clsx("flex m-1 gap-1 justify-between items-center", className)}
    >
      <Input
        name={name}
        placeholder={placeholder}
        fullWidth
        value={value}
        onChange={onChange}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            onSubmit(value);
          }
        }}
        {...rest}
      />
      <IconButton icon={icon} onClick={() => onSubmit(value)} type={type}>
        {actionLabel}
      </IconButton>
      {children}
    </div>
  );
};
