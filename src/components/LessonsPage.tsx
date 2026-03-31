import { useEffect } from "react";
import { editorialAssets } from "../data/editorialAssets";
import { contactLinks, lessonsCopy } from "../data/siteCopy";
import { textureAssets } from "../data/textureAssets";
import { parseYoutubeVideoId, youtubeEmbedUrl } from "../lib/youtube";
import TextureBg from "./TextureBg";

export default function LessonsPage() {
  const videoId = parseYoutubeVideoId(lessonsCopy.videoUrl);
  const videoSrc = videoId ? youtubeEmbedUrl(videoId) : null;

  useEffect(() => {
    const prevTitle = document.title;
    document.title = lessonsCopy.seoTitle;

    let meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute("content") ?? null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", lessonsCopy.seoDescription);

    return () => {
      document.title = prevTitle;
      if (prevDescription != null) {
        meta?.setAttribute("content", prevDescription);
      }
    };
  }, []);

  return (
    <main className="bg-transparent text-cd-mist">
      <section
        id="top"
        className="relative isolate overflow-x-clip bg-transparent pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36"
      >
        <div className="absolute inset-0" aria-hidden>
          <img
            src={editorialAssets.lessons}
            alt=""
            className="h-full w-full object-cover object-[center_28%] brightness-[0.52] contrast-[1.04]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.28)_56%,rgba(0,0,0,0.46)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_76%_60%_at_70%_26%,transparent_0%,rgba(0,0,0,0.16)_100%)]" />
          <TextureBg src={textureAssets.concreteWall} opacity={0.035} blendMode="soft-light" />
          <div className="absolute inset-0 bg-film-grain-section opacity-[0.06] mix-blend-overlay" />
        </div>

        <div className="relative z-10 mx-auto max-w-[90rem] px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="max-w-3xl">
            <p className="font-display text-[9px] font-semibold tracking-[0.48em] text-cd-teal">
              {lessonsCopy.eyebrow}
            </p>
            <h1 className="mt-6 font-rock text-[clamp(2.25rem,6vw,4.5rem)] uppercase leading-[0.95] tracking-[0.08em] text-[#f2ead8]">
              {lessonsCopy.title}
            </h1>
            <p className="mt-6 max-w-[44rem] font-body text-[1rem] leading-[1.82] text-cd-wash/[0.9] sm:text-[1.06rem]">
              {lessonsCopy.intro}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={contactLinks.trialLesson}
                target="_blank"
                rel="noopener noreferrer"
                className="cd-btn-primary"
              >
                {lessonsCopy.heroCta}
              </a>
              <a
                href={contactLinks.trialLesson}
                target="_blank"
                rel="noopener noreferrer"
                className="cd-btn-ghost"
              >
                {lessonsCopy.heroSecondaryCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-x-clip bg-transparent pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-12">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_78%_55%_at_50%_0%,rgba(255,255,255,0.018),transparent_64%)]" />
          <TextureBg src={textureAssets.paperFiber} opacity={0.022} blendMode="soft-light" />
          <div className="absolute inset-0 bg-film-grain-section opacity-[0.05] mix-blend-overlay" />
        </div>

        <div className="relative z-10 mx-auto max-w-[90rem] px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="overflow-hidden border border-cd-mist/[0.12] bg-[linear-gradient(160deg,rgba(30,12,16,0.92)_0%,rgba(11,5,7,0.98)_100%)] shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
            <div className="border-b border-cd-mist/[0.08] px-5 py-4 sm:px-7">
              <p className="font-display text-[8px] font-semibold tracking-[0.34em] text-cd-neon/80">
                VÍDEO DE APRESENTAÇÃO
              </p>
            </div>
            <div className="relative aspect-video w-full bg-black">
              {videoSrc ? (
                <iframe
                  title="Aulas de Guitarra e Violão com Caio Durazzo"
                  className="absolute inset-0 h-full w-full border-0"
                  src={videoSrc}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center font-body text-cd-wash/70">
                  URL de vídeo inválida.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-x-clip bg-transparent pb-20 pt-4 sm:pb-24 sm:pt-6 lg:pb-28">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.012)_0%,transparent_36%,transparent_78%,rgba(0,0,0,0.1)_100%)]" />
          <TextureBg src={textureAssets.concreteWall} opacity={0.028} blendMode="soft-light" />
        </div>

        <div className="relative z-10 mx-auto max-w-[90rem] px-6 sm:px-10 lg:px-14 xl:px-16">
          <section className="max-w-[52rem]">
            <h2 className="font-rock text-[clamp(1.5rem,3vw,2.15rem)] uppercase leading-[1.05] tracking-[0.07em] text-[#ebe3d4]">
              Apresentação
            </h2>
            <div className="mt-6 space-y-5">
              {lessonsCopy.presentation.map((paragraph) => (
                <p key={paragraph} className="font-body text-[1rem] leading-[1.82] text-cd-wash/[0.9]">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <section>
              <h2 className="font-rock text-[clamp(1.35rem,2.6vw,1.9rem)] uppercase leading-[1.06] tracking-[0.07em] text-[#ebe3d4]">
                Para quem são as aulas
              </h2>
              <ul className="mt-6 space-y-3">
                {lessonsCopy.audience.map((item) => (
                  <li key={item} className="flex gap-3 font-body text-[0.97rem] leading-[1.72] text-cd-wash/[0.88]">
                    <span className="mt-[0.62rem] h-[5px] w-[5px] shrink-0 bg-cd-neon" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-rock text-[clamp(1.35rem,2.6vw,1.9rem)] uppercase leading-[1.06] tracking-[0.07em] text-[#ebe3d4]">
                O que pode ser desenvolvido
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {lessonsCopy.topics.map((item) => (
                  <li key={item} className="border-b border-cd-mist/[0.08] pb-3 font-body text-[0.95rem] leading-[1.62] text-cd-wash/[0.84]">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="mt-14 grid gap-10 border-t border-cd-mist/[0.08] pt-10 sm:mt-16 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:gap-14">
            <section>
              <h2 className="font-rock text-[clamp(1.35rem,2.6vw,1.9rem)] uppercase leading-[1.06] tracking-[0.07em] text-[#ebe3d4]">
                Como funcionam as aulas
              </h2>
              <p className="mt-6 max-w-[44rem] font-body text-[0.98rem] leading-[1.8] text-cd-wash/[0.88]">
                {lessonsCopy.howItWorks}
              </p>
              <p className="mt-4 font-display text-[9px] font-semibold uppercase tracking-[0.28em] text-cd-neon/82">
                O primeiro passo começa pela aula experimental.
              </p>
            </section>

            <section className="border-t-[3px] border-cd-teal/45 pt-6 lg:border-l-[3px] lg:border-t-0 lg:pl-6 lg:pt-0">
              <h2 className="font-rock text-[clamp(1.3rem,2.4vw,1.7rem)] uppercase leading-[1.08] tracking-[0.07em] text-[#ebe3d4]">
                Por que aprender com Caio Durazzo
              </h2>
              <p className="mt-5 font-body text-[0.96rem] leading-[1.76] text-cd-wash/[0.86]">
                {lessonsCopy.differential}
              </p>
            </section>
          </div>

          <section className="mt-14 border-t border-cd-mist/[0.08] pt-10 sm:mt-16 sm:pt-12">
            <h2 className="font-rock text-[clamp(1.35rem,2.6vw,1.9rem)] uppercase leading-[1.06] tracking-[0.07em] text-[#ebe3d4]">
              Formato
            </h2>
            <p className="mt-6 max-w-[48rem] font-body text-[0.98rem] leading-[1.8] text-cd-wash/[0.88]">
              {lessonsCopy.format}
            </p>
          </section>

          <section className="mt-14 border-t border-cd-mist/[0.08] pt-10 sm:mt-16 sm:pt-12">
            <h2 className="font-rock text-[clamp(1.35rem,2.6vw,1.9rem)] uppercase leading-[1.06] tracking-[0.07em] text-[#ebe3d4]">
              Perguntas frequentes
            </h2>
            <div className="mt-6 grid gap-5">
              {lessonsCopy.faq.map((item) => (
                <div
                  key={item.question}
                  className="border border-cd-mist/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.015)_0%,rgba(255,255,255,0.02)_100%)] px-5 py-5 sm:px-6 sm:py-6"
                >
                  <p className="font-display text-[8px] font-semibold tracking-[0.32em] text-cd-teal/85">
                    FAQ
                  </p>
                  <h3 className="mt-3 max-w-[44rem] font-rock text-[clamp(1.05rem,2vw,1.28rem)] uppercase leading-[1.14] tracking-[0.06em] text-[#efe6d8]">
                    {item.question}
                  </h3>
                  <div className="mt-4 h-px w-10 bg-gradient-to-r from-cd-neon/75 to-transparent" aria-hidden />
                  <p className="mt-4 max-w-[52rem] font-body text-[0.97rem] leading-[1.8] text-cd-wash/[0.86] sm:text-[0.99rem]">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14 border-t border-cd-mist/[0.08] pt-10 sm:mt-16 sm:pt-12">
            <div className="max-w-[42rem]">
              <h2 className="font-rock text-[clamp(1.45rem,2.7vw,2rem)] uppercase leading-[1.04] tracking-[0.07em] text-[#ebe3d4]">
                Aulas de guitarra e violão com acompanhamento individual
              </h2>
              <p className="mt-5 font-body text-[1rem] leading-[1.8] text-cd-wash/[0.9]">
                {lessonsCopy.finalLead}
              </p>
              <p className="mt-4 font-body text-[0.96rem] leading-[1.76] text-cd-muted">
                {lessonsCopy.finalText}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={contactLinks.trialLesson}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cd-btn-primary"
                >
                  {lessonsCopy.cta}
                </a>
                <a
                  href={contactLinks.trialLesson}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cd-btn-ghost"
                >
                  {lessonsCopy.heroSecondaryCta}
                </a>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
