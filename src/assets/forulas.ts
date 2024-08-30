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

export const CedarWood: Explanation = {
  desc: t("CedarWood"),
};

export const Sandalwood: Explanation = {
  desc: t("Sandalwood"),
};

export const ISOESuper: Explanation = {
  desc: t("ISOESuper"),
};

export const Timbersilk: Explanation = {
  desc: t("Timbersilk"),
};

export const OlibanumOil: Explanation = {
  desc: t("OlibanumOil"),
};

export const Evernyl: Explanation = {
  desc: t("Evernyl"),
};

export const Myrrh: Explanation = {
  desc: t("Myrrh"),
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

export const Ambroxan: Explanation = {
  desc: t("Ambroxan"),
};

export const VertofixCoeur: Explanation = {
  desc: t("VertofixCoeur"),
};

export const ClearWood: Explanation = {
  desc: t("ClearWood"),
  com: t("Firmenich"),
};

export const Patchouli: Explanation = {
  desc: t("Patchouli"),
  com: t("Firmenich"),
};

export const Geosmin: Explanation = {
  desc: t("Geosmin"),
  dil: t("Strong"),
};

export const Lavender: Explanation = {
  desc: t("Lavender"),
};
export const Dimetol: Explanation = {
  desc: t("Dimetol"),
};

export const Silvial: Explanation = {
  desc: t("Silvial"),
};
export const PADMA: Explanation = {
  desc: t("PADMA"),
};

export const Ozofleur: Explanation = {
  desc: t("Ozofleur"),
};

export const Helional: Explanation = {
  desc: t("Helional"),
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
    name: "Clearwood",
    dilution: 10,
    company: "Firmenich",
    exp: ClearWood,
  },
];

export const WoodenAmberHeart: Ingredient[] = [
  {
    amount: "+1dr",
    name: "Timbersilk",
    dilution: 10,
    exp: Timbersilk,
  },
];

export const AllIngredients: Ingredient[] = [
  {
    amount: "2ml",
    name: "Woody Base",
    company: "Pellwall",
    dilution: null,
    exp: WoodyBasePellWall,
    odour: ["woody", "cedar"],
  },
  {
    amount: "1dr",
    name: "ISO-E-Super",
    dilution: null,
    exp: ISOESuper,
    odour: ["velvety", "woody", "dry", "ambery", "old-wood", "lemony"],
  },
  {
    amount: "1dr",
    name: "Vetiveryl Acetat",
    dilution: null,
    exp: VetiverylAcetat,
    odour: ["sweet", "woody", "fresh", "dry"],
  },
  {
    amount: "1dr",
    name: "Clearwood",
    dilution: 10,
    company: "Firmenich",
    exp: ClearWood,
    odour: ["woody", "dry", "fresh", "earthy", "patchouli"],
  },
  {
    amount: "1dr",
    name: "Patchouli EO",
    dilution: 10,
    company: "Firmenich",
    exp: Patchouli,
    odour: ["patchouli", "earthy", "woody", "musky", "sweet", "slightly spicy"],
  },
  {
    amount: "1dr",
    name: "Fir Balm",
    dilution: 10,
    exp: FirBalm,
    odour: ["pine needle", "green", "resinous", "lemony"],
  },
  {
    amount: "1dr",
    name: "beta-Pinenes",
    dilution: 10,
    exp: BetaPinenes,
    odour: ["pine needle", "green", "aquatic", "woody"],
  },
  {
    amount: "1dr",
    name: "Cedarwood EO",
    dilution: 10,
    exp: CedarWood,
    odour: ["cedar", "woody", "balsamic", "slightly sweet", "dry", "earthy"],
  },
  {
    amount: "1dr",
    name: "Sandalwood EO",
    dilution: 10,
    exp: Sandalwood,
    odour: ["creamy", "woody", "warm", "sweet", "slightly spicy"],
  },
  {
    amount: "1dr",
    name: "Myrrh EO",
    dilution: 10,
    exp: Evernyl,
    odour: ["warm", "resinous", "balsamic", "earthy", "slightly spicy"],
  },
  {
    amount: "1dr",
    name: "Olibanum Oil",
    dilution: 10,
    exp: OlibanumOil,
    odour: ["resinous", "fresh", "citrusy", "woody", "slightly spicy"],
  },
  {
    amount: "2dr",
    name: "Musk Blend",
    dilution: null,
    company: "Pellwall",
    exp: MuskBlend,
    odour: ["musk", "animalic"],
  },
  {
    amount: "1dr",
    name: "Ambroxan",
    dilution: null,
    company: "Pellwall",
    exp: Ambroxan,
    odour: ["woody", "ambery", "musky", "animalic", "warm", "slightly sweet"],
  },
  {
    amount: "1dr",
    name: "Evernyl",
    dilution: 20,
    exp: Evernyl,
    odour: ["mossy", "oakmoss", "woody", "phenolic", "earthy", "deep"],
  },
  {
    amount: "2dr",
    name: "Vertofix Coeur",
    dilution: 10,
    exp: VertofixCoeur,
    odour: ["woody", "ambery", "dry", "slightly sweet", "resinous", "deep"],
  },
  {
    amount: "1dr",
    name: "Helional",
    dilution: 1,
    exp: Helional,
    odour: ["fresh", "green", "aquatic", "floral", "aldehydic", "hay"],
  },
  {
    amount: "1dr",
    name: "Geosmin",
    dilution: 0.01,
    exp: Geosmin,
    odour: ["petrichor", "wet", "earthy", "aquatic"],
  },
  {
    amount: "1dr",
    name: "Lavender EO",
    dilution: 10,
    exp: Lavender,
    odour: ["fresh", "herbal", "floral", "slightly woody", "camphorous"],
  },
  {
    amount: "1dr",
    name: "Ozofleur",
    dilution: 1,
    exp: Ozofleur,
    odour: ["fresh", "airy", "ozonic", "aquatic", "slightly floral"],
  },
  {
    amount: "1dr",
    name: "PADMA",
    dilution: 1,
    exp: PADMA,
    odour: ["herbal", "woody", "green", "slightly spicy"],
  },
  {
    amount: "1dr",
    name: "Dimetol",
    dilution: 1,
    exp: Dimetol,
    odour: ["fresh", "green", "citrusy", "slightly floral"],
  },
  {
    amount: "1dr",
    name: "Silvial",
    dilution: 1,
    exp: Silvial,
    odour: ["marine", "fresh", "woody", "slightly green"],
  },
];
