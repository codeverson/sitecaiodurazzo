import { editorialAssets } from "../data/editorialAssets";
import { textureAssets } from "../data/textureAssets";
import { lessonsCopy } from "../data/siteCopy";
import TextureBg from "./TextureBg";
import { SectionBridgeBottom, SectionBridgeTop } from "./SectionBridges";

export default function LessonsSection() {
  return (
    <section
      id="aulas"
      className="relative scroll-mt-24 overflow-hidden bg-[#030201] py-16 sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_0%_50%,rgba(159,34,51,0.15),transparent_55%)]"
        aria-hidden
      />
      <TextureBg src={textureAssets.concreteWall} opacity={0.08} blendMode="overlay" />
      <div className="pointer-events-none absolute inset-0 bg-film-grain-section opacity-[0.12] mix-blend-overlay" aria-hidden />
      <SectionBridgeTop />
      <SectionBridgeBottom />

      <div className="relative z-10 mx-auto max-w-[88rem] px-5 sm:px-9 lg:px-12">
        <div className="relative lg:flex lg:min-h-[560px] lg:items-stretch">
          <div className="relative min-h-[44vh] w-full lg:absolute lg:inset-y-0 lg:left-0 lg:w-[52%] lg:min-h-0">
            <div
              className="absolute inset-0 overflow-hidden lg:[clip-path:polygon(0_0,100%_0,92%_100%,0_100%)]"
            >
              <img
                src={editorialAssets.lessons}
                alt=""
                className="filter-xerox-soft h-full w-full object-cover object-[center_35%] brightness-[0.4]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030201] via-transparent to-black/30 lg:bg-gradient-to-r" aria-hidden />
            </div>
            <div className="absolute left-6 top-6 z-[2] font-display text-[9px] font-semibold tracking-[0.4em] text-cd-neon lg:left-10 lg:top-10">
              STUDIO
            </div>
          </div>

          <div className="relative z-[3] -mt-12 border-2 border-cd-teal/30 bg-[#050302]/95 px-8 py-12 shadow-[0_30px_80px_rgba(0,0,0,0.65)] sm:px-10 sm:py-14 lg:ml-auto lg:mt-0 lg:w-[58%] lg:border-l-4 lg:border-cd-neon/40 lg:px-14 lg:py-16">
            <TextureBg src={textureAssets.paperFiber} opacity={0.08} blendMode="soft-light" />
            <div className="relative z-[1]">
              <p className="font-display text-[10px] font-semibold tracking-[0.38em] text-cd-teal">ENSINO</p>
              <h2 className="cd-display-title mt-5 font-rock text-[clamp(2rem,4.5vw,3.2rem)] uppercase tracking-[0.05em] text-cd-mist">
                {lessonsCopy.title}
              </h2>
              <div className="mt-10 max-w-prose space-y-8 border-l border-cd-cherry/40 pl-6">
                <p className="font-body text-[1.02rem] leading-[1.82] text-cd-wash/92">{lessonsCopy.lead}</p>
                <p className="font-body text-[0.96rem] leading-[1.82] text-cd-muted">{lessonsCopy.body}</p>
              </div>
              <a href="#contato" className="cd-btn-primary mt-12">
                {lessonsCopy.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
