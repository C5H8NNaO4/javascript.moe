import lvs from "fast-levenshtein";
import {
  FormulaItem,
  getGrams,
  getPricePerMl,
  getRawPricePerMl,
} from "@/components/Inventory";
import { perfumeIngredientsOdours } from "@/static/descriptions";
import i18next from "i18next";
import { NormalizedItem } from "libperfumery/dist/types/NormalizedItem";

export const getHeight = (container: HTMLElement | null) => {
  if (container === null) return 0;
  return container.getBoundingClientRect().height;
};
export const getVH = (n: number) => {
  return (document.body.getBoundingClientRect().height / 100) * n;
};

export const scrollToTop = () => {
  window.scrollTo({
    top: window.scrollY <= 0 ? document.body.scrollHeight : 0,
    behavior: "smooth",
  });
};

export function getGCD(arr: number[]) {
  const min = Math.min.apply(null, arr);
  let gcd = 1;
  for (let i = gcd + 1; i <= min; i++) {
    if (arr.every((x) => x % i === 0)) gcd = i;
  }
  return gcd;
}

export const convert = (amount: number, from: string, to: string): number => {
  if (from === "g") {
    if (to === "kg") return amount / 1000;
    if (to === "ml") return amount / 0.9;
    if (to === "dr") return (amount / 0.9) * 20;
    if (to === "g") return amount * 1;
  }

  if (from === "kg") {
    if (to === "g") return amount * 1000;
    return convert(amount * 1000, "g", to);
  }

  if (from === "ml") {
    if (to === "g") return amount / 0.9;
    if (to === "kg") return amount / 1000 / 0.9;
    if (to === "dr") return amount * 20;
    if (to === "ml") return amount * 1;
  }

  if (from === "dr") {
    if (to === "kg") return (amount / 1000 / 20) * 0.9;
    if (to === "g") return (amount / 20) * 0.9;
    if (to === "ml") return amount / 20;
    if (to === "dr") return amount * 1;
  }
  return amount;
};
export const toDrops = (amount: string) => {
  if (amount.includes("dr")) return Number(amount.replace("dr", ""));
  if (amount.includes("ml")) return 20 * Number(amount.replace("ml", ""));
  return 1;
};

export const drops2Grams = (drops: number) => {
  return drops * 0.01;
};

export const drops2ml = (drops: number) => {
  return drops / 20;
};

export const round = (number: number) => {
  const min = 2;
  const max = 3;
  return number
    .toFixed(
      Math.min(max, Math.max(min, 1 - Math.round(Math.log(number) / Math.LN10)))
    )
    .replace(/\.00$/, "");
};

export const toggle = (arr: string[], key: string) => {
  if (!arr.includes(key)) return [...arr, key];
  return arr.filter((k) => k !== key);
};

export const totalUsedIngredientAmount =
  (unit: string) => (acc: number, cur: FormulaItem) => {
    return acc + Number(convert(Number(cur.usedAmount), cur.unit || "g", unit));
  };

export const totalIngredientCost = (acc: number, cur: FormulaItem) => {
  return (
    acc +
    getRawPricePerMl(cur) *
      (convert(Number(cur.usedAmount || 0), cur.unit || "g", "g") || NaN)
  );
};
export const totalIngredientCostPerMl = (items: FormulaItem[]) => {
  return (
    items.reduce(totalIngredientCost, 0) /
    items.reduce(totalUsedIngredientAmount("g"), 0)
  );
};

export const findCheapestByTitle = (
  title: string,
  inventory: NormalizedItem[]
) => {
  return inventory
    .filter((invItm) => title === invItm.title && invItm?.size)
    .sort((a, b) => getPricePerMl(a) - getPricePerMl(b))[0];
};

export const findSmallestByTitle = (
  title: string,
  inventory: NormalizedItem[]
) => {
  return inventory
    .filter((invItm) => title === invItm.title && invItm?.size)
    .sort((a, b) => getGrams(a.size) - getGrams(b.size))[0];
};

export const similarity = (a: FormulaItem, ingredients: FormulaItem[]) => {
  // return getRawPricePerMl(b) - getRawPricePerMl(a);
  return (
    (perfumeIngredientsOdours[a?.title]?.filter((o) => {
      return ingredients?.some((ing) =>
        perfumeIngredientsOdours[ing?.title]?.includes(o)
      );
    })?.length || 0) - 1
  );
};

export const trim = (str: string) => str.trim();

export const unique = (arr: string[]) => {
  return [...new Set(arr)];
};

export const randItm = <T>(arr: T[]): T => {
  return arr.at(getRandomInt(0, arr.length - 1))!;
};

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export const formatCurrency = (val: number, currency: string = "USD") => {
  return new Intl.NumberFormat(i18next.language, {
    currency,
    style: "currency",
  }).format(val);
};

export const lngLnk = (strs: TemplateStringsArray, ...vals: string[]) => {
  return (
    "/" +
    i18next.language +
    strs.reduce((acc, node, i) => {
      return acc + node + (vals[i] || "");
    }, "")
  );
};

export const dist = (query: string, target: string) => {
  return lvs.get(query, target.slice(0, query.length));
};
