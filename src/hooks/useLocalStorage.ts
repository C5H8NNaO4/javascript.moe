/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export const useLocalStorage = (initialVal: any, key: string) => {
  let loaded;
  try {
    loaded = JSON.parse(localStorage[key]);
  } catch (e) {
    console.log("Error parsing local storage entry: ", key);
  }
  const [val, setVal] = useState(loaded || initialVal);

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
