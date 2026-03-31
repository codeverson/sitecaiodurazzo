import { useEffect, useState } from "react";

const INTERVAL_MS = 7500;
const FADE_MS = 2200;

type Slide = { src: string; objectPosition: string };

export default function HeroSlideshow({ slides }: { slides: readonly Slide[] }) {
  const [active, setActive] = useState(0);
  /** Assume motion ok até ler o media query (evita autoplay antes do primeiro paint). */
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduceMotion || slides.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, slides.length]);

  const showIndex = reduceMotion ? 0 : active;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden>
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt=""
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          className={[
            "absolute inset-0 h-full w-full object-cover",
            reduceMotion ? "transition-none" : "transition-opacity ease-in-out",
          ].join(" ")}
          style={{
            objectPosition: slide.objectPosition,
            opacity: i === showIndex ? 1 : 0,
            transitionDuration: reduceMotion ? "0ms" : `${FADE_MS}ms`,
            zIndex: i === showIndex ? 2 : 1,
          }}
        />
      ))}
    </div>
  );
}
