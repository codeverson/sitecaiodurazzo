import caio02 from "../../assets/Caio02.jpg";
import fotoLabel from "../../assets/Foto para Label.jpg";
import heroPoster from "../../assets/hero-d69e744c-6bdd-45ff-9dde-9a92b03441b5.png";
import mg8529 from "../../assets/_MG_8529.jpg";
import mg8546 from "../../assets/_MG_8546.jpg";
import crazylegsPng from "../../assets/crazylegs.png";

export type GalleryItem = {
  src: string;
  alt: string;
  tag: string;
};

/** Grid editorial — ordem narrativa: palco → retrato → estrada. */
export const galleryItems: GalleryItem[] = [
  { src: mg8546, alt: "Caio Durazzo ao vivo", tag: "LIVE" },
  { src: heroPoster, alt: "Caio Durazzo — retrato promocional", tag: "POSTER" },
  { src: caio02, alt: "Caio Durazzo — performance", tag: "BACKSTAGE" },
  { src: fotoLabel, alt: "Caio Durazzo — sessão", tag: "SESSION" },
  { src: crazylegsPng, alt: "Crazy Legs — arquivo de palco", tag: "CRAZY LEGS" },
  { src: mg8529, alt: "Caio Durazzo — ensaio", tag: "ROAD" },
];
