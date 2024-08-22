import { Ingredient } from "@/pages/ParfumPage";

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
