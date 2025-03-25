import { CurrencySymbol, currencySymbols, Price } from "@/types/Price";

export function destructPrice(priceString: string = ""): Price {
  if (!priceString) throw new Error("Invalid Input");
  // Regular expression to match currency symbols and numbers
  const regex = /^([^\d]+)?([\d.,]+)([^\d]+)?$/;
  const match = priceString.match(regex);

  if (!match) {
    throw new Error("Invalid price format");
  }


  // eslint-disable-next-line prefer-const
  let [, prefix, amount, suffix] = match;
  const currencySymbol = (prefix || suffix) as CurrencySymbol;

  // Remove thousand separators and replace comma with dot for decimal
  amount = amount.replace(/[.,]/g, (m) => (m === "," ? "." : ""));
  const numericValue = parseFloat(amount);

  // Try to determine the currency code
  const currencyCode = currencySymbols[currencySymbol] || "USD";
  // Add more currency symbols as needed

  // Format the numeric value
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return {
    currency: currencySymbol,
    currencyCode,
    price: formatter.format(numericValue),
    numericValue,
  };
}
