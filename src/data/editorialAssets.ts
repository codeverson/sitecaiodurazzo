import caio02 from "../../assets/Caio02.jpg";
import crazylegsPng from "../../assets/crazylegs.png";
import crazylegsLogo from "../../assets/crazylegslogo.png";
import fotoLabel from "../../assets/Foto para Label.jpg";
import maintanceImage from "../../assets/maintance.png";
import mg8529 from "../../assets/_MG_8529.jpg";
import mg8546 from "../../assets/_MG_8546.jpg";
import heroPoster from "../../assets/hero-d69e744c-6bdd-45ff-9dde-9a92b03441b5.png";

/** Curadoria por seção — full width / peso visual. */
export const editorialAssets = {
  hero: heroPoster,
  maintenance: maintanceImage,
  bioMain: caio02,
  bioOverlap: fotoLabel,
  discographyBg: mg8546,
  crazyLegs: crazylegsPng,
  crazyLegsLogo: crazylegsLogo,
  release: fotoLabel,
  lessons: mg8529,
  ctaStrip: heroPoster,
} as const;
