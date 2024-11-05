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
