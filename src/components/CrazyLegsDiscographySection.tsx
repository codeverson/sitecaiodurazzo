import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { useDiscographyCovers } from "../context/DiscographyCoversContext";
import {
  discographyLinkOpensSpotify,
  getDiscographyListenUrl,
  type DiscographyFlatItem,
} from "../data/discographyData";
import { resolveSpotifyAlbumData, type ResolvedAlbumArt } from "../lib/resolveSpotifyAlbumData";

function SpotifyGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5Zm5.2 16.3c-.2.3-.6.4-.9.2-2.4-1.5-5.5-1.8-9.1-1-.3.1-.6-.1-.7-.4-.1-.3.1-.6.4-.7 3.9-.9 7.4-.5 10.1 1.2.3.2.4.6.2.9Zm1.4-3.1c-.2.4-.7.5-1.1.3-2.8-1.7-7-2.2-10.3-1.2-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3.7-1.1 8.4-.6 11.5 1.4.4.2.5.7.4 1Zm.1-3.2c-3.3-2-8.7-2.1-11.8-1.2-.5.2-1-.1-1.1-.6-.2-.5.1-1 .6-1.2 3.6-1 9.6-.8 13.3 1.5.5.3.6.9.4 1.4-.3.5-.9.6-1.4.3Z" />
    </svg>
  );
}

function CoverFallback({ title }: { title: string }) {
  const initials =
    title
      .split(/\s+/)
      .slice(0, 3)
      .map((word) => word[0])
      .filter(Boolean)
      .join("")
      .toUpperCase()
      .slice(0, 4) || "CL";

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cd-panel via-cd-ink to-black text-center" aria-hidden="true">
      <div className="px-3">
        <p className="font-display text-[10px] tracking-[0.35em] text-cd-goldhi/90">CRAZY LEGS</p>
        <p className="mt-2 font-rock text-3xl tracking-widest text-cd-paper/95">{initials}</p>
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0" fill="none" stroke="currentColor" strokeWidth="1.35" aria-hidden>
      {dir === "prev" ? (
        <path d="M14 5l-7 7 7 7" strokeLinecap="square" strokeLinejoin="miter" />
      ) : (
        <path d="M10 5l7 7-7 7" strokeLinecap="square" strokeLinejoin="miter" />
      )}
    </svg>
  );
}

function ShelfArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={[
        "inline-flex h-11 w-11 items-center justify-center border-b border-cd-mist/[0.12] px-1 transition-[border-color,color,opacity] duration-200",
        disabled ? "pointer-events-none opacity-25 text-cd-faint/70" : "text-cd-wash/72 hover:border-cd-teal/45 hover:text-cd-mist",
      ].join(" ")}
      aria-label={dir === "prev" ? "Lançamento anterior" : "Próximo lançamento"}
      disabled={disabled}
      onClick={onClick}
    >
      <Chevron dir={dir} />
    </button>
  );
}

function DiscSlide({
  item,
  resolved,
  index,
  active,
  setRef,
}: {
  item: DiscographyFlatItem;
  resolved?: ResolvedAlbumArt;
  index: number;
  active: boolean;
  setRef: (el: HTMLLIElement | null) => void;
}) {
  const listenHref = getDiscographyListenUrl(item);
  const opensSpotify = discographyLinkOpensSpotify(item, listenHref);
  const coverSrc = resolved?.coverUrl ?? null;
  const actionLabel = listenHref
    ? opensSpotify
      ? `Ouvir ${item.title} no Spotify — abre em nova aba`
      : `Acessar áudio de ${item.title} — abre em nova aba`
    : `${item.title} — lançamento sem link de áudio`;

  return (
    <li
      ref={setRef}
      data-disc-slide=""
      data-disc-index={index}
      className={[
        "w-[82vw] shrink-0 snap-center sm:w-[min(70vw,19.5rem)] lg:w-[min(19rem,82vw)] hd-laptop:w-[min(18.25rem,80vw)] xl:w-[21rem]",
        "transition-[opacity] duration-500 ease-out motion-reduce:transition-none",
        active ? "opacity-100" : "opacity-[0.48]",
      ].join(" ")}
    >
      <article
        className={[
          "mx-auto flex h-full flex-col border bg-[linear-gradient(165deg,rgba(18,15,13,0.95)_0%,rgba(5,4,3,0.98)_100%)] transition-[width,border-color,box-shadow] duration-500 ease-out motion-reduce:transition-none",
          listenHref ? "cursor-pointer" : "cursor-default",
          active ? "w-full shadow-[0_28px_70px_rgba(0,0,0,0.55)]" : "w-[95%]",
          active ? "border-cd-mist/[0.14] ring-1 ring-cd-teal/35" : "border-cd-mist/[0.06] hover:border-cd-mist/[0.1]",
        ].join(" ")}
        aria-label={listenHref ? actionLabel : undefined}
      >
        <div className="relative aspect-square w-full overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 z-[1] h-full w-[3px] bg-gradient-to-b from-cd-cherry/90 via-cd-teal/70 to-cd-cherry/75" aria-hidden />
          {coverSrc ? (
            <img src={coverSrc} alt={`Capa: ${item.title} (${item.year})`} className="filter-xerox-soft h-full w-full object-cover" loading="lazy" draggable={false} />
          ) : (
            <CoverFallback title={item.title} />
          )}
          <div className="pointer-events-none absolute inset-0 bg-halftone-fine opacity-[0.12] mix-blend-soft-light" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-film-grain-section opacity-[0.18] mix-blend-overlay" aria-hidden />
          {opensSpotify ? (
            <a
              href={listenHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={actionLabel}
              data-disc-ignore-center="true"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
              className="absolute right-2 top-2 z-[2] inline-flex h-8 w-8 items-center justify-center border border-cream/18 bg-black/85 text-cd-goldhi"
            >
              <SpotifyGlyph className="h-3.5 w-3.5" />
              <span className="sr-only">Disponível no Spotify</span>
            </a>
          ) : listenHref ? (
            <a
              href={listenHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={actionLabel}
              data-disc-ignore-center="true"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
              className="absolute right-2 top-2 z-[2] inline-flex min-h-8 min-w-8 items-center justify-center border border-cream/18 bg-black/85 px-1.5 font-display text-[7px] tracking-[0.18em] text-cd-wash/90"
            >
              ÁUDIO
              <span className="sr-only">Link externo para ouvir</span>
            </a>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col border-t border-cd-mist/[0.08] px-4 py-5 sm:px-5 sm:py-6">
          <p className="font-display text-[8px] font-semibold tracking-[0.38em] text-[#F5DF4E]">{item.year}</p>
          <h3 className="mt-2 font-rock text-[clamp(1.05rem,2.8vw,1.35rem)] uppercase leading-[1.12] tracking-[0.06em] text-[#ebe3d4]">
            {item.title}
          </h3>
          {item.role ? <p className="mt-2 font-display text-[8px] tracking-[0.24em] text-cd-faint">{item.role}</p> : null}
          <p className="mt-3 font-body text-xs italic text-cd-muted/85">{item.format}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-cd-mist/[0.07] pt-5">
            {listenHref ? (
              <a
                href={listenHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={actionLabel}
                data-disc-ignore-center="true"
                onClick={(e) => e.stopPropagation()}
                draggable={false}
                className="cd-btn-ghost !px-4 !py-2.5 !text-[8px] !tracking-[0.24em]"
              >
                {opensSpotify ? "Ouvir no Spotify" : "Acessar áudio"}
              </a>
            ) : (
              <span className="font-display text-[8px] tracking-[0.28em] text-cd-faint" aria-label={actionLabel}>
                CATÁLOGO
              </span>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}

function yearToNumber(value: string) {
  const match = value.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

export default function CrazyLegsDiscographySection() {
  const { shelfItems } = useDiscographyCovers();
  const orderedShelfItems = useMemo(
    () =>
      shelfItems
        .filter((item) => item.project.trim().toLowerCase() === "crazy legs")
        .sort((a, b) => yearToNumber(a.year) - yearToNumber(b.year)),
    [shelfItems],
  );
  const [resolved, setResolved] = useState<Record<string, ResolvedAlbumArt>>({});
  const [entered, setEntered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [dragging, setDragging] = useState(false);

  const scrollerRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        orderedShelfItems.map(async (item) => [item.flatId, await resolveSpotifyAlbumData(item)] as const),
      );
      if (!cancelled) {
        setResolved(Object.fromEntries(entries));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderedShelfItems]);

  const updateScrollState = useCallback(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const { scrollLeft, scrollWidth, clientWidth } = root;
    setCanPrev(scrollLeft > 12);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 12);

    const mid = root.getBoundingClientRect().left + clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(center - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActiveIndex(best);
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const onScroll = () => window.requestAnimationFrame(updateScrollState);
    root.addEventListener("scroll", onScroll, { passive: true });
    updateScrollState();
    window.addEventListener("resize", onScroll);
    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updateScrollState]);

  const focusSlide = useCallback((index: number) => {
    const root = scrollerRef.current;
    const target = itemRefs.current[index];
    if (!root || !target) return;
    const maxScrollLeft = Math.max(0, root.scrollWidth - root.clientWidth);
    const nextScrollLeft = target.offsetLeft - (root.clientWidth - target.clientWidth) / 2;
    root.scrollTo({
      left: Math.max(0, Math.min(maxScrollLeft, nextScrollLeft)),
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (!orderedShelfItems.length) return;
    const startIndex = Math.min(2, orderedShelfItems.length - 1);
    setActiveIndex(startIndex);
    const timer = window.setTimeout(() => focusSlide(startIndex), 80);
    return () => window.clearTimeout(timer);
  }, [focusSlide, orderedShelfItems.length]);

  const go = useCallback(
    (delta: number) => {
      const next = Math.max(0, Math.min(orderedShelfItems.length - 1, activeIndex + delta));
      focusSlide(next);
    },
    [activeIndex, focusSlide, orderedShelfItems.length],
  );

  const onPointerDown = useCallback((e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const root = scrollerRef.current;
    if (!root) return;
    dragStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startScrollLeft: root.scrollLeft,
      moved: false,
    };
    root.setPointerCapture(e.pointerId);
    setDragging(false);
  }, []);

  const onPointerMove = useCallback((e: PointerEvent<HTMLUListElement>) => {
    const root = scrollerRef.current;
    const drag = dragStateRef.current;
    if (!root || !drag || drag.pointerId !== e.pointerId) return;
    const delta = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(delta) > 6) {
      drag.moved = true;
      setDragging(true);
    }
    if (drag.moved) {
      root.scrollLeft = drag.startScrollLeft - delta * 1.18;
    }
  }, []);

  const endDrag = useCallback(
    (pointerId?: number, clientX?: number, clientY?: number) => {
      const root = scrollerRef.current;
      const drag = dragStateRef.current;
      if (!drag) return;
      if (pointerId != null && drag.pointerId !== pointerId) return;
      const shouldFocus = !drag.moved && clientX != null && clientY != null;
      if (root?.hasPointerCapture(drag.pointerId)) {
        root.releasePointerCapture(drag.pointerId);
      }
      dragStateRef.current = null;
      if (shouldFocus) {
        const hit = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
        if (!hit?.closest("[data-disc-ignore-center='true']")) {
          const slide = hit?.closest<HTMLElement>("[data-disc-slide][data-disc-index]");
          const index = slide ? Number(slide.dataset.discIndex) : Number.NaN;
          if (Number.isInteger(index)) {
            const targetItem = orderedShelfItems[index];
            const href = targetItem ? getDiscographyListenUrl(targetItem) : null;
            if (href) {
              window.open(href, "_blank", "noopener,noreferrer");
            }
            focusSlide(index);
          }
        }
      }
      window.setTimeout(() => setDragging(false), 0);
    },
    [focusSlide, orderedShelfItems],
  );

  const onClickCapture = useCallback(
    (e: MouseEvent<HTMLUListElement>) => {
      if (!dragging) return;
      e.preventDefault();
      e.stopPropagation();
    },
    [dragging],
  );

  if (!orderedShelfItems.length) return null;

  return (
    <section id="crazy-legs-discografia" className="relative isolate flex flex-col overflow-x-clip bg-transparent py-12 sm:py-14 lg:py-16">
      <div className="relative z-10 flex flex-1 flex-col">
        <header
          className={[
            "mx-auto w-full max-w-[90rem] px-6 pb-2 sm:px-10 lg:px-10 hd-laptop:px-7 xl:px-12 2xl:px-16",
            "transition-all duration-700 ease-out",
            entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          ].join(" ")}
        >
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8 xl:gap-x-10 2xl:gap-x-12">
            <div className="lg:col-span-5 lg:pl-4 xl:pl-6 2xl:pl-10">
              <p className="font-display text-[9px] font-semibold tracking-[0.48em] text-cd-teal">DISCOGRAFIA</p>
              <h2 className="cd-display-title mt-5 font-rock text-[clamp(1.65rem,3.6vw,2.65rem)] uppercase leading-[1.05] tracking-[0.08em] text-[#ebe3d4]">
                Discografia Crazy Legs
              </h2>
              <div className="mt-6 h-px w-14 bg-gradient-to-r from-cd-neon/70 via-cd-neon/35 to-transparent" aria-hidden />
            </div>
            <p className="max-w-[34rem] border-l-[3px] border-cd-teal/40 pl-5 font-body text-[0.97rem] leading-[1.74] text-cd-wash/[0.84] sm:pl-6 lg:col-span-7 lg:justify-self-start lg:max-w-[31rem] lg:pl-6 lg:pr-3 lg:text-[1rem] xl:max-w-[33rem] xl:pl-7 xl:pr-8">
              Um recorte da trajetória fonográfica do Crazy Legs, reunindo os principais lançamentos de estúdio, ao vivo, vinil, DVD e registros ligados à circulação internacional da banda.
            </p>
          </div>
        </header>

        <div className="relative z-[1] mt-8 pb-6 sm:mt-10 sm:pb-8 lg:mt-12 lg:pb-10" role="region" aria-roledescription="carrossel" aria-label="Discografia Crazy Legs">
          <div className="mx-auto flex max-w-[90rem] flex-col items-center justify-center gap-3 px-6 pb-5 text-center sm:px-10 lg:gap-4 lg:px-10 hd-laptop:gap-3 hd-laptop:px-7 xl:px-12 2xl:px-16">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <ShelfArrow dir="prev" disabled={!canPrev} onClick={() => go(-1)} />
              <p className="min-w-[5.5rem] text-center font-display text-[8px] tracking-[0.26em] text-cd-faint/75">
                {String(activeIndex + 1).padStart(2, "0")} / {String(orderedShelfItems.length).padStart(2, "0")}
              </p>
              <ShelfArrow dir="next" disabled={!canNext} onClick={() => go(1)} />
            </div>
            <p className="font-display text-[8px] tracking-[0.28em] text-cd-faint/72">
              {orderedShelfItems.length} {orderedShelfItems.length === 1 ? "LANÇAMENTO" : "LANÇAMENTOS"} · ARRASTE, TOQUE OU USE AS SETAS
            </p>
          </div>

          <ul
            ref={scrollerRef}
            className={[
              "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 sm:gap-7 sm:pb-8 lg:gap-8 lg:pb-10",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              "scroll-smooth motion-reduce:scroll-auto select-none touch-pan-y",
              "[&_*]:select-none [&_a]:cursor-pointer [&_img]:pointer-events-none",
              dragging ? "cursor-grabbing snap-none" : "cursor-grab",
            ].join(" ")}
            style={{
              paddingLeft: "max(1rem, calc(50% - min(41vw, 8.625rem)))",
              paddingRight: "max(1rem, calc(50% - min(41vw, 8.625rem)))",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => endDrag(e.pointerId, e.clientX, e.clientY)}
            onPointerCancel={(e) => endDrag(e.pointerId)}
            onPointerLeave={(e) => endDrag(e.pointerId)}
            onClickCapture={onClickCapture}
          >
            {orderedShelfItems.map((item, i) => (
              <DiscSlide
                key={item.flatId}
                item={item}
                resolved={resolved[item.flatId]}
                index={i}
                active={activeIndex === i}
                setRef={(el) => {
                  itemRefs.current[i] = el;
                }}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
