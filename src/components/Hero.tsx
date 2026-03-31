import { useEffect, useState } from "react";
import { useHeroSlides } from "../context/HeroSlidesContext";
import { heroCopy, marqueeRibbonCopy } from "../data/siteCopy";
import HeroSlideshow from "./HeroSlideshow";
import MarqueeStrip from "./MarqueeStrip";

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const line = marqueeRibbonCopy;
  const { slides } = useHeroSlides();

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
          <div className="mx-auto w-full max-w-[100rem] px-6 sm:px-10 lg:px-14">
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
                  "cd-display-title font-rock text-[clamp(2.6rem,9.5vw,5rem)] uppercase leading-[0.95] tracking-[0.1em] text-[#f2ead8]",
                  heroCopy.micro.trim() ? "mt-5" : "",
                ].join(" ")}
              >
                {heroCopy.title}
              </h1>

              <p className="mt-5 font-heading text-[clamp(0.95rem,2.2vw,1.15rem)] font-medium uppercase tracking-[0.2em] text-cd-wash/90">
                {heroCopy.tagline}
              </p>

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
