/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { IconButton } from "./Button";
import { Component } from "./Chip";
import { RefObject, useState } from "react";

export type InputProps = Component<{
  value?: string;
  label?: string;
  onSubmit?: (v?: string) => void;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent) => void;
  fullWidth?: boolean;
  forwardRef?: RefObject<HTMLInputElement>;
  valid?: boolean;
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
  label,
  forwardRef,
  valid,
  ...rest
}: InputProps) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  return (
    <fieldset
      className={clsx({
        "mt-5": label,
      })}
    >
      {label && (
        <label
          htmlFor={"input." + name}
          className={clsx("bg-black/80 p-1 absolute text-sm -top-5 z-10", {
            "text-red-500 font-bold": !valid && hasInteracted,
          })}
        >
          {label}
        </label>
      )}
      <input
        id={"input." + name}
        ref={forwardRef}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        checked={checked}
        onFocus={() => {
          // setHasInteracted(true);
        }}
        onKeyUp={(e) => {
          setHasInteracted(true);
          onKeyUp?.(e);
          if (e.key === "Enter") {
            onSubmit?.(value);
          }
        }}
        onChange={onChange}
        className={clsx(
          "p-1 bg-black/40 border-b-2  text-white mb-1",
          {
            "border-white": valid === true && !hasInteracted,
            "border-red-500": valid === false && hasInteracted,
            "border-green-600": valid && hasInteracted,
            "w-full flex-1": fullWidth,
          },
          className
        )}
        {...rest}
      />
    </fieldset>
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
  actionTooltip,
  ...rest
}: any) => {
  return (
    <div
      className={clsx("flex  gap-1 justify-between items-center te", className)}
    >
      <Input
      id="searchInput"
      className="placeholder-white"
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
      <IconButton id="actionButton" tooltip={actionTooltip} tooltipPlacement="left" icon={icon} onClick={() => onSubmit(value)} type={type}>
        {actionLabel}
      </IconButton>
      {children}
    </div>
  );
};
