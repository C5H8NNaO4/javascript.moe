import { NormalizedItem } from "libperfumery/dist/types/NormalizedItem";

const map = {
  "Pinene alpha": "Alpha Pinene",
  "Pinene beta": "Beta Pinene",
  "Ionone alpha": "Alpha Ionone",
  "alpha-Humulene": "Alpha Humulene",
} as any;

export const normalize = (itm: NormalizedItem): NormalizedItem => {
  if (map[itm.title]) itm.title = map[itm.title];
  return itm;
};
