import { useEffect } from "react";
import { editorialAssets } from "../data/editorialAssets";
import { bookingCopy, contactLinks } from "../data/siteCopy";

export default function BookingSection() {
  useEffect(() => {
    const scrollIfBooking = () => {
      if (window.location.hash !== "#booking") return;
      window.setTimeout(() => {
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    };

    scrollIfBooking();
    window.addEventListener("hashchange", scrollIfBooking);
    return () => window.removeEventListener("hashchange", scrollIfBooking);
  }, []);

  return (
    <section
      id="booking"
      className="relative scroll-mt-24 overflow-hidden bg-transparent py-[4.5rem] sm:py-[5.5rem] lg:py-[6.5rem]"
    >
      <div className="relative z-[1] mx-auto max-w-[90rem] px-6 sm:px-10 lg:px-14 xl:px-16">
        <div className="mx-auto max-w-[76rem]">
          <div className="grid gap-10 sm:gap-12 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] xl:items-start xl:gap-14">
            <div className="max-w-[39rem]">
              <p className="font-display text-[10px] font-semibold tracking-[0.42em] text-cd-teal/95">
                {bookingCopy.kicker}
              </p>
              <h2 className="cd-display-title mt-5 max-w-[14ch] font-rock text-[clamp(1.95rem,8vw,3.7rem)] uppercase leading-[0.96] tracking-[0.05em] text-cd-mist [text-shadow:0_0_60px_rgba(0,0,0,0.8)] sm:max-w-[12ch] sm:tracking-[0.055em]">
                {bookingCopy.title}
              </h2>
              <div className="mt-6 h-px w-20 bg-gradient-to-r from-cd-neon/75 via-cd-neon/35 to-transparent" aria-hidden />
              <p className="mt-8 max-w-[36rem] font-body text-[0.98rem] leading-[1.82] text-cd-wash/[0.92] lg:text-[0.9rem] lg:leading-[1.78]">
                {bookingCopy.lead}
              </p>
              <p className="mt-5 max-w-[35rem] font-body text-[0.95rem] leading-[1.8] text-cd-muted/95 lg:text-[0.875rem] lg:leading-[1.76]">
                {bookingCopy.note}
              </p>

              <div className="mt-8 max-w-[37rem] border-y border-cd-mist/[0.08] py-5">
                <p className="font-display text-[8px] font-semibold uppercase tracking-[0.34em] text-cd-faint/90">
                  {bookingCopy.formatsLabel}
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {bookingCopy.formats.map((format, index) => (
                    <span
                      key={format}
                      className={[
                        "inline-flex min-h-9 items-center px-4 font-display text-[10px] uppercase tracking-[0.22em]",
                        index === 0
                          ? "bg-cd-teal/[0.1] text-cd-teal"
                          : index === 1
                            ? "bg-cd-neon/[0.12] text-cd-neon"
                            : "bg-cd-mist/[0.07] text-cd-wash/[0.9]",
                      ].join(" ")}
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-col items-start gap-5">
                <p className="max-w-[30rem] font-display text-[9px] uppercase tracking-[0.24em] text-cd-faint/78">
                  {bookingCopy.support}
                </p>
                <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                  <a
                    href={contactLinks.bookShow}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cd-btn-primary !px-10 !py-4 !text-[10px]"
                  >
                    {bookingCopy.ctaPrimary}
                  </a>
                  <a href="#agenda" className="cd-btn-ghost !px-8 !py-4 !text-[10px]">
                    {bookingCopy.ctaAgenda}
                  </a>
                </div>
              </div>
            </div>

            <div className="xl:pt-2">
              <div className="relative overflow-hidden bg-[#12080b]">
                <img
                  src={editorialAssets.discographyBg}
                  alt={bookingCopy.photoAlt}
                  className="aspect-[4/5] w-full object-cover object-center"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,2,1,0.04)_0%,rgba(3,2,1,0.18)_100%)]" aria-hidden />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080405]/88 via-[#080405]/26 to-transparent" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
