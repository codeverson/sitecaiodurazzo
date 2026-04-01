import { useEffect } from "react";
import { bioCopy } from "../data/siteCopy";

export default function BioSection() {
  useEffect(() => {
    const scrollIfBio = () => {
      if (window.location.hash !== "#bio") return;
      window.setTimeout(() => {
        document.getElementById("bio")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    };
    scrollIfBio();
    window.addEventListener("hashchange", scrollIfBio);
    return () => window.removeEventListener("hashchange", scrollIfBio);
  }, []);

  const { kicker, nameAboveTitleLines, title, paragraphs } = bioCopy;

  return (
    <section
      id="bio"
      className="relative isolate flex scroll-mt-24 flex-col overflow-x-clip bg-transparent py-14 text-cd-mist sm:py-16 lg:min-h-[100svh] lg:py-[4.5rem]"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 items-center px-6 sm:px-10 lg:px-14 xl:px-16">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-12 lg:items-start lg:gap-x-0 lg:gap-y-0">
          {/* Coluna esquerda: rótulo + título */}
          <header className="relative lg:col-span-5 lg:pr-10 xl:pr-14">
            <p className="font-display text-[9px] font-semibold tracking-[0.48em] text-cd-teal">{kicker}</p>
            <p className="mt-6 font-rock uppercase leading-[0.9] tracking-[0.11em] text-[#f2ead8] sm:mt-7 lg:mt-10">
              <span className="block text-[clamp(1.8rem,8vw,3.1rem)] leading-[0.88]">
                {nameAboveTitleLines[0]}
              </span>
              <span className="mt-[0.22em] block text-[clamp(1.8rem,8vw,3.1rem)] leading-[0.88]">
                {nameAboveTitleLines[1]}
              </span>
            </p>
            <div
              className="mt-7 h-px w-14 bg-gradient-to-r from-cd-neon/70 via-cd-neon/35 to-transparent sm:mt-8 lg:mt-9"
              aria-hidden
            />
            <h2 className="cd-display-title mt-5 max-w-[min(24ch,100%)] font-rock text-[clamp(1.2rem,5.2vw,1.95rem)] uppercase leading-[1.14] tracking-[0.07em] text-[#ddd5c8] sm:mt-6 sm:max-w-[min(24ch,100%)] lg:mt-7 lg:tracking-[0.09em]">
              {title}
            </h2>
          </header>

          {/* Coluna direita: texto corrido editorial */}
          <div className="lg:col-span-7 lg:pl-10 lg:pr-10 xl:pl-16 xl:pr-16">
            <div className="max-w-[42rem] space-y-6 lg:space-y-8">
              {paragraphs.map((para, i) => {
                const base =
                  i === 0
                    ? "text-[0.98rem] leading-[1.82] text-cd-mist/95 lg:text-[0.9rem] lg:leading-[1.78]"
                    : "text-[0.95rem] leading-[1.8] text-cd-wash/[0.88] lg:text-[0.875rem] lg:leading-[1.76]";
                return (
                  <p
                    key={i}
                    className={[
                      "font-body text-cd-wash/90 antialiased",
                      base,
                      i === 0 ? "bio-drop-cap-lead" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {para}
                  </p>
                );
              })}
            </div>
            <nav
              aria-label="Acessos principais do site"
              className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-cd-mist/[0.08] pt-6"
            >
              {[
                { href: "#agenda", label: "Agenda de shows" },
                { href: "#discos", label: "Discografia" },
                { href: "#youtube", label: "Vídeos oficiais" },
                { href: "/crazy-legs", label: "Projeto Crazy Legs" },
                { href: "/aulas", label: "Aulas de guitarra e violão" },
                { href: "#booking", label: "Contratação de shows" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-display text-[8px] font-semibold uppercase tracking-[0.28em] text-cd-neon/82 transition-colors hover:text-cd-mist"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto mt-auto w-full max-w-[90rem] px-6 pt-10 sm:px-10 sm:pt-12 lg:px-14 lg:pt-14 xl:px-16" aria-hidden>
        <div className="section-divider-slash" />
      </div>
    </section>
  );
}
