import type { DiscographyRelease } from "../data/discographyData";

/**
 * Resolve capa e metadados visuais para um release.
 *
 * Estratégia atual (frontend-only, sem Client Secret):
 * - Usa o endpoint público de oEmbed do Spotify (`/oembed?url=...`), que devolve
 *   `thumbnail_url` (capa) sem autenticação.
 * - Em dev, o Vite faz proxy de `/spotify-oembed` → `https://open.spotify.com/oembed`
 *   para evitar bloqueios de CORS no browser.
 *
 * Upgrade futuro (recomendado em produção):
 * - Endpoint backend com Client Credentials + Spotify Web API `GET /albums/{id}`
 *   para imagens em maior resolução + cache em Redis/DB.
 */

export type ResolvedAlbumArt = {
  coverUrl: string | null;
  oembedTitle?: string;
  href: string | null;
  source: "spotify-oembed" | "manual-override" | "local-file" | "fallback";
};

const SPOTIFY_RESOLVE_STORAGE_KEY = "caio_durazzo_spotify_resolve_cache";
const memoryCache = new Map<string, ResolvedAlbumArt>();
const pendingRequests = new Map<string, Promise<ResolvedAlbumArt>>();

function readPersistentCache(): Record<string, ResolvedAlbumArt> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(SPOTIFY_RESOLVE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, ResolvedAlbumArt> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!value || typeof value !== "object" || Array.isArray(value)) continue;
      const entry = value as Record<string, unknown>;
      const source = entry.source;
      if (
        typeof key === "string" &&
        (entry.coverUrl === null || typeof entry.coverUrl === "string") &&
        (entry.href === null || typeof entry.href === "string") &&
        (entry.oembedTitle === undefined || typeof entry.oembedTitle === "string") &&
        (source === "spotify-oembed" || source === "manual-override" || source === "local-file" || source === "fallback")
      ) {
        out[key] = {
          coverUrl: (entry.coverUrl as string | null) ?? null,
          href: (entry.href as string | null) ?? null,
          oembedTitle: entry.oembedTitle as string | undefined,
          source,
        };
      }
    }
    return out;
  } catch {
    return {};
  }
}

function writePersistentCache(cache: Record<string, ResolvedAlbumArt>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SPOTIFY_RESOLVE_STORAGE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore quota / private mode */
  }
}

function readCached(cacheKey: string): ResolvedAlbumArt | null {
  const memoryHit = memoryCache.get(cacheKey);
  if (memoryHit) return memoryHit;
  const persistent = readPersistentCache();
  const hit = persistent[cacheKey] ?? null;
  if (hit) memoryCache.set(cacheKey, hit);
  return hit;
}

function storeCached(cacheKey: string, value: ResolvedAlbumArt): ResolvedAlbumArt {
  memoryCache.set(cacheKey, value);
  const persistent = readPersistentCache();
  persistent[cacheKey] = value;
  writePersistentCache(persistent);
  return value;
}

export function extractSpotifyAlbumId(spotifyUrl: string): string | null {
  try {
    const u = new URL(spotifyUrl);
    const m = u.pathname.match(/\/album\/([a-zA-Z0-9]+)/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

function oembedRequestUrl(spotifyAlbumUrl: string): string {
  const params = new URLSearchParams({ url: spotifyAlbumUrl });
  if (import.meta.env.DEV) {
    return `/spotify-oembed?${params.toString()}`;
  }
  return `/spotify-oembed.php?${params.toString()}`;
}

type OEmbedResponse = {
  title?: string;
  thumbnail_url?: string;
  provider_name?: string;
};

export async function resolveSpotifyAlbumData(
  release: DiscographyRelease & { spotifyUrl: string | null },
): Promise<ResolvedAlbumArt> {
  const cacheKey = `${release.spotifyUrl ?? "x"}|${release.title}|${release.year}|${release.coverUrlOverride ?? ""}|${release.localCoverPath ?? ""}`;
  const cached = readCached(cacheKey);
  if (cached) return cached;
  const pending = pendingRequests.get(cacheKey);
  if (pending) return pending;

  if (release.coverUrlOverride) {
    const out: ResolvedAlbumArt = {
      coverUrl: release.coverUrlOverride,
      href: release.spotifyUrl && release.spotifyFound ? release.spotifyUrl : null,
      source: "manual-override",
    };
    return storeCached(cacheKey, out);
  }

  if (!release.spotifyUrl || !release.spotifyFound) {
    const out: ResolvedAlbumArt = {
      coverUrl: release.localCoverPath ?? null,
      href: null,
      source: release.localCoverPath ? "local-file" : "fallback",
    };
    return storeCached(cacheKey, out);
  }

  const albumId = extractSpotifyAlbumId(release.spotifyUrl);
  if (!albumId) {
    const out: ResolvedAlbumArt = {
      coverUrl: release.localCoverPath ?? null,
      href: release.spotifyUrl,
      source: release.localCoverPath ? "local-file" : "fallback",
    };
    return storeCached(cacheKey, out);
  }

  const request = (async () => {
    try {
      const res = await fetch(oembedRequestUrl(release.spotifyUrl), {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const out: ResolvedAlbumArt = {
          coverUrl: release.localCoverPath ?? null,
          href: release.spotifyUrl,
          source: release.localCoverPath ? "local-file" : "fallback",
        };
        return storeCached(cacheKey, out);
      }
      const data = (await res.json()) as OEmbedResponse;
      const thumb = data.thumbnail_url;
      const out: ResolvedAlbumArt = {
        coverUrl: thumb ?? release.localCoverPath ?? null,
        oembedTitle: data.title,
        href: release.spotifyUrl,
        source: thumb ? "spotify-oembed" : release.localCoverPath ? "local-file" : "fallback",
      };
      return storeCached(cacheKey, out);
    } catch {
      const out: ResolvedAlbumArt = {
        coverUrl: release.localCoverPath ?? null,
        href: release.spotifyUrl,
        source: release.localCoverPath ? "local-file" : "fallback",
      };
      return storeCached(cacheKey, out);
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, request);
  return request;
}

export function clearSpotifyResolveCache(): void {
  memoryCache.clear();
  pendingRequests.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(SPOTIFY_RESOLVE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}
