import caio02 from "../../assets/Caio02.jpg";
import fotoLabel from "../../assets/Foto para Label.jpg";
import mg8529 from "../../assets/_MG_8529.jpg";
import mg8546 from "../../assets/_MG_8546.jpg";
import heroPoster from "../../assets/hero-d69e744c-6bdd-45ff-9dde-9a92b03441b5.png";

export type HeroSlide = {
  id: string;
  src: string;
  objectPosition: string;
  label: string;
};

/**
 * Hero — apenas fotos do Caio solo (sem banda / acompanhantes).
 * Ordem alterna contexto: palco → retrato → performance → estrada → sessão.
 */
export const heroSlideshowSlides: HeroSlide[] = [
  { id: "hero-live", src: mg8546, objectPosition: "center 28%", label: "Palco" },
  { id: "hero-poster", src: heroPoster, objectPosition: "center 26%", label: "Poster" },
  { id: "hero-performance", src: caio02, objectPosition: "center 30%", label: "Performance" },
  { id: "hero-road", src: mg8529, objectPosition: "center 38%", label: "Estrada" },
  /** Triplo / composição editorial — enquadramento mais alto */
  { id: "hero-session", src: fotoLabel, objectPosition: "center 10%", label: "Sessão" },
];
