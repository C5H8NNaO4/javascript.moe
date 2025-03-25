export const currencySymbols = {
  "£": "GBP",
  $: "USD",
  "€": "EUR",
};

export type Currencies = typeof currencySymbols;
export type CurrencySymbol = keyof Currencies;
export type Price<T extends CurrencySymbol = CurrencySymbol> = {
  price: string;
  currency: T;
  currencyCode: Currencies[T];
  numericValue: number;
};
