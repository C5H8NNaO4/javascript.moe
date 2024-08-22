import { Ingredient } from "@/pages/ParfumPage";

export type AboutSectionProps = Partial<{
  text: string;
  title: string;
  bgSrc: string;
  bgAlt: string;
  imgSrc: string;
  imgAlt: string;
  ingredients?: Ingredient[];
}>;
