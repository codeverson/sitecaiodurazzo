import { useEffect, useState } from "react";
import { galleryItems } from "../data/galleryData";
import { textureAssets } from "../data/textureAssets";
import { galleryCopy } from "../data/siteCopy";
import TextureBg from "./TextureBg";
import { SectionBridgeBottom, SectionBridgeTop } from "./SectionBridges";

/** Varia escala e proporção para fugir do grid uniforme. */
const LAYOUT: { span?: string; aspect: string; clip?: string }[] = [
  { aspect: "aspect-[4/5]", clip: "clip-torn-bottom" },
  { aspect: "aspect-[3/5] sm:aspect-[2/3]", span: "sm:mt-12" },
  { aspect: "aspect-square" },
  { aspect: "aspect-[5/6]", span: "lg:-mt-6", clip: "clip-torn-top" },
  { aspect: "aspect-[4/5]" },
  { aspect: "aspect-[16/11]", span: "sm:mt-8" },
];

export default function GallerySection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section
      id="galeria"
      className="relative isolate scroll-mt-24 overflow-x-clip bg-[#060504] py-16 sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_20%,rgba(122,19,33,0.1),transparent_50%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-film-grain-section opacity-[0.14] mix-blend-overlay" aria-hidden />
      <TextureBg src={textureAssets.paperFiber} opacity={0.07} blendMode="multiply" />
      <SectionBridgeTop />
      <SectionBridgeBottom />

      <div className="relative z-10 mx-auto max-w-[90rem] px-5 sm:px-9 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <header
            className={[
              "max-w-xl transition-all duration-1000 ease-out",
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            ].join(" ")}
          >
            <p className="font-display text-[10px] font-semibold tracking-[0.42em] text-cd-teal">{galleryCopy.kicker}</p>
            <h2 className="mt-4 font-rock text-[clamp(2.2rem,6vw,3.8rem)] uppercase leading-[0.92] tracking-[0.05em] text-cd-mist">
              {galleryCopy.title}
            </h2>
            <p className="mt-6 font-body text-sm leading-relaxed text-cd-muted sm:text-base">{galleryCopy.dek}</p>
          </header>
          <div
            className={[
              "hidden h-px flex-1 bg-gradient-to-r from-cd-cherry/50 via-cd-neon/30 to-transparent lg:block",
              visible ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-hidden
          />
        </div>

        <ul
          className="mt-14 columns-1 gap-5 space-y-5 sm:columns-2 lg:mt-20 lg:columns-3 lg:gap-6 [&>li]:break-inside-avoid"
          style={{ columnFill: "balance" as const }}
        >
          {galleryItems.map((item, i) => {
            const lay = LAYOUT[i % LAYOUT.length]!;
            return (
              <li
                key={item.src + item.tag}
                className={[
                  "mb-5 lg:mb-6",
                  lay.span ?? "",
                  visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
                  "transition-all duration-700 ease-out",
                ].join(" ")}
                style={{ transitionDelay: `${60 + i * 80}ms` }}
              >
                <figure
                  className={[
                    "group relative overflow-hidden border border-cd-cherry/25 bg-cd-ink shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-[border-color,box-shadow] duration-500",
                    "hover:border-cd-neon/35 hover:shadow-[0_0_40px_rgba(244,224,77,0.08)]",
                    lay.clip ?? "",
                    lay.aspect,
                  ].join(" ")}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover object-center brightness-[0.82] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-90"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 z-[1] px-4 py-4">
                    <span className="font-display text-[8px] font-semibold tracking-[0.38em] text-cd-neon">{item.tag}</span>
                  </div>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
