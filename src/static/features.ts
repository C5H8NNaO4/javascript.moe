export type Feature<Id extends string> = {
  id: Id;
  name?: string;
  type: "static" | "dynamic" | "remote";
  enabled: boolean;
};

export type FeatId<F extends Feature<F["id"] extends string ? F["id"] : "">> =
  F["id"];

export const IngredientDetailLocalChips: Feature<"IngredientDetailLocalChips"> =
  {
    id: "IngredientDetailLocalChips",
    type: "static",
    enabled: false,
  };

export type AllFeats = FeatId<typeof IngredientDetailLocalChips>;
