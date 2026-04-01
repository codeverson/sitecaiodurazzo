import seoRoutes from "../data/seoRoutes.json";

export const SITE_NAME = "Caio Durazzo";
export const SITE_URL = "https://caiodurazzo.com";
export const DEFAULT_OG_LOCALE = "pt_BR";

export type SeoPageKey = keyof typeof seoRoutes;

export type StaticSeoRoute = {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
  ogType?: string;
  ogImageSource: string;
};

export function getStaticSeoRoute(page: SeoPageKey): StaticSeoRoute {
  return seoRoutes[page];
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, SITE_URL).toString();
}
