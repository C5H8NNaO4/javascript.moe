import { Item } from "@/components/Inventory";

export const importPlainText = (
  add: (props: Partial<Item>) => void,
  text: string
) => {
  const lines = text
    .split("\n")
    .map((l) => {
      return l?.trim();
    })
    .filter(Boolean);

  lines.forEach((line) => {
    const [size] = /\d+(g|ml)/.exec(line) || [];
    const [, title] = /\s(.+?)(?:\s\d+%)?\s?\d+[$€]$/.exec(line) || [];
    const [, dilution = "100%"] = /\s(\d+%)\s?\d+[$€]/.exec(line) || [];
    const [, price] = /\s(\d+(€|\$))/.exec(line) || [];

    add({
      size,
      quantity: 1,
      title: title?.trim(),
      dilution,
      price,
    });
  });
};
