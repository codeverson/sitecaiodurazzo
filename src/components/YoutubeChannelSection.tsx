import { useEffect, useMemo, useState } from "react";
import { youtubeSectionCopy } from "../data/siteCopy";
import {
  parseYoutubeVideoId,
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from "../lib/youtube";
import type { YoutubeVideoItem } from "../types/youtubeVideo";
import { useYoutubeVideos } from "../context/YoutubeVideosContext";
import YoutubeThumbImg from "./YoutubeThumbImg";

function MainPlayer({
  video,
  channelUrl,
}: {
  video: YoutubeVideoItem;
  channelUrl: string;
}) {
  const videoId = parseYoutubeVideoId(video.url);
  const title = video.title.trim() || "Vídeo no YouTube";
  const href =
    video.url.trim().startsWith("http") && videoId
      ? video.url.trim()
      : videoId
        ? youtubeWatchUrl(videoId)
        : channelUrl;

  return (
    <div className="overflow-hidden border border-cd-mist/[0.12] bg-[#18080B] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-video w-full bg-black">
        {videoId ? (
          <iframe
            key={videoId}
            title={title}
            className="absolute inset-0 h-full w-full border-0"
            src={youtubeEmbedUrl(videoId)}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-4 bg-cd-panel/40 px-6 text-center">
            <p className="font-body text-sm text-cd-wash/80">
              URL do vídeo inválida. Ajuste no painel admin ou abra o canal.
            </p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[9px] font-semibold uppercase tracking-[0.26em] text-cd-teal hover:text-cd-mist"
            >
              Abrir no YouTube
            </a>
          </div>
        )}
      </div>
      <div className="border-t border-cd-mist/[0.08] bg-[linear-gradient(180deg,rgba(34,12,16,0.2)_0%,rgba(12,5,7,0.58)_100%)] px-5 py-5 sm:px-7 sm:py-6">
        {video.label.trim() ? (
          <p className="font-display text-[8px] font-semibold tracking-[0.38em] text-cd-teal/90">
            {video.label.toUpperCase()}
          </p>
        ) : null}
        <p className="mt-2 font-rock text-[clamp(1.1rem,2.2vw,1.5rem)] uppercase leading-[1.1] tracking-[0.07em] text-[#f2ead8]">
          {title}
        </p>
        {videoId ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex font-display text-[8px] tracking-[0.28em] text-cd-wash/50 transition-colors hover:text-cd-neon/80"
          >
            ABRIR NO YOUTUBE ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}

function SecondarySelector({
  v,
  isCurrent,
  onSelect,
}: {
  v: YoutubeVideoItem;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  const id = parseYoutubeVideoId(v.url);
  const title = v.title.trim() || "Vídeo";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isCurrent ? "true" : undefined}
      className={[
        "group flex w-full gap-3 border p-2.5 text-left outline-offset-4 transition-[border-color,background-color,box-shadow] duration-300 sm:gap-3.5 sm:p-3",
        isCurrent
          ? "border-cd-teal/45 bg-cd-teal/[0.08] shadow-[0_0_0_1px_rgba(122,19,33,0.14)]"
          : "border-cd-mist/[0.08] bg-black/35 hover:border-cd-golddim/35 hover:bg-black/50",
      ].join(" ")}
    >
      <div className="relative aspect-video w-[44%] max-w-[9.5rem] shrink-0 overflow-hidden sm:w-[42%]">
        <YoutubeThumbImg
          videoId={id}
          override={v.thumbnailUrl}
          alt=""
          className={[
            "h-full w-full object-cover object-center transition-[filter,transform] duration-300",
            isCurrent
              ? "brightness-[0.62]"
              : "brightness-[0.5] group-hover:brightness-[0.62] group-hover:scale-[1.03]",
          ].join(" ")}
        />
        <div
          className={[
            "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity",
            isCurrent ? "bg-black/10 opacity-100" : "bg-black/20 opacity-80 group-hover:opacity-100",
          ].join(" ")}
        >
          <span
            className={[
              "flex h-9 w-9 items-center justify-center border text-cd-mist",
              isCurrent ? "border-cd-teal/50 bg-black/70" : "border-cd-mist/25 bg-black/60",
            ].join(" ")}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current" aria-hidden>
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </span>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
        {v.label.trim() ? (
          <p
            className={[
              "font-display text-[7px] font-medium tracking-[0.32em]",
              isCurrent ? "text-cd-teal" : "text-cd-teal/80",
            ].join(" ")}
          >
            {v.label.toUpperCase()}
          </p>
        ) : null}
        <p
          className={[
            "mt-1 font-heading text-[11px] font-semibold uppercase leading-snug tracking-[0.14em] sm:text-xs",
            isCurrent ? "text-cd-mist" : "text-cd-mist/95",
          ].join(" ")}
        >
          {title}
        </p>
      </div>
    </button>
  );
}

export default function YoutubeChannelSection({ channelUrl }: { channelUrl: string }) {
  const { videos } = useYoutubeVideos();

  const activeSorted = useMemo(
    () => videos.filter((v) => v.isActive).sort((a, b) => a.order - b.order),
    [videos],
  );

  const defaultSelectedId = useMemo(() => {
    const hit = activeSorted.find((v) => v.isFeatured) ?? activeSorted[0];
    return hit?.id ?? null;
  }, [activeSorted]);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    setSelectedId((prev) => {
      if (prev != null && activeSorted.some((v) => v.id === prev)) return prev;
      return defaultSelectedId;
    });
  }, [activeSorted, defaultSelectedId]);

  const activeVideo = useMemo((): YoutubeVideoItem | null => {
    if (!activeSorted.length) return null;
    if (selectedId != null) {
      const hit = activeSorted.find((v) => v.id === selectedId);
      if (hit) return hit;
    }
    return activeSorted.find((v) => v.isFeatured) ?? activeSorted[0] ?? null;
  }, [activeSorted, selectedId]);

  if (!activeVideo && activeSorted.length === 0) {
    return null;
  }

  const { kicker, title, ctaChannel } = youtubeSectionCopy;
  const showSidebar = activeSorted.length > 1;

  return (
    <section
      id="youtube"
      className="relative isolate flex scroll-mt-24 flex-col overflow-x-clip bg-transparent py-12 text-cd-mist sm:py-14 lg:min-h-[100vh] lg:py-16"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 items-center px-6 sm:px-10 lg:px-14 xl:px-16">
        <div className="w-full">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <header className="max-w-3xl">
              <p className="font-display text-[9px] font-semibold tracking-[0.48em] text-cd-teal">{kicker}</p>
              <h2 className="cd-display-title mt-5 font-rock text-[clamp(1.65rem,3.6vw,2.65rem)] uppercase leading-[1.05] tracking-[0.08em] text-[#ebe3d4]">
                {title}
              </h2>
              <div
                className="mt-6 h-px w-14 bg-gradient-to-r from-cd-neon/70 via-cd-neon/35 to-transparent"
                aria-hidden
              />
            </header>

            <div className="lg:shrink-0">
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-cd-mist/[0.14] bg-cd-mist/[0.03] px-6 py-3.5 font-display text-[9px] font-semibold uppercase tracking-[0.28em] text-cd-mist transition-[border-color,background-color,color] duration-200 hover:border-cd-neon/45 hover:bg-cd-neon/[0.06] hover:text-[#f4ecd8]"
              >
                {ctaChannel}
                <span className="text-cd-neon/80" aria-hidden>
                  →
                </span>
              </a>
            </div>
          </div>

          {activeVideo ? (
            <div className="mt-8 sm:mt-10 lg:mt-12">
              <div
                className={[
                  "flex flex-col gap-6",
                  showSidebar ? "lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-8 xl:gap-10" : "",
                ].join(" ")}
              >
                <div className={showSidebar ? "lg:col-span-7 xl:col-span-8" : ""}>
                  <MainPlayer video={activeVideo} channelUrl={channelUrl} />
                </div>
                {showSidebar ? (
                  <div className="relative lg:col-span-5 lg:flex lg:h-full lg:flex-col xl:col-span-4">
                    <p className="mb-3 font-display text-[8px] font-medium tracking-[0.36em] text-cd-faint">
                      MAIS VÍDEOS
                    </p>
                    <ul className="grid gap-3 sm:grid-cols-2 lg:h-full lg:flex-1 lg:grid-cols-1 lg:justify-between">
                      {activeSorted.map((v) => (
                        <li
                          key={v.id}
                          className="min-w-0"
                        >
                          <SecondarySelector
                            v={v}
                            isCurrent={v.id === activeVideo.id}
                            onSelect={() => setSelectedId(v.id)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="mt-auto pt-12 sm:pt-14 lg:pt-16 pb-4 sm:pb-5 lg:pb-6" aria-hidden>
            <div className="section-divider-slash" />
          </div>
        </div>
      </div>
    </section>
  );
}
