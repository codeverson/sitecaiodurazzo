import { editorialAssets } from "../data/editorialAssets";
import { textureAssets } from "../data/textureAssets";
import { releaseCopy } from "../data/siteCopy";
import TextureBg from "./TextureBg";
import { SectionBridgeBottom, SectionBridgeTop } from "./SectionBridges";

export default function ReleaseSection() {
  return (
    <section
      id="release"
      className="relative scroll-mt-24 bg-[#040302] py-16 sm:py-24 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(44,10,16,0.35)_0%,transparent_35%,transparent_65%,rgba(5,4,3,0.9)_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-film-grain-section opacity-[0.12] mix-blend-overlay" aria-hidden />
      <TextureBg src={textureAssets.concreteWall} opacity={0.08} blendMode="multiply" />
      <SectionBridgeTop />
      <SectionBridgeBottom />

      <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-9 lg:px-9 hd-laptop:px-7 xl:px-12">
        <div className="relative overflow-visible">
          <div className="absolute -left-2 -top-3 z-[2] border border-cd-neon/50 bg-cd-deep px-4 py-2 font-display text-[9px] font-semibold tracking-[0.42em] text-cd-neon shadow-glow-sm">
            PRESS KIT
          </div>

          <div className="grid gap-0 border-2 border-cd-mist/15 bg-cd-panel/30 lg:grid-cols-[minmax(0,42%)_1fr]">
            <div className="relative min-h-[280px] overflow-hidden lg:min-h-[520px]">
              <TextureBg src={textureAssets.paperFiber} opacity={0.12} blendMode="multiply" />
              <img
                src={editorialAssets.release}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-[center_28%] brightness-[0.45] contrast-[1.08]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#040302]/90 lg:to-[#040302]/70" aria-hidden />
              <div className="pointer-events-none absolute inset-0 bg-halftone-fine opacity-[0.1] mix-blend-soft-light" aria-hidden />

              <div className="absolute bottom-6 left-6 z-[1] max-w-[12rem] border-l-2 border-cd-teal pl-4">
                <p className="font-display text-[8px] tracking-[0.36em] text-cd-teal">DOCUMENTO</p>
                <p className="mt-2 font-heading text-xs font-bold uppercase tracking-[0.2em] text-cd-mist">Release oficial</p>
              </div>
            </div>

            <div className="relative flex flex-col justify-center border-t border-cd-mist/10 bg-[#050302]/95 px-7 py-12 sm:px-10 sm:py-14 lg:border-l lg:border-t-0 lg:px-12 xl:px-14 lg:py-14 xl:py-16">
              <div
                className="pointer-events-none absolute right-6 top-6 h-24 w-24 rounded-full border border-dashed border-cd-cherry/25"
                aria-hidden
              />
              <p className="font-display text-[10px] font-semibold tracking-[0.42em] text-cd-teal">{releaseCopy.label.toUpperCase()}</p>
              <h2 className="cd-display-title mt-5 font-rock text-[clamp(1.85rem,4vw,3rem)] uppercase tracking-[0.06em] text-cd-mist">
                {releaseCopy.headline}
              </h2>
              <p className="mt-4 max-w-md font-display text-[10px] font-semibold uppercase tracking-[0.26em] leading-relaxed text-cd-muted">
                {releaseCopy.dek}
              </p>

              <div className="mt-10 max-w-2xl space-y-7 border-t border-cd-cherry/25 pt-10">
                {releaseCopy.body.map((p, i) => (
                  <p
                    key={i}
                    className={[
                      "font-body leading-[1.9] text-cd-wash/88",
                      i === 0 ? "text-[1.08rem] text-cd-mist/92" : "text-[1rem]",
                    ].join(" ")}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
