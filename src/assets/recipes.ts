import { t } from "i18next";

// Define Explanation type
export type Explanation = {
  desc: string;
  dil?: string;
  vol?: string;
  com?: string;
  subst?: string;
};

// Define Ingredient type
export type Ingredient = {
  amount: string;
  name: string;
  dilution: number | null;
  company?: string;
  exp: Explanation;
  odour?: string[];
  harmonic?: string[];
  effects?: Effect[];
  disharmonic?: string[];
  evaporationRate: number; // Added evaporationRate
  relativeStrength?: number;
  dilutant?: boolean;
};

export type Accord = {
  relativeHarmony: number;
  dopaRelease?: number;
  seroRelease?: number;
  ingredients: Ingredient[];
};

export enum EffectTypes {
  Boost = "boost",
  Soak = "soak",
  Blend = "blend",
  Fix = "fix",
  Project = "project",
  Couple = "couple",
}

export enum Notes {
  Top = 4,
  Heart = 2,
  Bottom = 1,
  All = 7,
}

export type Effect = {
  type: EffectTypes;
  relativeStrength: number;
  affects: Notes;
};

export const ISOESuperEffect: Effect[] = [
  { type: EffectTypes.Boost, affects: Notes.All, relativeStrength: 1.2 },
  { type: EffectTypes.Soak, affects: Notes.All, relativeStrength: 0.7 },
  { type: EffectTypes.Blend, affects: Notes.All, relativeStrength: 0.2 },
  { type: EffectTypes.Fix, affects: Notes.All, relativeStrength: 1.5 },
];
// Define types for ingredient options
interface IngredientOptions {
  dilution: number | null; // Allow dilution to be number or null
  amount?: string;
  [key: string]: any; // Allow additional options
}

// Helper function for evaporation rates
const evaporationRates: Record<string, number> = {
  Amarocit: 480,
  Cis3Hexenol: 180,
  Hedione: 480,
  Sylvamber: 24 * 60,
  EthylVanillin: 24 * 60,
  WoodyBase: 24 * 60, // Woody base lasts up to 12 hours (720 minutes)
  VetiverylAcetat: 8 * 60, // Vetiveryl Acetate lasts around 8 hours (480 minutes)
  CedarWood: 6 * 60, // Cedarwood lasts around 6 hours (360 minutes)
  Sandalwood: 8 * 60, // Sandalwood lasts up to 8 hours (480 minutes)
  ISOESuper: 48 * 60, // ISO E Super lasts up to 48 hours (2880 minutes)
  Timbersilk: 48 * 60, // Timbersilk is similar to ISO E Super (2880 minutes)
  OlibanumOil: 4 * 60, // Olibanum (Frankincense) lasts around 4 hours (240 minutes)
  Evernyl: 24 * 60, // Evernyl lasts up to 24 hours (1440 minutes)
  Myrrh: 6 * 60, // Myrrh lasts around 6 hours (360 minutes)
  FirBalm: 4 * 60, // Fir Balm lasts around 4 hours (240 minutes)
  BetaPinenes: 4 * 60, // Beta Pinenes last around 4 hours (240 minutes)
  MuskBlend: 72 * 60, // Musks can last for up to 72 hours (4320 minutes)
  Ambroxan: 48 * 60, // Ambroxan is highly persistent, lasting around 48 hours (2880 minutes)
  VertofixCoeur: 24 * 60, // Vertofix Coeur lasts around 24 hours (1440 minutes)
  ClearWood: 12 * 60, // Clearwood® lasts up to 12 hours (720 minutes)
  Patchouli: 24 * 60, // Patchouli lasts up to 24 hours (1440 minutes)
  Geosmin: 8 * 60, // Geosmin lasts around 8 hours (480 minutes)
  Lavender: 4 * 60, // Lavender lasts around 4 hours (240 minutes)
  Dimetol: 2 * 60, // Dimetol lasts around 2 hours (120 minutes)
  Silvial: 6 * 60, // Silvial lasts around 6 hours (360 minutes)
  PADMA: 4 * 60, // PADMA lasts around 4 hours (240 minutes)
  Ozofleur: 4 * 60, // Ozofleur lasts around 4 hours (240 minutes)
  Helional: 8 * 60, // Helional lasts around 8 hours (480 minutes)
  OrangeFlowerAbsolute: 6 * 60, // Orange Flower Absolute lasts around 6 hours (360 minutes)
  LavenderAbsolute: 6 * 60, // Lavender Absolute lasts around 6 hours (360 minutes)
  PinoAcetaldehyde: 60, // ~1 hour (estimated based on aldehydic volatility)
  NeroliEO: 1.5 * 60,
  Terrasol: 24 * 60,
};

// Explanation objects
const explanations: Record<string, Explanation> = {
  OrangeFlowerBlend: {
    desc: t(
      "Orange Flower Blend is a carefully crafted substitute for Orange Flower Absolute, offering a rich floral and citrusy profile with hints of sweetness. Designed to mimic the characteristics of Orange Flower Absolute at a more affordable cost."
    ),
    dil: t("10%"),
    vol: t("1dr"),
    com: t("Various Suppliers"),
    subst: t(
      "This blend offers similar substantivity to Orange Flower Absolute, with a lasting floral and sweet citrus presence for several hours, but with a slightly quicker drydown on a blotter."
    ),
  },
  Amarocit: {
    desc: t(
      "Amarocit is a bitter woody material with amber facets, often used to enhance the bitter character in woody or ambery accords."
    ),
    dil: t("10%"),
    vol: t("1dr"),
    com: t("Various Suppliers"),
    subst: t(
      "Amarocit has moderate substantivity, with its bitter-woody notes persisting for several hours on a blotter."
    ),
  },
  Cis3Hexenol: {
    desc: t(
      "cis-3-Hexenol is a powerful green, grassy, and fresh material, often associated with the scent of freshly cut grass or crushed leaves."
    ),
    dil: t("0.1%"),
    vol: t("Strong"),
    com: t("Various Suppliers"),
    subst: t(
      "cis-3-Hexenol has low substantivity, typically lasting a few hours on a blotter. It provides a sharp, fresh, green note that fades relatively quickly."
    ),
  },
  Hedione: {
    desc: t(
      "Hedione is a jasmine-like material with a fresh, delicate citrus-floral scent. It adds radiance and a natural character to floral compositions."
    ),
    dil: t("10%"),
    vol: t("1dr"),
    com: t("Various Suppliers"),
    subst: t(
      "Hedione has moderate substantivity, lasting up to several hours on a blotter. It brings a light, radiant effect in compositions, especially in floral accords."
    ),
  },
  EthylVanillin: {
    desc: t(
      "Ethyl Vanillin is a synthetic compound, with a sweet, vanilla-like scent that is more intense than natural vanillin."
    ),
    dil: t("10%"),
    vol: t("1dr"),
    com: t("Various Suppliers"),
    subst: t(
      "Ethyl Vanillin has high substantivity, lasting for several days on a blotter with excellent tenacity."
    ),
  },
  Sylvamber: {
    desc: t(
      "Sylvamber is a powerful woody-amber material with dry, woody, and slightly balsamic nuances. It's a key ingredient in amber bases."
    ),
    dil: t("10%"),
    vol: t("1dr"),
    com: t("Various Suppliers"),
    subst: t(
      "Sylvamber has good substantivity, lasting up to several days on a blotter with its woody-amber scent."
    ),
  },
  OrangeFlowerAbsolute: {
    desc: t(
      "Orange Flower Absolute is derived from the flowers of the bitter orange tree, known for its rich, floral, and sweet scent."
    ),
    dil: t("10%"),
    vol: t("10%"),
    com: t("Various Suppliers"),
  },
  Terrasol: {
    desc: t(
      "Terrasol is a synthetic molecule known for its deep, earthy, and musky scent, often used in creating grounding and long-lasting base notes in fragrances."
    ),
    dil: t("10%"),
    vol: t("Strong"),
    com: t("Various Suppliers"),
  },
  NeroliEO: {
    desc: t(
      "Neroli Essential Oil is extracted from the blossoms of the bitter orange tree (Citrus aurantium). It has a rich, floral, and citrusy scent with sweet and fresh undertones, commonly used for its uplifting and calming properties."
    ),
    dil: t("10%"),
    vol: t("1dr"),
    com: t("Various Suppliers"),
  },
  LavenderAbsolute: {
    desc: t(
      "Lavender Absolute is a concentrated form of lavender essence, providing a deep floral scent."
    ),
    dil: t("10%"),
    vol: t("1dr"),
    com: t("Various Suppliers"),
  },
  WoodyBase: {
    desc: t("WoodyBase"),
    dil: t("NoDilution"),
    vol: t("2ml"),
    com: t("Pellwall"),
  },
  VetiverylAcetat: {
    desc: t("VetiverylAcetat"),
    dil: t("10%"),
    vol: t("1:1"),
  },
  CedarWood: {
    desc: t("CedarWood"),
  },
  Sandalwood: {
    desc: t("Sandalwood"),
  },
  ISOESuper: {
    desc: t("ISOESuper"),
  },
  Timbersilk: {
    desc: t("Timbersilk"),
  },
  OlibanumOil: {
    desc: t("OlibanumOil"),
  },
  Evernyl: {
    desc: t("Evernyl"),
    dil: t("EvernylDissolve")
  },
  Myrrh: {
    desc: t("Myrrh"),
  },
  FirBalm: {
    desc: t("FirBalm"),
  },
  BetaPinenes: {
    desc: t("BetaPinenes"),
  },
  MuskBlend: {
    desc: t("MuskBlend"),
    com: t("Pellwall"),
  },
  Ambroxan: {
    desc: t("Ambroxan"),
  },
  VertofixCoeur: {
    desc: t("VertofixCoeur"),
  },
  ClearWood: {
    desc: t("ClearWood"),
    com: t("Firmenich"),
  },
  Patchouli: {
    desc: t("Patchouli"),
    com: t("Firmenich"),
  },
  Geosmin: {
    desc: t("Geosmin"),
    dil: t("Strong"),
    vol: t("Asd"),
  },
  Lavender: {
    desc: t("Lavender"),
  },
  Dimetol: {
    desc: t("Dimetol"),
  },
  Silvial: {
    desc: t("Silvial"),
  },
  PADMA: {
    desc: t("PADMA"),
  },
  Ozofleur: {
    desc: t("Ozofleur"),
    vol: t("Strong"),
  },
  Helional: {
    desc: t("Helional"),
  },
};

export const Cis3Hexenol = ({
  dilution = 1000,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "cis-3-Hexenol",
  dilution,
  amount,
  exp: explanations.Cis3Hexenol,
  odour: ["green", "grassy", "leafy", "fresh"],
  evaporationRate: evaporationRates.Cis3Hexenol,
  relativeStrength: 200,
  ...rest,
});

export const Hedione = ({
  dilution = 10,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Hedione",
  dilution,
  amount,
  exp: explanations.Hedione,
  odour: ["jasmine", "fresh", "delicate", "citrus"],
  evaporationRate: evaporationRates.Hedione,
  relativeStrength: 5,
  ...rest,
});

// Ingredient functions

export const OrangeFlowerAbsolute = ({
  dilution = 10,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Orange Flower Absolute",
  dilution,
  amount,
  exp: explanations.OrangeFlowerAbsolute,
  odour: ["floral", "sweet", "citrus"],
  evaporationRate: evaporationRates.OrangeFlowerAbsolute, // Example evaporation rate
  relativeStrength: 20,
  ...rest,
});

// Ingredient functions

export const OrangeFlowerBlend = ({
  dilution = 10,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Orange Flower Blend",
  dilution,
  amount,
  exp: explanations.OrangeFlowerAbsolute,
  odour: ["floral", "sweet", "citrus"],
  evaporationRate: evaporationRates.OrangeFlowerAbsolute, // Example evaporation rate
  relativeStrength: 30,
  ...rest,
});

export const Amarocit = ({
  dilution = 10,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Amarocit",
  dilution,
  amount,
  exp: explanations.Amarocit,
  odour: ["bitter", "woody", "amber", "citrus", "grape"],
  evaporationRate: evaporationRates.Amarocit,
  relativeStrength: 21,
  ...rest,
});

// Function for Lavender Absolute
export const LavenderAbsolute = ({
  dilution = 10,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Lavender Absolute",
  dilution,
  amount,
  exp: explanations.LavenderAbsolute,
  odour: ["floral", "herbaceous", "sweet"],
  evaporationRate: evaporationRates.LavenderAbsolute, // Example evaporation rate
  relativeStrength: 15,
  ...rest,
});

export const PinoAcetaldehyde = ({
  dilution = 1,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  amount,
  name: "Pino Acetaldehyde",
  dilution,
  exp: {
    desc: "Pino Acetaldehyde is a fresh, green, and piney aldehyde used in perfumery.",
    dil: dilution === null ? "No Dilution" : `${dilution}%`,
    vol: "1dr",
    com: "Various Suppliers",
  },
  odour: ["fresh", "green", "piney", "aldehydic"], // Adjust odour profile as needed
  evaporationRate: evaporationRates.PinoAcetaldehyde,
  relativeStrength: 10,
  ...rest,
});

export const WoodyBase = ({
  dilution = null,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Woody Base (Pellwall)",
  dilution,
  amount,
  company: "Pellwall",
  exp: explanations.WoodyBase,
  odour: ["woody", "cedar"],
  evaporationRate: evaporationRates.WoodyBase,
  relativeStrength: 1,
  ...rest,
});

export const Vetiveryl = ({
  dilution = 10,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Vetiveryl Acetat",
  dilution,
  amount,
  exp: explanations.VetiverylAcetat,
  odour: ["sweet", "woody", "fresh", "dry"],
  evaporationRate: evaporationRates.VetiverylAcetat,
  relativeStrength: 0.9,
  ...rest,
});

export const NeroliEO = ({
  dilution = 10,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Neroli Essential Oil",
  dilution,
  amount,
  exp: explanations.NeroliEO,
  odour: ["floral", "citrusy", "fresh", "sweet"],
  evaporationRate: evaporationRates.NeroliEO,
  relativeStrength: 50,
  ...rest,
});

export const DPG = ({
  dilution,
  amount = "2ml",
  ...rest
}: IngredientOptions) => ({
  name: "Dipropylene Glycol",
  dilution,
  amount,
  exp: {
    desc: "Dipropylene Glycol is a colorless, odorless liquid that is often used as a solvent in the fragrance industry.",
    dil: dilution === null ? "No Dilution" : `${dilution}%`,
    vol: t("Solvent"),
    com: "Various Suppliers",
  },
  odour: ["neutral", "solvent", "slightly sweet"],
  evaporationRate: 0.1,
  dilutant: true,
  ...rest,
});

export const CedarWood = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Cedarwood",
  dilution,
  amount,
  exp: explanations.CedarWood,
  relativeStrength: 25,
  odour: ["woody", "dry"],
  evaporationRate: evaporationRates.CedarWood,
  ...rest,
});

export const Sandalwood = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Sandalwood",
  dilution,
  amount,
  exp: explanations.Sandalwood,
  odour: ["creamy", "woody"],
  evaporationRate: evaporationRates.Sandalwood,
  ...rest,
});

export const ISOESuper = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "ISO-E-Super",
  dilution,
  amount,
  exp: explanations.ISOESuper,
  odour: ["woody", "amber"],
  effects: ISOESuperEffect,
  evaporationRate: evaporationRates.ISOESuper,
  relativeStrength: 0.5,
  ...rest,
});

export const Timbersilk = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Timbersilk",
  dilution,
  amount,
  exp: explanations.Timbersilk,
  relativeStrength: 0.9,
  odour: ["silky", "woody"],
  evaporationRate: evaporationRates.Timbersilk,
  ...rest,
});

export const OlibanumOil = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Olibanum Oil",
  dilution,
  amount,
  exp: explanations.OlibanumOil,
  odour: ["spicy", "resinous"],
  evaporationRate: evaporationRates.OlibanumOil,
  ...rest,
});

export const Evernyl = ({
  dilution = 10,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Evernyl",
  dilution,
  amount,
  exp: explanations.Evernyl,
  odour: ["woody", "amber"],
  evaporationRate: evaporationRates.Evernyl,
  relativeStrength: 10,
  ...rest,
});

export const Veramoss = ({
  dilution = 10,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Veramoss",
  dilution,
  amount,
  exp: explanations.Evernyl,
  odour: ["woody", "amber"],
  evaporationRate: evaporationRates.Evernyl,
  relativeStrength: 15,
  ...rest,
});

export const Myrrh = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Myrrh",
  dilution,
  amount,
  exp: explanations.Myrrh,
  odour: ["resinous", "sweet"],
  evaporationRate: evaporationRates.Myrrh,
  ...rest,
});

export const FirBalm = ({
  dilution = 5,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Fir Balm",
  dilution,
  amount,
  exp: explanations.FirBalm,
  odour: ["balsamic", "fresh"],
  evaporationRate: evaporationRates.FirBalm,
  relativeStrength: 15,
  ...rest,
});

export const BetaPinenes = ({
  dilution = 10,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Beta Pinenes",
  dilution,
  amount,
  exp: explanations.BetaPinenes,
  odour: ["pine", "fresh"],
  evaporationRate: evaporationRates.BetaPinenes,
  relativeStrength: 10,
  ...rest,
});

export const MuskBlend = ({
  dilution,
  amount = "2dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Musk Blend",
  company: "Pellwall",
  dilution,
  amount,
  exp: explanations.MuskBlend,
  relativeStrength: 1.75,
  odour: ["musky", "sweet"],
  evaporationRate: evaporationRates.MuskBlend,
  ...rest,
});

export const Ambroxan = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Ambroxan",
  dilution,
  amount,
  exp: explanations.Ambroxan,
  odour: ["amber", "woody"],
  evaporationRate: evaporationRates.Ambroxan,
  relativeStrength: 10,
  ...rest,
});

export const VertofixCoeur = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Vertofix Coeur",
  dilution,
  amount,
  exp: explanations.VertofixCoeur,
  odour: ["woody", "earthy"],
  evaporationRate: evaporationRates.VertofixCoeur,
  relativeStrength: 3,
  ...rest,
});

export const Sylvamber = ({
  dilution = 10,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Sylvamber",
  dilution,
  amount,
  exp: explanations.Sylvamber,
  odour: ["woody", "amber", "dry"],
  evaporationRate: evaporationRates.Sylvamber,
  relativeStrength: 5,
  ...rest,
});

export const ClearWood = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Clear Wood",
  company: "Firmenich",
  dilution,
  amount,
  exp: explanations.ClearWood,
  odour: ["woody", "fresh"],
  evaporationRate: evaporationRates.ClearWood,
  ...rest,
});

export const Patchouli = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Patchouli",
  dilution,
  amount,
  exp: explanations.Patchouli,
  odour: ["earthy", "herbaceous"],
  evaporationRate: evaporationRates.Patchouli,
  ...rest,
});

export const Geosmin = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Geosmin",
  dilution,
  amount,
  exp: explanations.Geosmin,
  relativeStrength: 10000,
  odour: ["earthy", "sweet"],
  evaporationRate: evaporationRates.Geosmin,
  ...rest,
});

export const Lavender = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Lavender",
  dilution,
  amount,
  exp: explanations.Lavender,
  odour: ["floral", "herbaceous", "lavender"],
  harmonic: ["woody", "citric"],
  disharmonic: [],
  evaporationRate: evaporationRates.Lavender,
  relativeStrength: 20,
  ...rest,
});

export const Dimetol = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Dimetol",
  dilution,
  amount,
  exp: explanations.Dimetol,
  odour: ["sweet", "solvent"],
  evaporationRate: evaporationRates.Dimetol,
  ...rest,
});

export const Silvial = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Silvial",
  dilution,
  amount,
  exp: explanations.Silvial,
  odour: ["sweet", "fruity"],
  evaporationRate: evaporationRates.Silvial,
  ...rest,
});

export const PADMA = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "PADMA",
  dilution,
  amount,
  exp: explanations.PADMA,
  odour: ["balsamic", "sweet"],
  evaporationRate: evaporationRates.PADMA,
  ...rest,
});

export const Ozofleur = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Ozofleur",
  dilution,
  amount,
  exp: explanations.Ozofleur,
  relativeStrength: 250,
  odour: ["sweet", "fruity"],
  evaporationRate: evaporationRates.Ozofleur,
  ...rest,
});

export const Terrasol = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Terrasol",
  dilution,
  amount,
  exp: explanations.Terrasol,
  odour: ["earthy", "woody", "musky"],
  evaporationRate: evaporationRates.Terrasol,
  relativeStrength: 20,
  ...rest,
});

export const Helional = ({
  dilution,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Helional",
  dilution,
  amount,
  exp: explanations.Helional,
  odour: ["floral", "fruity"],
  evaporationRate: evaporationRates.Helional,
  ...rest,
});

// Formulas
export const WoodenHeart: Ingredient[] = [
  WoodyBase({ dilution: null }),
  Vetiveryl({ dilution: 10 }),
  ISOESuper({ dilution: null }),
  Evernyl({ dilution: 10 }),
  FirBalm({ dilution: 10 }),
  BetaPinenes({ dilution: 10 }),
  ClearWood({ dilution: 10 }),
];

export const WoodenAmberHeart: Ingredient[] = [Timbersilk({ dilution: 10 })];

export const AllIngredients: Ingredient[] = [
  WoodyBase({ dilution: null }),
  ISOESuper({ dilution: null }),
  Vetiveryl({ dilution: null }),
  ClearWood({ dilution: null }),
  Patchouli({ dilution: 10 }),
  FirBalm({ dilution: 5 }),
  BetaPinenes({ dilution: 10 }),
  CedarWood({ dilution: 10 }),
  Sandalwood({ dilution: 10 }),
  Myrrh({ dilution: 10 }),
  OlibanumOil({ dilution: 10 }),
  MuskBlend({ dilution: null }),
  Ambroxan({ dilution: null }),
  Evernyl({ dilution: 20 }),
  VertofixCoeur({ dilution: 10 }),
  Helional({ dilution: 1 }),
  Geosmin({ dilution: 0.01 }),
  Lavender({ dilution: 10 }),
  Ozofleur({ dilution: 1 }),
  PADMA({ dilution: 1 }),
  Dimetol({ dilution: 1 }),
  Silvial({ dilution: 1 }),
  Hedione({ dilution: null }),
];

export const SylvanDawn: Ingredient[] = [
  WoodyBase({ dilution: null }),
  Vetiveryl({ dilution: 10 }),
  ISOESuper({ dilution: null }),
  ClearWood({ dilution: 10 }),
  Patchouli({ dilution: 10 }),
  Sandalwood({ dilution: 10 }),
  Ambroxan({ dilution: null }),
];

export const OrangeForestv01: Ingredient[] = [
  DPG({ dilution: null, amount: "2ml" }),
  Vetiveryl({ dilution: null, amount: "6dr" }),
  ClearWood({ dilution: null, amount: "14dr" }),
  CedarWood({ dilution: 10, amount: "4dr" }),
  BetaPinenes({ dilution: 10, amount: "3dr" }),
  FirBalm({ dilution: 10, amount: "2dr" }),
  PinoAcetaldehyde({ dilution: 10, amount: "2dr" }),
  MuskBlend({ dilution: null, amount: "3dr" }),
  ISOESuper({ dilution: null, amount: "20dr" }),
  Ambroxan({ dilution: 10, amount: "1dr" }),
  Terrasol({ dilution: 10, amount: "3dr" }),
  Lavender({ dilution: 10, amount: "2dr" }),
  LavenderAbsolute({ dilution: 10, amount: "2dr" }),
  NeroliEO({ dilution: 5, amount: "1dr" }),
  OrangeFlowerAbsolute({ dilution: 10, amount: "3dr" }),
  VertofixCoeur({ dilution: null, amount: "1dr" }),
];

export const HarmonicWoodBase: Ingredient[] = [
  DPG({ dilution: null, amount: "1ml" }),
  Vetiveryl({ dilution: null, amount: "30dr" }),
  ClearWood({ dilution: null, amount: "14dr" }),
  CedarWood({ dilution: 10, amount: "6dr" }),
  BetaPinenes({ dilution: 10, amount: "16dr" }),
  FirBalm({ dilution: null, amount: "1dr" }),
];

export const EthylVanillin = ({
  dilution = 10,
  amount = "1dr",
  ...rest
}: IngredientOptions): Ingredient => ({
  name: "Ethyl Vanillin",
  dilution,
  amount,
  exp: explanations.EthylVanillin,
  odour: ["sweet", "vanilla", "powdery"],
  evaporationRate: evaporationRates.EthylVanillin,
  relativeStrength: 10,
  ...rest,
});

export const OrangeForest: Ingredient[] = [
  DPG({ dilution: null, amount: "1ml" }),
  Vetiveryl({ dilution: null, amount: "37dr" }),
  ClearWood({ dilution: null, amount: "28dr" }),
  CedarWood({ dilution: 10, amount: "11dr" }),
  BetaPinenes({ dilution: 10, amount: "20dr" }),
  FirBalm({ dilution: 5, amount: "45dr" }),
  Veramoss({ dilution: 20, amount: "4dr" }),
  Timbersilk({ dilution: null, amount: "35dr" }),
  ISOESuper({ dilution: null, amount: "20dr" }),
  Ambroxan({ dilution: 10, amount: "35dr" }),
  VertofixCoeur({ dilution: null, amount: "11dr" }),
  PinoAcetaldehyde({ dilution: 10, amount: "11dr" }),
  Sylvamber({ dilution: null, amount: "4dr" }),
  MuskBlend({ dilution: null, amount: "11dr" }),
  Terrasol({ dilution: 10, amount: "6dr" }),
  Hedione({ dilution: null, amount: "4dr" }),
  EthylVanillin({ dilution: 1, amount: "6dr" }),
  Cis3Hexenol({ dilution: 1, amount: "4dr" }),
  Lavender({ dilution: 5, amount: "9dr" }),
  LavenderAbsolute({ dilution: 10, amount: "19dr" }),
  // NeroliEO({ dilution: 5, amount: "1dr" }),

  Amarocit({ dilution: 10, amount: "8dr" }),
  OrangeFlowerBlend({ dilution: 10, amount: "11dr" }),
  OrangeFlowerAbsolute({ dilution: 10, amount: "20dr" }),
  Ozofleur({ dilution: 1, amount: "2dr" }),
  Geosmin({ dilution: 0.1, amount: "1dr" }),
];

export const WoodAccord: Accord = {
  relativeHarmony: 0.7,
  dopaRelease: 0.2,
  ingredients: [
    Vetiveryl({ dilution: null, amount: "30dr" }),
    ClearWood({ dilution: null, amount: "20dr" }),
    CedarWood({ dilution: 10, amount: "6dr" }),
    BetaPinenes({ dilution: 10, amount: "16dr" }),
    FirBalm({ dilution: null, amount: "1dr" }),
  ],
};

export const AnimalicAccord: Accord = {
  relativeHarmony: 0.7,
  dopaRelease: 0.9,
  ingredients: [
    Vetiveryl({ dilution: null, amount: "33dr" }),
    ClearWood({ dilution: null, amount: "24dr" }),
    CedarWood({ dilution: 10, amount: "7dr" }),
    BetaPinenes({ dilution: 10, amount: "16dr" }),
    FirBalm({ dilution: null, amount: "1dr" }),
    Veramoss({ dilution: 20, amount: "3dr" }),
    Timbersilk({ dilution: null, amount: "25dr" }),
    ISOESuper({ dilution: null, amount: "20dr" }),
    Ambroxan({ dilution: 10, amount: "23dr" }),
    VertofixCoeur({ dilution: null, amount: "8dr" }),
    PinoAcetaldehyde({ dilution: 10, amount: "9dr" }),
    Sylvamber({ dilution: null, amount: "1dr" }),
    MuskBlend({ dilution: null, amount: "5dr" }),
    Terrasol({ dilution: 10, amount: "5dr" }),
  ],
};
