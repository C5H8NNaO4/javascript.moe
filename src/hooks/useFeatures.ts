import { AllFeats, IngredientDetailLocalChips } from "@/static/features";

const features = [IngredientDetailLocalChips];
export const useFeatures = (): Record<AllFeats, boolean> => {
  return features.reduce((acc, feat) => {
    return { ...acc, [feat.id]: feat.enabled };
  }, {} as Record<AllFeats, boolean>);
};
