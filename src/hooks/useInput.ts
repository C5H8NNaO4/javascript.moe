/* eslint-disable @typescript-eslint/no-explicit-any */

export const useInput = ([value, setValue]: [any, (v: any) => void]) => {
  return {
    value,
    onChange: (e: React.ChangeEvent) => {
      setValue((e.target as HTMLInputElement).value);
    },
  };
};
