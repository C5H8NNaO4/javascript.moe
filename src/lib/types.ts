import { Ingredient } from "@/assets/recipes";

export type Variation = {
  title: string;
  ingredients: Ingredient[];
};

export type AboutSectionProps = Partial<{
  text: string;
  title: string;
  bgSrc: string;
  bgAlt: string;
  imgSrc: string;
  imgAlt: string;
  ingredients?: Ingredient[];
  variations?: Variation[];
}>;
