import type { HeroSlide } from "../data/heroSlideshow";
import type { DiscographyFlatItem } from "../data/discographyData";
import type { Show } from "./show";
import type { YoutubeVideoItem } from "./youtubeVideo";

export type HeroSlideRecord = HeroSlide & {
  sortOrder: number;
};

export type HeroContentDocument = {
  slides: HeroSlideRecord[];
  /** Frases que alternam abaixo do nome no hero (site). */
  heroTaglines?: string[];
};

export type SiteSettingsDocument = {
  maintenanceMode: boolean;
};

export type DiscographyRecord = Partial<
  Pick<
    DiscographyFlatItem,
    "year" | "title" | "format" | "project" | "role" | "spotifyUrl" | "spotifyFound" | "listenUrl"
  >
> & {
  flatId: string;
  coverUrl?: string;
  /** Quando true, o lançamento do catálogo base não aparece no site (só no Backstage). */
  hidden?: boolean;
  /**
   * Catálogo base: some do site e da lista principal do painel (use o filtro Excluídos para restaurar).
   * Lançamentos custom (`custom-…`) não usam este campo — use excluir documento.
   */
  excluded?: boolean;
};

export type SiteSeedPayload = {
  hero: HeroSlideRecord[];
  shows: Show[];
  youtubeVideos: YoutubeVideoItem[];
  discography: DiscographyRecord[];
  settings: SiteSettingsDocument;
};
