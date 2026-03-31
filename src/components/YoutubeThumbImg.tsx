import { useCallback, useState } from "react";
import { youtubeThumbnailUrl } from "../lib/youtube";

type YoutubeThumbImgProps = {
  videoId: string | null;
  override: string;
  alt: string;
  className?: string;
};

/** Thumbnail YouTube com fallback maxres → hq → mq. */
export default function YoutubeThumbImg({
  videoId,
  override,
  alt,
  className,
}: YoutubeThumbImgProps) {
  const [tier, setTier] = useState<0 | 1 | 2>(0);
  const o = override.trim();

  const autoSrc = videoId
    ? youtubeThumbnailUrl(
        videoId,
        tier === 0 ? "maxres" : tier === 1 ? "hq" : "mq",
      )
    : "";

  const src = o || autoSrc;

  const onError = useCallback(() => {
    if (o) return;
    setTier((t) => (t < 2 ? ((t + 1) as 0 | 1 | 2) : t));
  }, [o]);

  if (!src) {
    return (
      <div
        className={["bg-cd-panel/80", className].filter(Boolean).join(" ")}
        aria-hidden
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={onError}
    />
  );
}
