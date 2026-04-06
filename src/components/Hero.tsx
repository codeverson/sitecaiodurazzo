import { useEffect, useState } from "react";
import { useHeroSlides } from "../context/HeroSlidesContext";
import { heroCopy, marqueeRibbonCopy } from "../data/siteCopy";
import HeroSlideshow from "./HeroSlideshow";
import MarqueeStrip from "./MarqueeStrip";

const HERO_TAGLINE_DISPLAY_MS = 3000;
const HERO_TAGLINE_FADE_MS = 450;

function HeroRotatingTagline({ lines, className }: { lines: string[]; className?: string }) {
  const safeLines = lines.length > 0 ? lines : [...heroCopy.heroTaglines];
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    setIndex(0);
    setOpacity(1);
  }, [lines]);

  useEffect(() => {
    if (safeLines.length <= 1 || reduceMotion) return;

    const timeouts: number[] = [];
    let cancelled = false;
    const n = safeLines.length;

    const queue = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timeouts.push(id);
    };

    const cycle = () => {
      queue(() => {
        setOpacity(0);
        queue(() => {
          setIndex((i) => (i + 1) % n);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setOpacity(1));
          });
          // Só recomeça os 3s depois do fade-in, para cada frase ficar ~3s legível.
          queue(() => {
            cycle();
          }, HERO_TAGLINE_FADE_MS);
        }, HERO_TAGLINE_FADE_MS);
      }, HERO_TAGLINE_DISPLAY_MS);
    };

    cycle();

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [safeLines.length, reduceMotion, lines]);

  const line = reduceMotion ? safeLines[0] : safeLines[index % safeLines.length];

  return (
    <p
      className={className}
      aria-live={reduceMotion ? undefined : "polite"}
      aria-atomic="true"
      style={{
        opacity: reduceMotion ? 1 : opacity,
        transition: reduceMotion ? undefined : `opacity ${HERO_TAGLINE_FADE_MS}ms ease-in-out`,
      }}
    >
      {line}
    </p>
  );
}

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const line = marqueeRibbonCopy;
  const { slides, heroTaglines } = useHeroSlides();

  useEffect(() => {
    const t = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(t);
  }, []);

  return (
    <section id="top" className="relative isolate bg-[#220C10] text-cd-mist">
      <div className="relative min-h-[42rem] w-full sm:min-h-[100svh]">
        <div className="absolute inset-0 z-[1]" aria-hidden>
          <HeroSlideshow slides={slides} />
          <div
            className="pointer-events-none absolute inset-0 z-[3] bg-black/28"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(ellipse_85%_70%_at_70%_40%,transparent_0%,rgba(0,0,0,0.24)_100%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,transparent_32%,rgba(0,0,0,0.52)_100%)]"
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex min-h-[42rem] flex-col justify-end pb-12 pt-24 sm:min-h-[100svh] sm:pb-[4.5rem] sm:pt-32 lg:justify-center lg:pb-[5.5rem] lg:pt-24">
          <div className="mx-auto w-full max-w-[100rem] px-6 sm:px-10 lg:px-9 hd-laptop:px-7 xl:px-12">
            <div
              className={[
                "relative max-w-[34rem] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none transition-[opacity,transform] duration-700 ease-out lg:max-w-lg xl:max-w-[38rem]",
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              ].join(" ")}
            >
              {heroCopy.micro.trim() ? (
                <p className="font-display text-[9px] font-medium uppercase tracking-[0.42em] text-cd-wash/75">
                  {heroCopy.micro}
                </p>
              ) : null}

              <h1
                className={[
                  "cd-display-title font-rock text-[clamp(2.6rem,9.5vw,5rem)] uppercase leading-[0.95] tracking-[0.1em] text-[#f2ead8] hd-laptop:text-[clamp(2.35rem,7.5vw,3.75rem)]",
                  heroCopy.micro.trim() ? "mt-5" : "",
                ].join(" ")}
              >
                {heroCopy.title}
              </h1>

              <HeroRotatingTagline
                lines={heroTaglines}
                className="mt-5 min-h-[3rem] font-heading text-[clamp(0.95rem,2.2vw,1.15rem)] font-medium uppercase leading-snug tracking-[0.2em] text-cd-wash/90"
              />

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href="#agenda" className="cd-btn-primary">
                  {heroCopy.ctaAgenda}
                </a>
                <a href="#discos" className="cd-btn-ghost">
                  {heroCopy.ctaListen}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[15] border-t border-cd-mist/[0.08] bg-[#1A090C]">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[clamp(2.25rem,6vw,3.75rem)] bg-gradient-to-t from-[#220C10] via-[#220C10]/35 to-transparent"
          aria-hidden
        />
        <div className="overflow-hidden py-2.5" role="presentation" aria-hidden>
          <MarqueeStrip
            unit={line}
            spanClassName="font-display text-[8px] font-medium tracking-[0.46em] word-spacing-[0.35em] text-cd-wash/45 sm:text-[9px] sm:tracking-[0.75em] sm:word-spacing-[0.52em]"
          />
        </div>
      </div>
    </section>
  );
}
