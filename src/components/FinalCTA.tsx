import { editorialAssets } from "../data/editorialAssets";
import { textureAssets } from "../data/textureAssets";
import { ctaCopy } from "../data/siteCopy";
import TextureBg from "./TextureBg";
import { SectionBridgeBottom, SectionBridgeTop } from "./SectionBridges";

export default function FinalCTA() {
  return (
    <section className="relative isolate min-h-[min(70vh,640px)] overflow-hidden bg-[#020101]">
      <SectionBridgeTop soft />
      <SectionBridgeBottom soft />
      <div className="absolute inset-y-0 left-0 w-full lg:w-[45%]" aria-hidden>
        <img
          src={editorialAssets.ctaStrip}
          alt=""
          className="h-full w-full object-cover object-[center_40%] brightness-[0.28] contrast-[1.1] saturate-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#020101]/40 to-[#020101] lg:via-transparent" />
      </div>

      <div className="absolute inset-0 lg:left-[38%]" aria-hidden>
        <div className="h-full w-full bg-[linear-gradient(165deg,rgba(44,10,16,0.5)_0%,rgba(2,1,1,0.96)_45%)]" />
        <TextureBg src={textureAssets.concreteWall} opacity={0.12} blendMode="overlay" />
        <div className="absolute inset-0 bg-film-grain-section opacity-25 mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex min-h-[min(70vh,640px)] flex-col justify-center px-6 py-20 sm:px-12 lg:ml-auto lg:max-w-[58%] lg:pr-16 lg:pl-8">
        <p className="font-display text-[10px] font-semibold tracking-[0.45em] text-cd-teal">ENCERRAMENTO</p>
        <h2 className="mt-8 font-rock text-[clamp(2.2rem,6vw,3.8rem)] uppercase leading-[0.95] tracking-[0.06em] text-cd-mist">
          {ctaCopy.title}
        </h2>
        <div className="mt-8 h-px max-w-xs bg-gradient-to-r from-cd-neon/80 to-transparent" aria-hidden />
        <p className="mt-10 max-w-lg font-body text-base leading-[1.85] text-cd-muted sm:text-lg">{ctaCopy.text}</p>
        <a href="#agenda" className="cd-btn-primary mt-12 w-fit">
          {ctaCopy.button}
        </a>
      </div>
    </section>
  );
}
