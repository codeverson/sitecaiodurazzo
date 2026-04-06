import crazyLegsPoster from "../../assets/crazylegs/cartaz-crazy-legs07.webp";
import crazyLegsArchive from "../../assets/crazylegs/67e6596c4be84f0ba9ba100de1d0654e.webp";
import crazyLegsBluePoster from "../../assets/crazylegs/crazylegs.jpg";
import crazyLegsJackTriumph from "../../assets/crazylegs/1900x1900-000000-80-0-0.jpg";
import crazyLegsStudio from "../../assets/crazylegs/crazylegs1-scaled.jpg";
import crazyLegsBand from "../../assets/crazylegs/crazy_legs.jpg";
import crazyLegsPortrait from "../../assets/crazylegs/crazylegs01.jpg";
import { crazyLegsInstitutional } from "../data/crazyLegsEditorial";

export default function CrazyLegsIntroSection() {
  const collageItems = [
    {
      src: crazyLegsBand,
      alt: "Crazy Legs em foto de arquivo com formação da banda",
      className: "col-span-4 -rotate-[1deg]",
    },
    {
      src: crazyLegsPortrait,
      alt: "Crazy Legs em retrato de arquivo",
      className: "col-span-4 translate-y-2 rotate-[1.4deg]",
    },
    {
      src: crazyLegsArchive,
      alt: "Crazy Legs em imagem de arquivo",
      className: "col-span-4 -rotate-[1.2deg]",
    },
    {
      src: crazyLegsStudio,
      alt: "Crazy Legs em foto de estúdio",
      className: "col-span-3 -mt-1 -rotate-[2deg]",
    },
    {
      src: crazyLegsPoster,
      alt: "Cartaz de arquivo do Crazy Legs",
      className: "col-span-5",
    },
    {
      src: crazyLegsBluePoster,
      alt: "Cartaz azul de arquivo do Crazy Legs",
      className: "col-span-4 translate-y-1 rotate-[1.1deg]",
    },
    {
      src: crazyLegsJackTriumph,
      alt: "Arte de lançamento ligada ao Crazy Legs",
      className: "col-span-4 -mt-2 -rotate-[1.8deg]",
    },
  ] as const;
  return (
    <section
      id="crazy-legs-intro"
      className="relative isolate flex min-h-[100vh] overflow-x-clip scroll-mt-24 bg-transparent py-10 text-cd-mist sm:scroll-mt-28 sm:py-12 min-wide:scroll-mt-0 lg:py-14"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-6 sm:px-10 lg:px-10 hd-laptop:px-7 xl:px-12 2xl:px-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-x-6 xl:gap-x-8 2xl:gap-x-12">
          <div className="order-2 lg:order-1 lg:col-span-5 lg:pr-4 xl:pr-6 2xl:pr-10">
            <header>
              <p className="font-display text-[9px] font-semibold tracking-[0.44em] text-cd-teal">
                {crazyLegsInstitutional.kicker}
              </p>
              <h2 className="cd-display-title mt-4 max-w-[15ch] font-rock text-[clamp(1.55rem,4.2vw,2.7rem)] uppercase leading-[0.98] tracking-[0.07em] text-[#ebe3d4] hd-laptop:text-[clamp(1.45rem,3.5vw,2.25rem)]">
                {crazyLegsInstitutional.title}
              </h2>
              <div className="mt-5 h-px w-16 bg-gradient-to-r from-cd-neon/70 via-cd-neon/35 to-transparent" aria-hidden />
            </header>

            <div className="mt-6 max-w-[42rem] space-y-4 border-l-[3px] border-cd-teal/35 pl-5 sm:pl-6">
              {crazyLegsInstitutional.paragraphs.map((paragraph) => (
                <p key={paragraph} className="font-body text-[0.95rem] leading-[1.8] text-cd-wash/[0.88] lg:text-[0.875rem] lg:leading-[1.76]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7 lg:pl-4 xl:pl-6 2xl:pl-12">
            <div className="mx-auto hidden max-w-[44rem] shadow-[0_18px_50px_rgba(0,0,0,0.22)] md:block">
              <div className="grid grid-cols-12 gap-1">
                {collageItems.map((item) => (
                  <figure
                    key={item.alt}
                    className={`${item.className} overflow-hidden p-1 shadow-[0_10px_24px_rgba(0,0,0,0.18)]`}
                  >
                    <img src={item.src} alt={item.alt} className="aspect-square h-full w-full object-contain" loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>

            <div className="mx-auto max-w-[24rem] md:hidden">
              <div
                className={[
                  "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2",
                  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
                ].join(" ")}
              >
                {collageItems.map((item) => (
                  <figure
                    key={item.alt}
                    className="w-full shrink-0 snap-center overflow-hidden p-1 shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                  >
                    <img src={item.src} alt={item.alt} className="aspect-square h-full w-full object-contain" loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 sm:pt-10 lg:pt-12" aria-hidden>
          <div className="section-divider-slash" />
        </div>
      </div>
    </section>
  );
}
