import { normalize } from "@/utils/perfumersApprentice";
import OB from "./0B.json";
import CD from "./CD.json";
import EG from "./EG.json";
import HK from "./HK.json";
import LN from "./LN.json";
import OR from "./OR.json";
import SZ from "./SZ.json";
import { Item } from "@/components/Inventory";

export const perfumersApprenticeInventory: Item[] = ([OB, CD, EG, HK, LN, OR, SZ] as unknown as Item[][])
  .flat(3)
  .filter((itm: Item) => itm?.amount && itm?.price)
  .map(normalize) as unknown as Item[]
