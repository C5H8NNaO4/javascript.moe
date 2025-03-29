import pa from "libperfumery/dist/static/data/normalized/pa";
import { NormalizedItem } from "libperfumery/dist/types/NormalizedItem";
import { ScrapedPAItem } from "libperfumery/dist/types/ScrapedItem";
import { normalize } from "libperfumery/dist/utils/perfumersApprentice";

export const perfumersApprenticeInventory = pa
  .flat(3)
  .filter((itm: ScrapedPAItem) => itm?.amount && itm?.price)
  .map(normalize) as unknown as NormalizedItem[];
