export const About = `
I'm Moritz Roessler, a senior TypeScript developer with over 12 years of experience 
in web and full-stack development. I specialize in JavaScript, TypeScript, React, and GraphQL, 
focusing on code quality and optimal tooling. 
My work includes delivering complex projects for large clients, utilizing agile frameworks like Scrum. 
If you're looking for a lead or senior frontend developer in Freiburg im Breisgau or for remote work, feel free to contact me.
`;

export const SylvanDawn = `- 2ml Woody base by Pellwall
- 1 drop Vetiveryl Acetat
- 2 drops Musk Blend by Pellwall
- 1 drop Evernyl 20%
- 1 drop Vertofix 50%
- 1 drop Geosmin 0.005%.
`;

export const WoodenHeart = `- 2ml Woody Base by Pellwall
- 1dr Vetiveryl Acetat
- 2dr ISO-E-Super
- 1dr Evernyl 20%
- 1dr Fir Balsam 10%
- 1dr beta Pinenes 10%
- 1dr Cleanwood (Patchouli) 10%

Amber Variation: 
- +1dr Timbersilk 10%
- +1dr ISO-E-Super
`;

export const Ingredients = {
  WoodyBase: `This is a special base designed to provide fixation and diffusive support to compositions with woody notes.  The blend consists of both musk and non-musk fixatives, selected to be effective with a wide range of fragrance components where a woody element is desired as well as musks.  Although it is intended as a fragrance making component, this base is attractive alone and some customers have suggested it can be used as a perfume in it's own right.`,
  MuskBlend: `This is a special blend by Pell Wall, designed to provide fixation and diffusive support to a wide range of fragrance compositions.  We have always advised that the circumstances when a single musk used alone is appropriate to support your fragrance are vanishingly rare and musks are best used in combination.  To make that easier to do in practice we are presenting here a pre-made blend of 10 musks that work well together and will give excellent results in many types of fragrance.`,
  VertofixCoeur: `This is a very versatile and useful material that can be incorporated successfully into most blends: an excellent fixative that also adds ambery diffusion, it can be harsh in high doses but larger amounts can nevertheless work well in incense-type fragrances.`,
  Geosmin: `Geosmin is detectable by humas in parts per trillion. It is produced by soil bacteria and responsible for the petrichor smell when it rains.`,
  VetiverylAcetat: `Odour (decreasing):
  Sweet-woody, fresh, dry. Exalting and very tenacious.
  
  A refined derivative of vetiver oil, characterized by a smooth, woody, and earthy scent with subtle green and smoky undertones. It offers a softer and more polished version of vetiver, adding elegance and depth to fragrances with a long-lasting, balanced woody profile.`,
  ISOESuper: `Odour (decreasing):
  Velvety, woody, dry, ambergris, old-wood, lemony. Extremely diffusive.
  
  It is also incredibly versatile and widely used in fragrances of all kinds and applications. Besides supplying its own odour, it aids diffusion and gives body and a thickening, velvety quality to a fragrance. Used in simple blends it can help almost any material to 'smell more like itself' enhancing the odour quality.`,
  Timbersilk: `Timbersilk is an isomer of iso-e-super but contains Amber Xtreme at 0.007%`,
  Evernyl: `Odour (decreasing):
  Mossy, oakmoss, woody, phenolic, earthy.
  
  A synthetic molecule that replicates the scent of oakmoss, offering a dry, woody, and slightly earthy aroma with soft, mossy undertones. It adds depth and complexity, often imparting a nostalgic, forest-like character to blends.`,
  FirBalm: `Odour (decreasing):
  Pine needle, green, resinous, lemony.
  
  A rich, aromatic resin derived from fir trees, characterized by a warm, resinous scent with deep, sweet, and slightly woody notes. It evokes the essence of a dense, coniferous forest, adding a natural, comforting richness to compositions.`,
  BetaPinenes: `Odour (decreasing):
  green, aquatic, woody, dry.
  
  A naturally occurring terpene with a fresh, green, woody scent, featuring subtle resinous and earthy undertones, reminiscent of forest air.`,
  CleanWood: `Odour (decreasing): Woody, dry, fresh, earthy.
  A proprietary synthetic ingredient designed to capture the essence of woody notes with a modern, clean twist. It has a fresh, dry, and transparent woody scent with subtle earthy and musky undertones. Cleanwood adds a refined, contemporary woodiness to compositions without the heaviness or rough edges often associated with natural woods.`,
};

export const Companies = {
  Pellwall: "Pellwall is a UK company for fine perfumery",
};

export const Explanations = {
  Strong:
    "This is a very strong material, you only need traces of it, so dilute it good.",
  "1dr": "1 drop of the diluted material from a 3ml plastic pipette.",
  // "Evernyl20%", "Diluting Evernyl to 20% is easier to use than at 10%. However, both is fine. The material is hard to dissolve, so you might find a 10% solution to be easier."
  "10%":
    "Dilute normal materials to 10% to make it easier to use and suitable for a 2ml batch. Most materials are way too strong for such a small batch.",
  "2ml":
    "2ml fixative base is a good start for small batches and sufficient to work with single drops or 0.01g of materials diluted to 10%. Working in small batches minimizes loss at the beginning.",
};

const translations = {
  translation: {
    About,
    SylvanDawn,
    WoodenHeart,
    ...Ingredients,
    ...Companies,
    ...Explanations,
  },
};

export default translations;
