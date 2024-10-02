import { Ingredient } from "@/assets/recipes";

export type Variation = {
  title: string;
  ingredients: Ingredient[];
};

export type AboutSectionProps = Partial<{
  text: string;
  title: string;
  bgSrc:
    | string
    | {
        "3xs"?: string;
        "2xs"?: string;
        xs?: string;
        sm?: string;
        def?: string;
      };
  bgAlt: string;
  imgSrc: string;
  imgAlt: string;
  ingredients?: Ingredient[];
  variations?: Variation[];
}>;
