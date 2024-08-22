import { Explanation, Ingredient } from "@/pages/ParfumPage";
import { t } from "i18next";

export const WoodyBasePellWall: Explanation = {
  desc: t("WoodyBase"),
  dil: t("NoDilution"),
  vol: t("2ml"),
  com: t("Pellwall"),
};

export const VetiverylAcetat: Explanation = {
  desc: t("VetiverylAcetat"),
  dil: t("10%"),
  vol: t("1dr"),
};

export const ISOESuper: Explanation = {
  desc: t("ISOESuper"),
};

export const Evernyl: Explanation = {
  desc: t("Evernyl"),
};

export const FirBalm: Explanation = {
  desc: t("FirBalm"),
};

export const BetaPinenes: Explanation = {
  desc: t("BetaPinenes"),
};

export const MuskBlend: Explanation = {
  desc: t("MuskBlend"),
};

export const VertofixCoeur: Explanation = {
  desc: t("VertofixCoeur"),
};

export const CleanWood: Explanation = {
  desc: t("CleanWood"),
  com: t("Firmenich"),
};

export const Geosmin: Explanation = {
  desc: t("Geosmin"),
  dil: t("Strong"),
};
export const SylvanDawn: Ingredient[] = [
  {
    amount: "2ml",
    name: "Woody Base",
    company: "Pellwall",
    dilution: null,
    exp: WoodyBasePellWall,
  },
  {
    amount: "1dr",
    name: "Vetiveryl Acetat",
    dilution: 10,
    exp: VetiverylAcetat,
  },
  {
    amount: "2dr",
    name: "Musk Blend",
    dilution: null,
    company: "Pellwall",
    exp: MuskBlend,
  },
  {
    amount: "2dr",
    name: "Evernyl",
    dilution: 10,
    exp: Evernyl,
  },
  {
    amount: "3dr",
    name: "Vertofix Coeur",
    dilution: 10,
    exp: VertofixCoeur,
  },
  {
    amount: "1dr",
    name: "Geosmin",
    dilution: 0.005,
    exp: Geosmin,
  },
];

export const WoodenHeart: Ingredient[] = [
  {
    amount: "2ml",
    name: "Woody Base",
    company: "Pellwall",
    dilution: null,
    exp: WoodyBasePellWall,
  },
  {
    amount: "1dr",
    name: "Vetiveryl Acetat",
    dilution: 10,
    exp: VetiverylAcetat,
  },
  {
    amount: "2dr",
    name: "ISO-E-Super",
    dilution: null,
    exp: ISOESuper,
  },
  {
    amount: "2dr",
    name: "Evernyl",
    dilution: 10,
    exp: Evernyl,
  },
  {
    amount: "1dr",
    name: "Fir Balm",
    dilution: 10,
    exp: FirBalm,
  },
  {
    amount: "1dr",
    name: "beta-Pinenes",
    dilution: 10,
    exp: BetaPinenes,
  },
  {
    amount: "1dr",
    name: "Cleanwood",
    dilution: 10,
    company: "Firmenich",
    exp: CleanWood,
  },
];
