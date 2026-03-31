import { crazyLegsClosing } from "../data/crazyLegsEditorial";

export default function CrazyLegsClosingSection() {
  return (
    <section className="relative isolate overflow-x-clip bg-transparent py-14 text-cd-mist sm:py-16 lg:py-20">
      <div className="relative z-10 mx-auto max-w-[90rem] px-6 sm:px-10 lg:px-14 xl:px-16">
        <div className="mx-auto max-w-[62rem] border border-cd-mist/[0.08] bg-[linear-gradient(180deg,rgba(18,8,10,0.76)_0%,rgba(8,4,5,0.9)_100%)] px-6 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <p className="text-center font-display text-[9px] font-semibold tracking-[0.42em] text-cd-teal">
            {crazyLegsClosing.kicker}
          </p>
          <h2 className="cd-display-title mx-auto mt-5 max-w-[16ch] text-center font-rock text-[clamp(1.7rem,4.6vw,2.8rem)] uppercase leading-[1] tracking-[0.08em] text-[#ebe3d4]">
            {crazyLegsClosing.title}
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-cd-neon/55 to-transparent" aria-hidden />

          <div className="mx-auto mt-7 max-w-[44rem] space-y-5 text-center">
            {crazyLegsClosing.paragraphs.map((paragraph) => (
              <p key={paragraph} className="font-body text-[0.98rem] leading-[1.78] text-cd-wash/[0.88] sm:text-[1.02rem]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
