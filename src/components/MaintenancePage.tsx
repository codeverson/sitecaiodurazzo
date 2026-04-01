import { editorialAssets } from "../data/editorialAssets";
import { contactLinks } from "../data/siteCopy";

export default function MaintenancePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060404] text-cd-mist">
      <div className="absolute inset-0" aria-hidden>
        <img
          src={editorialAssets.maintenance}
          alt="Caio Durazzo em composicao com tres performances musicais"
          className="h-full w-full object-cover object-[center_26%] sm:object-[center_22%] lg:object-[center_20%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,4,4,0.2)_0%,rgba(6,4,4,0.3)_32%,rgba(6,4,4,0.66)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_82%_62%_at_50%_38%,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
        <div className="absolute inset-0 bg-film-grain-section opacity-[0.04] mix-blend-overlay" />
        <div className="absolute inset-x-0 bottom-0 h-[38vh] bg-gradient-to-t from-[#060404] via-[#060404]/56 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2]">
        <div className="mx-auto max-w-[92rem] px-6 py-7 sm:px-10 sm:py-8 lg:px-14 lg:py-9">
          <div className="inline-flex min-w-0 items-center gap-3">
            <span
              className="h-7 w-px shrink-0 bg-gradient-to-b from-transparent via-cd-gold/40 to-transparent sm:h-8"
              aria-hidden
            />
            <span className="font-rock text-[clamp(0.95rem,2.4vw,1.2rem)] uppercase not-italic leading-none tracking-[0.14em] text-[#ebe3d4]">
              Caiodurazzo.com
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-[1] flex min-h-screen items-end px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <section className="w-full">
          <div className="mx-auto max-w-[92rem]">
            <div className="relative max-w-[28rem] overflow-visible border border-cd-mist/[0.1] bg-[linear-gradient(180deg,rgba(11,8,8,0.32)_0%,rgba(9,7,7,0.5)_100%)] px-7 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.34)] backdrop-blur-[2px] sm:px-8 sm:py-9 lg:px-9 lg:py-10">
              <p className="font-display text-[8px] font-semibold tracking-[0.44em] text-cd-teal/88">
                SITE OFICIAL
              </p>
              <h1 className="mt-4 max-w-[8ch] font-rock text-[clamp(1.9rem,5.4vw,3.35rem)] uppercase leading-[0.9] tracking-[0.04em] text-[#f2ead8]">
                <span className="block">Em</span>
                <span className="block">manutençã</span>
              </h1>
              <div
                className="mt-5 h-px w-16 bg-gradient-to-r from-cd-neon/80 via-cd-neon/35 to-transparent"
                aria-hidden
              />
              <p className="mt-6 max-w-[22rem] font-body text-[0.98rem] leading-[1.82] text-cd-wash/[0.92] lg:text-[0.88rem] lg:leading-[1.76]">
                Estamos ajustando o site neste momento. Em breve, o conteudo oficial estara
                novamente disponivel.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/staff"
                  className="inline-flex min-h-11 items-center border border-cd-mist/[0.22] px-5 font-display text-[9px] font-semibold uppercase tracking-[0.28em] text-cd-mist/78 transition-[border-color,color,background-color] hover:border-cd-neon/55 hover:bg-black/20 hover:text-white"
                >
                  Acessar Backstage
                </a>
                <a
                  href={contactLinks.bookShow}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center border border-cd-mist/[0.18] px-5 font-display text-[9px] font-semibold uppercase tracking-[0.28em] text-cd-mist/68 transition-[border-color,color,background-color] hover:border-cd-teal/55 hover:bg-black/20 hover:text-white"
                >
                  Contato para shows
                </a>
              </div>
              <span
                className="pointer-events-none absolute bottom-[-0.26em] right-[-0.18em] inline-block font-rock text-[clamp(1.9rem,5.4vw,3.35rem)] uppercase leading-none tracking-[0.04em] text-[#f2ead8]"
                style={{ transform: "rotate(88deg)" }}
                aria-hidden
              >
                O
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
