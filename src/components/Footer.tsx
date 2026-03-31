import type { SocialLink } from "../data/mock";
import { footerCopy } from "../data/siteCopy";
import { SectionBridgeTop } from "./SectionBridges";

export default function Footer({
  brandTitle,
  links,
  socials: _socials,
}: {
  brandTitle: string;
  links: Array<{ label: string; href: string }>;
  socials?: SocialLink[];
}) {
  return (
    <footer
      id="contato"
      className="relative scroll-mt-24 border-t border-black/20 bg-[#220C10]"
    >
      <SectionBridgeTop />

      <div className="relative z-10 mx-auto max-w-[88rem] px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
        <div className="max-w-[42rem]">
          <p className="font-rock text-[clamp(1.5rem,3.5vw,2.25rem)] uppercase tracking-[0.14em] text-[#f2ead8]">
            {brandTitle}
          </p>
          <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-[#d9cfbf]/72">{footerCopy.line}</p>
          <div className="mt-8 flex flex-col gap-2 font-body text-sm text-[#efe4d1]">
            <a href="mailto:caiorocker@gmail.com" className="w-fit transition-colors hover:text-white">
              caiorocker@gmail.com
            </a>
            <a href="tel:+5511971735293" className="w-fit transition-colors hover:text-white">
              (11) 97173-5293
            </a>
          </div>
          <nav aria-label="Rodapé" className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#f2ead8]/12 pt-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-display text-[9px] font-semibold tracking-[0.24em] text-[#efe4d1]/62 transition-colors hover:text-white"
              >
                {l.label.toUpperCase()}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-14 border-t border-[#f2ead8]/10 pt-7">
          <p className="font-display text-[9px] font-medium tracking-[0.3em] text-[#efe4d1]/55">
            © {new Date().getFullYear()} {brandTitle}
          </p>
          <p className="mt-3 font-body text-[0.78rem] leading-relaxed text-[#efe4d1]/52">
            Site desenvolvido por Everson Araujo -{" "}
            <a
              href="https://studioema.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              @studioemasp
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
