/** Extrai o ID do vídeo a partir de URLs comuns do YouTube. */
export function parseYoutubeVideoId(raw: string): string | null {
  const u = raw.trim();
  if (!u) return null;
  try {
    const url = u.startsWith("http") ? new URL(u) : new URL(`https://${u}`);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.replace(/^\//, "").split("/")[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = url.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const m = url.pathname.match(/\/(embed|shorts|live)\/([\w-]{11})/);
      if (m?.[2]) return m[2];
    }
  } catch {
    /* ignore */
  }
  if (/^[\w-]{11}$/.test(u)) return u;
  return null;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
}

/** Embed sem autoplay; `rel=0` limita vídeos sugeridos ao mesmo canal quando possível. */
export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1`;
}

/** Thumbnail oficial; `maxresdefault` pode 404 em vídeos antigos — tratar no <img onError>. */
export function youtubeThumbnailUrl(
  videoId: string,
  quality: "maxres" | "hq" | "mq" = "maxres",
): string {
  const q =
    quality === "maxres"
      ? "maxresdefault.jpg"
      : quality === "hq"
        ? "hqdefault.jpg"
        : "mqdefault.jpg";
  return `https://img.youtube.com/vi/${videoId}/${q}`;
}

export function resolveYoutubeThumbnail(videoId: string | null, override: string): string {
  const t = override.trim();
  if (t) return t;
  if (!videoId) return "";
  return youtubeThumbnailUrl(videoId, "maxres");
}
