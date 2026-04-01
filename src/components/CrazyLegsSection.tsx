import { useEffect, useId, useRef, useState } from "react";
import crazyHero from "../../assets/crazylegs/crazyhero.png";
import { editorialAssets } from "../data/editorialAssets";
import {
  crazyLegsContact,
  crazyLegsIntro,
  crazyLegsPressMeta,
  crazyLegsVideos,
  crazyLegsYoutubeUrl,
  pressReleaseParagraphs,
  youtubeEmbed,
  youtubeThumb,
} from "../data/crazyLegsEditorial";
import { textureAssets } from "../data/textureAssets";
import TextureBg from "./TextureBg";

function SocialIcon({ kind }: { kind: "youtube" | "instagram" | "spotify" }) {
  if (kind === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path d="M10 8.5 15.5 12 10 15.5V8.5Z" fill="currentColor" />
        <path
          d="M21.25 12c0-2.1-.2-3.1-.5-3.8a3 3 0 0 0-1.6-1.6C18.4 6.25 17.4 6 12 6s-6.4.25-6.9.6a3 3 0 0 0-1.6 1.6C3.2 9 3 10 3 12s.2 3.1.5 3.8a3 3 0 0 0 1.6 1.6c.5.35 1.5.6 6.9.6s6.4-.25 6.9-.6a3 3 0 0 0 1.6-1.6c.3-.7.5-1.7.5-3.8Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M7.5 2.75h9A4.75 4.75 0 0 1 21.25 7.5v9A4.75 4.75 0 0 1 16.5 21.25h-9A4.75 4.75 0 0 1 2.75 16.5v-9A4.75 4.75 0 0 1 7.5 2.75Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M12 16.1a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5Zm5.2 16.3c-.2.3-.6.4-.9.2-2.4-1.5-5.5-1.8-9.1-1-.3.1-.6-.1-.7-.4-.1-.3.1-.6.4-.7 3.9-.9 7.4-.5 10.1 1.2.3.2.4.6.2.9Zm1.4-3.1c-.2.4-.7.5-1.1.3-2.8-1.7-7-2.2-10.3-1.2-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3.7-1.1 8.4-.6 11.5 1.4.4.2.5.7.4 1Zm.1-3.2c-3.3-2-8.7-2.1-11.8-1.2-.5.2-1-.1-1.1-.6-.2-.5.1-1 .6-1.2 3.6-1 9.6-.8 13.3 1.5.5.3.6.9.4 1.4-.3.5-.9.6-1.4.3Z" />
    </svg>
  );
}

export default function CrazyLegsSection() {
  const uid = useId();
  const sheetRef = useRef<HTMLElement>(null);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (!releaseOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [releaseOpen]);

  useEffect(() => {
    if (!releaseOpen && !activeVideoId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setReleaseOpen(false);
        setActiveVideoId(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [releaseOpen, activeVideoId]);

  useEffect(() => {
    if (!releaseOpen) return;
    const t = window.setTimeout(() => {
      sheetRef.current?.querySelector<HTMLElement>("button[data-close-sheet]")?.focus();
    }, 80);
    return () => window.clearTimeout(t);
  }, [releaseOpen]);

  const main = crazyLegsVideos[0];
  const eu = crazyLegsVideos[1];
  const vlv = crazyLegsVideos[2];

  return (
    <section
      id="palco"
      className="relative isolate scroll-mt-24 overflow-x-clip bg-transparent text-cd-mist"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px bg-gradient-to-r from-transparent via-cd-neon/35 to-transparent"
        aria-hidden
      />

      <div className="relative block h-[56vh] min-h-[24rem] w-full md:hidden">
        <img
          src={crazyHero}
          alt="Crazy Legs em foto promocional da banda"
          className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,6,0.2)_0%,rgba(8,6,6,0.34)_42%,rgba(8,6,6,0.82)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-film-grain-section opacity-[0.05] mix-blend-overlay" aria-hidden />
      </div>

      <div className="relative min-h-[100vh] w-full">
        {/* —— Camada 1 · fundo —— */}
        <img
          src={editorialAssets.crazyLegs}
          alt=""
          className="absolute inset-0 hidden h-full min-h-full w-full object-cover object-[center_36%] contrast-[1.04] brightness-[0.56] md:block"
        />
        <TextureBg
          src={textureAssets.concreteWall}
          className="hidden z-[1] md:block"
          opacity={0.022}
          blendMode="soft-light"
        />
        <TextureBg
          src={textureAssets.paperFiber}
          className="hidden z-[1] md:block"
          opacity={0.022}
          blendMode="soft-light"
        />
        <div
          className="absolute inset-0 z-[1] hidden bg-[radial-gradient(ellipse_78%_55%_at_50%_0%,rgba(255,255,255,0.018),transparent_64%)] md:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] hidden bg-film-grain-section opacity-[0.05] mix-blend-overlay md:block"
          aria-hidden
        />
        {/* Colagem · traços (afastados do eixo central — rosto) */}
        <div
          className="pointer-events-none absolute left-[4%] top-[58%] z-[5] hidden h-px w-32 rotate-[22deg] bg-white/22 md:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[3%] top-[48%] z-[5] hidden h-24 w-px rotate-[6deg] bg-gradient-to-b from-white/28 to-transparent lg:block"
          aria-hidden
        />

        {/* Sticker logo — canto superior direito, fora da faixa dos três recortes grandes */}
        <div
          className="absolute right-[2%] top-[6%] z-[34] hidden w-[min(40vw,140px)] drop-shadow-[0_20px_45px_rgba(0,0,0,0.78)] md:block sm:right-[3%] sm:top-[7%] sm:w-[min(32vw,188px)] lg:right-[max(1.5%,-0.5rem)] lg:top-[6.5%] lg:w-[min(22vw,220px)]"
          style={{ transform: "rotate(3.2deg)" }}
        >
          <img
            src={editorialAssets.crazyLegsLogo}
            alt="Logotipo do Crazy Legs"
            className="w-full object-contain [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.12))]"
          />
        </div>

        {/* Três recortes — mesma escala visual (~400px cap); laterais/inferiores para liberar rosto (fundo object-[center_36%]) */}
        {(
          [
            {
              key: "main",
              v: main,
              className:
                "bottom-[9%] left-[2%] z-[40] hidden w-[min(94vw,360px)] md:block lg:bottom-[11%] lg:left-[3%] lg:w-[min(94vw,400px)]",
              style: { transform: "rotate(-2.5deg)" },
            },
            {
              key: "eu",
              v: eu,
              className:
                "bottom-[min(40%,360px)] left-[2%] z-[39] hidden w-[min(94vw,360px)] md:block lg:bottom-[38%] lg:left-[2.5%] lg:w-[min(94vw,400px)]",
              style: { transform: "rotate(3.6deg)" },
            },
            {
              key: "vlv",
              v: vlv,
              className:
                "bottom-[min(30%,280px)] left-[4%] z-[41] hidden w-[min(92vw,320px)] md:block lg:bottom-[6%] lg:left-auto lg:right-[calc(3.5%+31rem)] lg:w-[min(34vw,360px)] xl:right-[calc(3.5%+33rem)] xl:w-[min(32vw,380px)]",
              style: { transform: "rotate(-2deg)" },
            },
          ] as const
        ).map(({ key, v, className, style }) => (
          <div key={key} className={`absolute ${className}`} style={style}>
            <div
              className="relative border-2 border-cd-cherry/40 bg-black/95 p-1 shadow-[0_0_0_1px_rgba(0,0,0,0.8),0_28px_70px_rgba(0,0,0,0.75),0_0_48px_rgba(244,224,77,0.06)]"
              role="presentation"
            >
              <div
                className="pointer-events-none absolute -inset-[6px] border border-cd-neon/15 opacity-60"
                aria-hidden
              />
              <div className="relative aspect-video overflow-hidden bg-black ring-1 ring-cd-mist/10">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-1/3 bg-gradient-to-b from-black/55 to-transparent"
                  aria-hidden
                />
                <iframe
                  title={`Crazy Legs — ${v.label}`}
                  src={youtubeEmbed(v.id)}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-film-grain-section opacity-[0.17] mix-blend-overlay"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/4 bg-gradient-to-t from-black/70 to-transparent"
                  aria-hidden
                />
              </div>
            </div>
            <p className="mt-2 font-display text-[7px] tracking-[0.32em] text-cd-teal/70">{v.tag}</p>
          </div>
        ))}

        {/* Bloco editorial + release */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-[28]">
          <div className="pointer-events-auto absolute bottom-[3%] left-[3%] right-[3%] sm:left-[4.5%] sm:right-[4.5%] lg:bottom-[6%] lg:left-[3.5%] lg:right-[3.5%]">
            <div className="ml-auto max-w-[32rem] lg:w-[min(100%,30rem)]">
                <div className="border border-cd-mist/[0.1] bg-[linear-gradient(145deg,rgba(11,10,9,0.92)_0%,rgba(5,4,3,0.96)_100%)] px-5 py-6 shadow-[0_0_0_1px_rgba(122,19,33,0.12),0_26px_70px_rgba(0,0,0,0.62)] backdrop-blur-md sm:px-7 sm:py-7">
                  <p className="font-display text-[8px] font-medium tracking-[0.4em] text-cd-teal">ARQUIVO · PROJETO</p>
                  <h1 className="mt-4 font-rock text-[clamp(1.8rem,4.8vw,2.85rem)] uppercase leading-[0.94] tracking-[0.08em] text-[#ebe3d4]">
                    {crazyLegsIntro.title}
                  </h1>
                  <p className="mt-3 font-display text-[9px] tracking-[0.24em] text-cd-neon/80">
                    {crazyLegsIntro.subtitle}
                  </p>
                  <div className="mt-6 h-px w-14 bg-gradient-to-r from-cd-neon/70 via-cd-neon/30 to-transparent" aria-hidden />
                  <div className="mt-6 space-y-4">
                    {crazyLegsIntro.paragraphs.map((p, i) => (
                      <p key={i} className="font-body text-[0.95rem] leading-[1.8] text-cd-wash/[0.88] lg:text-[0.875rem] lg:leading-[1.76]">
                        {p}
                      </p>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-cd-mist/[0.08] pt-6">
                    <button
                      type="button"
                      onClick={() => setReleaseOpen(true)}
                      aria-expanded={releaseOpen}
                      aria-controls={`${uid}-press-sheet`}
                      className="cd-btn-primary !px-5 !py-3 !text-[8px] !tracking-[0.24em]"
                    >
                      Ler press release
                    </button>
                    <a
                      href={crazyLegsYoutubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cd-btn-ghost !min-h-11 !w-11 !px-0 !py-0"
                      aria-label="YouTube"
                    >
                      <SocialIcon kind="youtube" />
                    </a>
                    <a
                      href={crazyLegsContact.instagramHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cd-btn-ghost !min-h-11 !w-11 !px-0 !py-0"
                      aria-label={crazyLegsContact.instagramLabel}
                    >
                      <SocialIcon kind="instagram" />
                    </a>
                    <a
                      href={crazyLegsContact.spotifyHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cd-btn-ghost !min-h-11 !w-11 !px-0 !py-0"
                      aria-label={crazyLegsContact.spotifyLabel}
                    >
                      <SocialIcon kind="spotify" />
                    </a>
                  </div>
                  <nav aria-label="Explorar conteudo relacionado" className="mt-5 flex flex-wrap gap-x-4 gap-y-3">
                    {[
                      { href: "/#discos", label: "Discografia de Caio Durazzo" },
                      { href: "/#agenda", label: "Agenda de shows" },
                      { href: "/#booking", label: "Contratação" },
                      { href: "/aulas", label: "Aulas" },
                    ].map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="font-display text-[8px] font-semibold uppercase tracking-[0.26em] text-cd-wash/65 transition-colors hover:text-cd-mist"
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-[3%] pb-10 pt-8 md:hidden">
        <div className="mx-auto max-w-[32rem]">
          <p className="mb-4 font-display text-[8px] tracking-[0.3em] text-cd-teal/75">VIDEOS</p>
          <div className="space-y-5">
            {crazyLegsVideos.map((video) => (
              <div
                key={video.id}
                className="overflow-hidden border-2 border-cd-cherry/35 bg-black/90 p-1 shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_32px_rgba(244,224,77,0.05)]"
              >
                <div className="relative aspect-video overflow-hidden bg-black ring-1 ring-cd-mist/10">
                  <iframe
                    title={`Crazy Legs — ${video.label}`}
                    src={youtubeEmbed(video.id)}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <p className="px-1 pb-1 pt-2 font-display text-[7px] tracking-[0.26em] text-cd-teal/70">{video.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {releaseOpen ? (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto px-4 py-8 sm:z-[120] sm:px-6 lg:px-10"
          role="presentation"
          onClick={() => setReleaseOpen(false)}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,8,11,0.78)_0%,rgba(12,5,7,0.9)_100%)] backdrop-blur-[2px]" />
          <article
            ref={sheetRef}
            id={`${uid}-press-sheet`}
            role="region"
            aria-labelledby={`${uid}-press-title`}
            className="clip-torn-top clip-torn-bottom relative z-[1] max-h-[min(82vh,52rem)] w-full max-w-[min(92vw,58rem)] overflow-y-auto border border-[#2a261d]/25 shadow-[18px_30px_60px_rgba(0,0,0,0.58),0_0_0_1px_rgba(255,255,255,0.04)_inset]"
            style={{
              backgroundColor: "#ede8d6",
              backgroundImage: [
                "linear-gradient(90deg, rgba(180,72,60,0.07) 0, rgba(180,72,60,0.07) 2px, transparent 2px)",
                "repeating-linear-gradient(transparent, transparent 29px, rgba(40,35,28,0.07) 29px, rgba(40,35,28,0.07) 30px)",
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
              ].join(", "),
              backgroundSize: "100% 100%, 100% 30px, 200px 200px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <TextureBg src={textureAssets.paperFiber} opacity={0.11} blendMode="multiply" />
            <div
              className="pointer-events-none absolute inset-0 bg-halftone-fine opacity-[0.05] mix-blend-multiply"
              aria-hidden
            />
            <button
              type="button"
              data-close-sheet
              onClick={() => setReleaseOpen(false)}
              className="absolute right-5 top-[4.9rem] z-[3] flex h-10 w-10 items-center justify-center border border-[#2a261d]/18 bg-[#f0ebd8]/92 font-display text-xl leading-none text-[#3a3428]/75 transition-colors hover:border-[#2a261d]/35 hover:text-[#141210] sm:right-7 sm:top-[5.6rem] lg:right-9 lg:top-[5.9rem]"
              aria-label="Fechar press release"
            >
              ×
            </button>

            <div className="relative z-[1] px-5 pb-7 pt-14 sm:px-7 sm:pb-8 sm:pt-16 lg:px-9 lg:pb-10 lg:pt-[4.5rem]">
              <header className="border-b border-[#1a1814]/12 pb-5 pr-12 sm:pr-16">
                <p className="font-display text-[9px] tracking-[0.36em] text-[#3a3428]/55">DOCUMENTO</p>
                <h3
                  id={`${uid}-press-title`}
                  className="mt-4 font-heading text-[clamp(1.45rem,3vw,2.3rem)] font-black uppercase leading-[0.96] tracking-[0.1em] text-[#141210] sm:mt-5"
                >
                  Press Release
                </h3>
                <p className="mt-2 font-display text-[10px] tracking-[0.26em] text-[#3a3428]/65">Crazy Legs</p>
              </header>

              <div className="pt-5 lg:pt-6">
                <div>
                  <p className="mb-6 font-display text-[8px] leading-relaxed tracking-wide text-[#3a3428]/48">
                    Fonte do texto integral: {crazyLegsPressMeta.documentCitation}
                  </p>
                  <div className="space-y-4 font-serif text-[0.97rem] leading-[1.78] text-[#141210]/[0.9]">
                    {pressReleaseParagraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      ) : null}

      {/* Lightbox vídeo (mobile / foco) */}
      {activeVideoId ? (
        <div
          className="fixed inset-0 z-[400] flex flex-col items-center justify-center bg-black/93 p-4 backdrop-blur-[2px]"
          role="presentation"
          onClick={() => setActiveVideoId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Reprodução do vídeo"
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveVideoId(null)}
              className="mb-3 ml-auto block font-display text-[10px] tracking-[0.25em] text-white/72 transition-colors hover:text-white"
            >
              FECHAR
            </button>
            <div className="relative aspect-video overflow-hidden border border-white/18 bg-black shadow-2xl">
              <iframe
                title="Crazy Legs — vídeo"
                src={youtubeEmbed(activeVideoId, true)}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
