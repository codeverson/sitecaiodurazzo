import type { HeroSlide } from "../data/heroSlideshow";
import type { DiscographyFlatItem } from "../data/discographyData";
import type { Show } from "./show";
import type { YoutubeVideoItem } from "./youtubeVideo";

export type HeroSlideRecord = HeroSlide & {
  sortOrder: number;
};

export type HeroContentDocument = {
  slides: HeroSlideRecord[];
};

export type SiteSettingsDocument = {
  maintenanceMode: boolean;
};

export type DiscographyRecord = Partial<
  Pick<DiscographyFlatItem, "year" | "title" | "format" | "project" | "role">
> & {
  flatId: string;
  coverUrl?: string;
};

export type SiteSeedPayload = {
  hero: HeroSlideRecord[];
  shows: Show[];
  youtubeVideos: YoutubeVideoItem[];
  discography: DiscographyRecord[];
  settings: SiteSettingsDocument;
};
