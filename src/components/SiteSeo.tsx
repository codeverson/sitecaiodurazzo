import { useEffect } from "react";
import { crazyLegsContact, crazyLegsIntro, crazyLegsVideos, youtubeThumb } from "../data/crazyLegsEditorial";
import type { DiscographyFlatItem } from "../data/discographyData";
import { editorialAssets } from "../data/editorialAssets";
import { heroData } from "../data/mock";
import { bioCopy, contactLinks, discographyCopy, lessonsCopy, youtubeSectionCopy } from "../data/siteCopy";
import type { Show } from "../types/show";
import type { YoutubeVideoItem } from "../types/youtubeVideo";

const SITE_NAME = "Caio Durazzo";
const SITE_URL = "https://caiodurazzo.com";
const DEFAULT_OG_LOCALE = "pt_BR";

type SeoPageKey = "home" | "aulas" | "crazy-legs" | "staff" | "maintenance";

type SeoPayload = {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
  ogImage: string;
  ogType?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, SITE_URL).toString();
}

function ensureMeta(selector: string, attrs: Record<string, string>) {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => node?.setAttribute(key, value));
    document.head.appendChild(node);
  }
  return node;
}

function setMetaName(name: string, content: string) {
  const meta = ensureMeta(`meta[name="${name}"]`, { name });
  meta.setAttribute("content", content);
}

function setMetaProperty(property: string, content: string) {
  const meta = ensureMeta(`meta[property="${property}"]`, { property });
  meta.setAttribute("content", content);
}

function setLinkRel(rel: string, href: string) {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

function setJsonLd(graph: SeoPayload["jsonLd"]) {
  const id = "site-jsonld";
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!graph) {
    script?.remove();
    return;
  }
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  const payload = Array.isArray(graph) ? { "@context": "https://schema.org", "@graph": graph } : graph;
  script.textContent = JSON.stringify(payload);
}

function parseYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

function buildPersonSchema() {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#caio-durazzo`,
    name: "Caio Durazzo",
    url: SITE_URL,
    image: absoluteUrl(editorialAssets.hero),
    jobTitle: "Cantor, compositor, guitarrista e one man band",
    description:
      "Caio Durazzo é cantor, compositor e guitarrista de São Paulo, com trajetória ligada ao rock'n'roll, rockabilly, agenda de shows, aulas e projetos autorais como One Man Band e Crazy Legs.",
    sameAs: heroData.socials.map((social) => social.href),
    knowsAbout: ["rock'n'roll", "rockabilly", "one man band", "guitarra", "violão", "shows ao vivo"],
  };
}

function buildWebsiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "pt-BR",
    publisher: {
      "@id": `${SITE_URL}/#caio-durazzo`,
    },
  };
}

function buildHomeSchema(shows: Show[], videos: YoutubeVideoItem[], discographyItems: DiscographyFlatItem[]) {
  const featuredVideo = videos
    .filter((video) => video.isActive)
    .sort((a, b) => a.order - b.order)
    .find((video) => video.isFeatured) ?? null;

  const featuredVideoId = featuredVideo ? parseYoutubeId(featuredVideo.url) : null;
  const upcomingShows = shows
    .filter((show) => new Date(show.date).getTime() >= Date.now() - 24 * 60 * 60 * 1000)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const visibleAlbums = discographyItems
    .filter((item) => Boolean(item.title.trim()))
    .slice(0, 8)
    .map((item) => ({
      "@type": "MusicAlbum",
      name: item.title,
      datePublished: item.year.match(/\d{4}/)?.[0],
      byArtist: {
        "@id": `${SITE_URL}/#caio-durazzo`,
      },
      url: `${SITE_URL}/#discos`,
    }));

  return [
    buildWebsiteSchema(),
    buildPersonSchema(),
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/#home`,
      url: SITE_URL,
      name: "Caio Durazzo | Agenda, discografia, vídeos e contratação",
      description:
        "Site oficial de Caio Durazzo com agenda de shows, discografia, vídeos, aulas de guitarra e violão, contratação de shows e informações sobre o projeto Crazy Legs.",
      about: {
        "@id": `${SITE_URL}/#caio-durazzo`,
      },
      mainEntity: {
        "@id": `${SITE_URL}/#caio-durazzo`,
      },
    },
    ...(featuredVideo && featuredVideoId
      ? [
          {
            "@type": "VideoObject",
            name: featuredVideo.title,
            description: `${youtubeSectionCopy.title} no canal oficial de Caio Durazzo.`,
            thumbnailUrl: [featuredVideo.thumbnailUrl || youtubeThumb(featuredVideoId)],
            embedUrl: `https://www.youtube-nocookie.com/embed/${featuredVideoId}`,
            url: featuredVideo.url,
            publisher: {
              "@id": `${SITE_URL}/#caio-durazzo`,
            },
          },
        ]
      : []),
    ...upcomingShows.map((show) => ({
      "@type": "MusicEvent",
      name: `${show.venue} — Caio Durazzo`,
      startDate: show.time ? `${show.date}T${show.time}:00` : show.date,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: show.venue,
        address: {
          "@type": "PostalAddress",
          streetAddress: show.address || undefined,
          addressLocality: show.city,
          addressRegion: show.state,
          addressCountry: "BR",
        },
      },
      performer: {
        "@id": `${SITE_URL}/#caio-durazzo`,
      },
      offers: show.link
        ? {
            "@type": "Offer",
            url: show.link,
            priceCurrency: "BRL",
            availability: "https://schema.org/InStock",
          }
        : undefined,
    })),
    ...(visibleAlbums.length
      ? [
          {
            "@type": "ItemList",
            name: discographyCopy.headline,
            itemListElement: visibleAlbums.map((album, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: album,
            })),
          },
        ]
      : []),
  ];
}

function buildLessonsSchema() {
  return [
    buildWebsiteSchema(),
    buildPersonSchema(),
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/aulas/#webpage`,
      url: `${SITE_URL}/aulas`,
      name: lessonsCopy.seoTitle,
      description: lessonsCopy.seoDescription,
      about: {
        "@id": `${SITE_URL}/#caio-durazzo`,
      },
      breadcrumb: {
        "@id": `${SITE_URL}/aulas/#breadcrumb`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/aulas/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Aulas",
          item: `${SITE_URL}/aulas`,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: lessonsCopy.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}

function buildCrazyLegsSchema() {
  return [
    buildWebsiteSchema(),
    buildPersonSchema(),
    {
      "@type": "MusicGroup",
      "@id": `${SITE_URL}/crazy-legs/#musicgroup`,
      name: "Crazy Legs",
      url: `${SITE_URL}/crazy-legs`,
      image: absoluteUrl(editorialAssets.crazyLegs),
      genre: ["Rockabilly", "Rock'n'Roll"],
      foundingDate: "1996",
      foundingLocation: {
        "@type": "Place",
        name: "São Paulo, Brasil",
      },
      description: crazyLegsIntro.seoDescription,
      sameAs: [crazyLegsContact.instagramHref, crazyLegsContact.spotifyHref],
      member: [
        {
          "@id": `${SITE_URL}/#caio-durazzo`,
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/crazy-legs/#webpage`,
      url: `${SITE_URL}/crazy-legs`,
      name: `${crazyLegsIntro.title} | Caio Durazzo`,
      description: crazyLegsIntro.seoDescription,
      about: {
        "@id": `${SITE_URL}/crazy-legs/#musicgroup`,
      },
      breadcrumb: {
        "@id": `${SITE_URL}/crazy-legs/#breadcrumb`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/crazy-legs/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Crazy Legs",
          item: `${SITE_URL}/crazy-legs`,
        },
      ],
    },
    ...crazyLegsVideos.map((video) => ({
      "@type": "VideoObject",
      name: `Crazy Legs — ${video.label}`,
      description: `Vídeo do projeto Crazy Legs no site oficial de Caio Durazzo.`,
      thumbnailUrl: [youtubeThumb(video.id)],
      embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      about: {
        "@id": `${SITE_URL}/crazy-legs/#musicgroup`,
      },
    })),
  ];
}

function getSeoPayload(
  page: SeoPageKey,
  shows: Show[],
  videos: YoutubeVideoItem[],
  discographyItems: DiscographyFlatItem[],
): SeoPayload {
  const homeDescription =
    "Site oficial de Caio Durazzo com agenda de shows, discografia, vídeos, aulas de guitarra e violão, contratação de shows e informações sobre o projeto Crazy Legs.";

  const common = {
    ogType: "website",
  } as const;

  switch (page) {
    case "aulas":
      return {
        ...common,
        title: lessonsCopy.seoTitle,
        description: lessonsCopy.seoDescription,
        canonicalPath: "/aulas",
        ogImage: absoluteUrl(editorialAssets.lessons),
        jsonLd: buildLessonsSchema(),
      };
    case "crazy-legs":
      return {
        ...common,
        title: `${crazyLegsIntro.title} | Caio Durazzo`,
        description: crazyLegsIntro.seoDescription,
        canonicalPath: "/crazy-legs",
        ogImage: absoluteUrl(editorialAssets.crazyLegs),
        jsonLd: buildCrazyLegsSchema(),
      };
    case "staff":
      return {
        ...common,
        title: "Backstage | Caio Durazzo",
        description: "Área administrativa Backstage de Caio Durazzo.",
        canonicalPath: "/staff",
        robots: "noindex, nofollow, noarchive",
        ogImage: absoluteUrl(editorialAssets.hero),
      };
    case "maintenance":
      return {
        ...common,
        title: "Em manutencao | Caio Durazzo",
        description: "Site oficial de Caio Durazzo temporariamente em manutencao.",
        canonicalPath: "/",
        robots: "noindex, nofollow, noarchive",
        ogImage: absoluteUrl(editorialAssets.maintenance),
      };
    case "home":
    default:
      return {
        ...common,
        title: "Caio Durazzo | Agenda, discografia, aulas e Crazy Legs",
        description: homeDescription,
        canonicalPath: "/",
        ogImage: absoluteUrl(editorialAssets.hero),
        jsonLd: buildHomeSchema(shows, videos, discographyItems),
      };
  }
}

export default function SiteSeo({
  page,
  shows,
  videos,
  discographyItems,
}: {
  page: SeoPageKey;
  shows: Show[];
  videos: YoutubeVideoItem[];
  discographyItems: DiscographyFlatItem[];
}) {
  useEffect(() => {
    const seo = getSeoPayload(page, shows, videos, discographyItems);
    const canonical = absoluteUrl(seo.canonicalPath);

    document.title = seo.title;
    setMetaName("description", seo.description);
    setMetaName("robots", seo.robots ?? "index, follow, max-image-preview:large");
    setLinkRel("canonical", canonical);

    setMetaProperty("og:site_name", SITE_NAME);
    setMetaProperty("og:locale", DEFAULT_OG_LOCALE);
    setMetaProperty("og:type", seo.ogType ?? "website");
    setMetaProperty("og:title", seo.title);
    setMetaProperty("og:description", seo.description);
    setMetaProperty("og:url", canonical);
    setMetaProperty("og:image", seo.ogImage);

    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", seo.title);
    setMetaName("twitter:description", seo.description);
    setMetaName("twitter:image", seo.ogImage);

    setJsonLd(seo.jsonLd);
  }, [discographyItems, page, shows, videos]);

  return null;
}
