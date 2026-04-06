import { useEffect, useMemo, useState } from "react";
import { agendaCopy, contactLinks } from "../data/siteCopy";
import { useShows } from "../context/ShowsContext";
import {
  compareShowDates,
  isShowPast,
  parseShowDate,
  startOfToday,
} from "../lib/showDates";

type AgendaFilterKey = "upcoming" | "all" | "past";

const FILTERS: [AgendaFilterKey, string][] = [
  ["upcoming", "Próximos"],
  ["all", "Todos"],
  ["past", "Realizados"],
];

export default function AgendaSection() {
  const { shows } = useShows();
  const [filter, setFilter] = useState<AgendaFilterKey>("upcoming");
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  const filteredSorted = useMemo(() => {
    const now = startOfToday();
    let list = [...shows].sort((a, b) => compareShowDates(a.date, b.date));
    if (filter === "upcoming") {
      list = list.filter((s) => parseShowDate(s.date) >= now);
    } else if (filter === "past") {
      list = list.filter((s) => parseShowDate(s.date) < now);
    }
    return list;
  }, [shows, filter]);

  return (
    <section
      id="agenda"
      className="relative isolate flex scroll-mt-24 flex-col overflow-x-clip bg-transparent py-12 text-cd-mist sm:py-14 lg:min-h-[100vh] lg:py-16"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 items-center px-6 sm:px-10 lg:px-10 hd-laptop:px-7 xl:px-12 2xl:px-16">
        <div className="w-full">
          <header
            className={[
              "max-w-3xl transition-all duration-1000 ease-out",
              entered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            ].join(" ")}
          >
            <p className="font-display text-[9px] font-semibold tracking-[0.48em] text-cd-teal">
              {agendaCopy.title.toUpperCase()}
            </p>
            <h2 className="cd-display-title mt-5 font-rock text-[clamp(1.65rem,3.6vw,2.65rem)] uppercase leading-[1.05] tracking-[0.08em] text-[#ebe3d4]">
              {agendaCopy.subtitle}
            </h2>
            <div
              className="mt-6 h-px w-14 bg-gradient-to-r from-cd-neon/70 via-cd-neon/35 to-transparent sm:mt-7"
              aria-hidden
            />
          </header>

          <nav
            className={[
              "mt-8 flex flex-wrap gap-x-10 gap-y-2 border-b border-cd-mist/[0.08] pb-px sm:mt-9",
              "transition-all duration-1000 delay-100 ease-out",
              entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            ].join(" ")}
            aria-label="Recortes da agenda"
          >
            {FILTERS.map(([key, label]) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={[
                    "-mb-px border-b-2 pb-3 font-display text-[9px] font-semibold tracking-[0.32em] transition-colors",
                    active
                      ? "border-cd-teal/80 text-cd-mist"
                      : "border-transparent text-cd-faint hover:border-cd-mist/15 hover:text-cd-wash/65",
                  ].join(" ")}
                >
                  {label.toUpperCase()}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 sm:mt-10 lg:mt-12">
            {filteredSorted.length === 0 ? (
              <div className="rounded-sm border border-cd-mist/[0.06] bg-cd-mist/[0.02] px-6 py-20 text-center sm:py-24">
                <p className="font-display text-[9px] font-semibold tracking-[0.42em] text-cd-teal/80">AGENDA</p>
                <p className="mx-auto mt-6 max-w-md font-body text-[0.98rem] leading-[1.82] text-cd-wash/75 lg:text-[0.9rem] lg:leading-[1.78]">
                  {filter === "upcoming" ? agendaCopy.empty : "Nenhum show neste recorte."}
                </p>
              </div>
            ) : (
              <ul className="space-y-3 sm:space-y-4">
                {filteredSorted.map((s) => {
                  const d = parseShowDate(s.date);
                  const past = isShowPast(s.date);
                  const day = String(d.getDate()).padStart(2, "0");
                  const mon = d
                    .toLocaleDateString("pt-BR", { month: "short" })
                    .replace(".", "")
                    .toUpperCase();
                  const yr = d.getFullYear();
                  const cityState = [s.city, s.state].filter(Boolean).join(" · ");

                  return (
                    <li key={s.id}>
                      <article
                        className={[
                          "group relative overflow-hidden border border-cd-mist/[0.08] bg-[linear-gradient(125deg,rgba(31,12,16,0.88)_0%,rgba(21,8,10,0.94)_48%,rgba(12,5,7,0.98)_100%)] shadow-[0_16px_48px_rgba(0,0,0,0.38)]",
                          "transition-[border-color,box-shadow] duration-300 hover:border-cd-mist/[0.14] hover:shadow-[0_20px_56px_rgba(0,0,0,0.42)]",
                          past ? "opacity-[0.52]" : "",
                          "hover:opacity-100",
                        ].join(" ")}
                      >
                        <div
                          className="pointer-events-none absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cd-cherry/90 via-cd-teal/75 to-cd-cherry/70"
                          aria-hidden
                        />
                        <div
                          className="pointer-events-none absolute left-[11px] top-4 bottom-4 w-px bg-[repeating-linear-gradient(180deg,rgba(237,228,212,0.14),rgba(237,228,212,0.14)_3px,transparent_3px,transparent_6px)] opacity-80"
                          aria-hidden
                        />

                        <div
                          className={[
                            "relative grid gap-6 px-5 py-7 sm:px-7 sm:py-8 lg:grid-cols-[6.5rem_1fr_minmax(7.5rem,9rem)_minmax(8.5rem,10rem)] lg:items-start lg:gap-8 lg:py-7",
                            "pl-7 sm:pl-9",
                          ].join(" ")}
                        >
                          <div className="min-w-0">
                            <p className="font-display text-[7px] font-medium tracking-[0.36em] text-cd-faint lg:hidden">
                              DATA
                            </p>
                            <p className="mt-1 font-rock text-[clamp(2rem,6vw,2.75rem)] leading-[0.9] tracking-[0.04em] text-[#ebe3d4] lg:mt-0">
                              {day}
                            </p>
                            <p className="mt-1.5 font-display text-[8px] font-semibold tracking-[0.28em] text-cd-neon/85">
                              {mon} · {yr}
                            </p>
                            {past ? (
                              <p className="mt-2.5 font-display text-[7px] tracking-[0.3em] text-cd-muted">REALIZADO</p>
                            ) : null}
                          </div>

                          <div className="min-w-0 border-t border-cd-mist/[0.07] pt-6 lg:border-t-0 lg:pt-0">
                            <p className="font-display text-[7px] font-medium tracking-[0.36em] text-cd-faint lg:hidden">
                              SHOW
                            </p>
                            <h3 className="mt-1 font-rock text-[clamp(1.05rem,2.4vw,1.35rem)] uppercase leading-[1.12] tracking-[0.07em] text-[#f2ead8] sm:mt-0">
                              {s.venue}
                            </h3>
                            {(s.address || s.time || s.price || s.notes) && (
                              <div className="mt-4 space-y-2 font-body text-[0.95rem] leading-[1.8] text-cd-muted lg:text-[0.875rem] lg:leading-[1.76]">
                                {s.address ? <p className="text-cd-wash/78">{s.address}</p> : null}
                                {(s.time || s.price) && (
                                  <p className="font-display text-[9px] tracking-[0.22em] text-cd-wash/55">
                                    {[s.time, s.price].filter(Boolean).join(" · ")}
                                  </p>
                                )}
                                {s.notes ? <p className="text-sm italic text-cd-faint">{s.notes}</p> : null}
                              </div>
                            )}
                          </div>

                          <div className="border-t border-cd-mist/[0.07] pt-5 lg:border-t-0 lg:border-l lg:border-cd-mist/[0.08] lg:pl-6 lg:pt-0">
                            <p className="font-display text-[7px] font-medium tracking-[0.36em] text-cd-faint lg:hidden">
                              LOCAL
                            </p>
                            <p className="mt-1 font-body text-[0.95rem] font-medium leading-[1.8] tracking-[0.04em] text-cd-wash/82 lg:mt-0 lg:text-[0.875rem] lg:leading-[1.76]">
                              {cityState || "—"}
                            </p>
                          </div>

                          <div className="flex justify-start border-t border-cd-mist/[0.07] pt-5 lg:border-t-0 lg:justify-end lg:pt-0">
                            {s.link ? (
                              <a
                                href={s.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cd-btn-primary !px-5 !py-2.5 !text-[8px] !tracking-[0.26em]"
                              >
                                INGRESSO
                              </a>
                            ) : (
                              <span
                                className="inline-flex items-center justify-center border border-dashed border-cd-mist/20 bg-black/25 px-5 py-2.5 font-display text-[8px] tracking-[0.24em] text-cd-faint"
                                role="status"
                              >
                                EM BREVE
                              </span>
                            )}
                          </div>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-auto pt-10 sm:pt-12 lg:pt-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10 2xl:gap-14">
              <div className="max-w-xl border-l-[3px] border-cd-teal/50 pl-6 sm:pl-8">
                <p className="font-display text-[8px] font-semibold tracking-[0.38em] text-cd-teal/90">
                  {agendaCopy.bookingKicker.toUpperCase()}
                </p>
                <p className="mt-3 font-body text-[0.95rem] leading-[1.8] text-cd-wash/[0.88] lg:text-[0.875rem] lg:leading-[1.76]">
                  {agendaCopy.bookingLead}
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-wrap gap-3 sm:gap-4">
                <a
                  href={contactLinks.bookShow}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cd-btn-primary"
                >
                  {agendaCopy.bookingCta}
                </a>
              </div>
            </div>
            <div className="mt-12 sm:mt-14" aria-hidden>
              <div className="section-divider-slash" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
