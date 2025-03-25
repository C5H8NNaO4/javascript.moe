/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

import { useInput } from "./useInput";
import { Button } from "../components/Button";
import clsx from "clsx";
import { Input } from "../components/Input";

const BasicInput = ({ answer, setAnswer, unlock, forwardRef }: any) => {
  const inputProps = useInput([answer, setAnswer]);

  return (
    <div className="flex flex-row gap-2 items-center">
      <div>
        <Input
          key="input-1"
          forwardRef={forwardRef}
          autoFocus
          type="text"
          {...inputProps}
          onSubmit={unlock}
        />
      </div>
      <Button onClick={unlock}>Ok</Button>
    </div>
  );
};
export const usePrompt = ({ title,text, Component, props = {} }: any, callback: any) => {
  const [answer, setAnswer] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [params, setParams] = useState(null);

  const ref = useRef<HTMLInputElement>();
  useEffect(() => {
    if (isOpen) (ref?.current as HTMLInputElement)?.focus();
  }, [isOpen]);

  const unlock = () => {
    callback?.(true, params);
    setOpen(false);
    setAnswer("");
  };

  const Cmp = Component || BasicInput;
  const overlay = (
    <div
      className={clsx(
        "prompt fixed top-0 h-[100vh] w-[100vw] flex justify-center bg-black/10 items-center z-[100000] backdrop-blur-lg",
        {
          hidden: !isOpen,
        }
      )}
    >
      <div
        className="h-fit w-fit flex flex-col gap-1 bg-black/80 p-4 rounded-md text-white z-50"
        style={{
          boxShadow: "0px 0px 3px 0px white",
        }}
      >
        <h2>{title}</h2>
        <p>{text}</p>
        <Cmp
          {...props}
          params={params}
          confirm={unlock}
          answer={answer}
          setAnswer={setAnswer}
          cancel={() => {
            setAnswer("");
            setOpen(false);
            callback(false, params);
          }}
          unlock={unlock}
          forwardRef={ref}
        />
      </div>
    </div>
  );

  const prompt = (p: any) => {
    setOpen(true);
    setParams(p);
  };

  return {
    overlay,
    isOpen,
    prompt,
  };
};

export const Confirm = (props: {
  confirm: any;
  cancel: any;
  params: any;
}) => {
  return (
    <div className="flex gap-2">
      <Button className="bg-gray-400" onClick={props.cancel}>
        Cancel
      </Button>
      <Button className="bg-red-400" onClick={props.confirm}>
        Ok
      </Button>
    </div>
  );
};
