import {
  FormulaItem,
  getPricePerMl,
} from "@/components/Inventory";
import { perfumeIngredientsOdours } from "@/static/descriptions";

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

export const convert = (amount: number, from: string, to: string) => {
  if (from === 'g') {
    if (to === 'ml') return amount * 5;
    if (to === 'dr') return amount * 100;
    if (to === 'g') return amount * 1;
  }

  if (from === 'ml') {
    if (to === 'g') return amount / 5;
    if (to === 'dr') return amount * 20;
    if (to === 'ml') return amount * 1;
  }

  if (from === 'dr') {
    if (to === 'g') return amount * 0.01;
    if (to === 'ml') return amount / 20;
    if (to === 'dr') return amount * 1;
  }
}
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

export const totalUsedIngredientAmount = (unit: string) => (acc: number, cur: FormulaItem) => {
  return acc + Number(convert(Number(cur.usedAmount), cur.unit || 'g', unit));
};

export const totalIngredientCost = (acc: number, cur: FormulaItem) => {
  return acc + getPricePerMl(cur) * Number(cur.usedAmount);
};

export const similarity = (a: FormulaItem, ingredients: FormulaItem[])  =>  {
  // return getRawPricePerMl(b) - getRawPricePerMl(a);
  return (perfumeIngredientsOdours[a?.title]?.filter((o) => {
    return ingredients?.some(ing =>  perfumeIngredientsOdours[ing?.title]?.includes(o));
  })?.length || 0) - 1;
}