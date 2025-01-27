/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
const atoms = {} as Record<string, any>;
import { atom, useAtom } from "jotai";

export const useLocalStorage = <T>(
  initialVal: T,
  key: string
): [T, (v: T) => void] => {
  let loaded = initialVal;
  try {
    loaded = JSON.parse(localStorage[key]);
  } catch (e) {
    console.log("Error parsing local storage entry: ", key);
  }
  if (!atoms[key]) atoms[key] = atom(loaded || initialVal);

  const atm = atoms[key];
  const [val, setVal] = useAtom<T>(atm);
  useEffect(() => {
    try {
      setVal(JSON.parse(localStorage[key]));
    } catch (e) {
      console.log("Error parsing local storage entry: ", key);
    }
  }, []);

  const update = (val: any) => {
    localStorage[key] = JSON.stringify(val);
    setVal(val);
  };
  return [val, update];
};
