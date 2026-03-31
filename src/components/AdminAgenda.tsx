import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import AdminHeroPanel from "./AdminHeroPanel";
import { editorialAssets } from "../data/editorialAssets";
import { useShows } from "../context/ShowsContext";
import { compareShowDates, parseShowDate } from "../lib/showDates";
import AdminDiscographyPanel from "./AdminDiscographyPanel";
import AdminYoutubePanel from "./AdminYoutubePanel";

type AdminTab = "agenda" | "youtube" | "discos" | "hero";

const ADMIN_PASSWORD = "1234";

const field =
  "w-full border border-white/40 bg-black/80 px-4 py-3.5 font-serif text-sm text-white placeholder:text-white/55 transition-[border-color,box-shadow] focus:border-[#c6a15b] focus:outline-none focus:ring-2 focus:ring-[#c6a15b]/35 focus:shadow-[0_0_0_1px_rgba(198,161,91,0.25)]";

const fieldTextarea =
  "w-full border border-white/40 bg-black/80 px-5 py-5 font-serif text-sm leading-relaxed text-white placeholder:text-white/55 transition-[border-color,box-shadow] focus:border-[#c6a15b] focus:outline-none focus:ring-2 focus:ring-[#c6a15b]/35 focus:shadow-[0_0_0_1px_rgba(198,161,91,0.25)] resize-y min-h-[6.75rem]";

const label =
  "mb-2 block font-display text-[10px] tracking-[0.28em] text-white/85";

const sectionTitle =
  "mt-3 font-heading text-2xl font-black uppercase tracking-[0.08em] text-white sm:text-3xl";

const adminDivider = "border-white/[0.15]";

export default function AdminAgenda({
  open,
  onClose,
  standalone = false,
}: {
  open: boolean;
  onClose: () => void;
  standalone?: boolean;
}) {
  const uid = useId();
  const { shows, addShow, deleteShow } = useShows();

  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [pw, setPw] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [formError, setFormError] = useState(false);
  const [flashId, setFlashId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [adminTab, setAdminTab] = useState<AdminTab>("agenda");

  const [fDate, setFDate] = useState("");
  const [fTime, setFTime] = useState("");
  const [fVenue, setFVenue] = useState("");
  const [fCity, setFCity] = useState("");
  const [fState, setFState] = useState("");
  const [fAddress, setFAddress] = useState("");
  const [fPrice, setFPrice] = useState("");
  const [fLink, setFLink] = useState("");
  const [fNotes, setFNotes] = useState("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const clearForm = useCallback(() => {
    setFDate("");
    setFTime("");
    setFVenue("");
    setFCity("");
    setFState("");
    setFAddress("");
    setFPrice("");
    setFLink("");
    setFNotes("");
    setFormError(false);
  }, []);

  useEffect(() => {
    if (!open) {
      setMounted(false);
      setLoggedIn(false);
      setPw("");
      setLoginError(false);
      setPendingDeleteId(null);
      setFlashId(null);
      setAdminTab("agenda");
      return;
    }
    setMounted(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (standalone) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, standalone]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || loggedIn) return;
    const t = window.setTimeout(() => {
      document.getElementById(`${uid}-pw`)?.focus();
    }, 120);
    return () => window.clearTimeout(t);
  }, [open, loggedIn, uid]);

  useEffect(() => {
    if (flashId == null) return;
    const t = window.setTimeout(() => setFlashId(null), 2000);
    return () => window.clearTimeout(t);
  }, [flashId]);

  const doLogin = useCallback(() => {
    if (pw === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setLoginError(false);
      setPw("");
    } else {
      setLoginError(true);
      setPw("");
    }
  }, [pw]);

  const doLogout = useCallback(() => {
    setLoggedIn(false);
    setPendingDeleteId(null);
  }, []);

  const handleAdd = useCallback(() => {
    const venue = fVenue.trim();
    const city = fCity.trim();
    if (!fDate || !venue || !city) {
      setFormError(true);
      return;
    }
    setFormError(false);
    const newId = Date.now();
    addShow({
      id: newId,
      date: fDate,
      time: fTime,
      venue,
      city,
      state: fState.trim().toUpperCase(),
      address: fAddress.trim(),
      price: fPrice.trim(),
      link: fLink.trim(),
      notes: fNotes.trim(),
    });
    clearForm();
    setFlashId(newId);
    showToast("Show incluído na agenda.");
  }, [
    fDate,
    fTime,
    fVenue,
    fCity,
    fState,
    fAddress,
    fPrice,
    fLink,
    fNotes,
    addShow,
    clearForm,
    showToast,
  ]);

  const confirmDelete = useCallback(
    (id: number) => {
      deleteShow(id);
      setPendingDeleteId(null);
      showToast("Show removido.");
    },
    [deleteShow, showToast],
  );

  if (!open) return null;

  const sorted = [...shows].sort((a, b) => compareShowDates(a.date, b.date));

  const modalContent = (
    <>
      <div
        className={[
          `${standalone ? "relative min-h-screen" : "fixed inset-0"} z-[500] flex flex-col bg-[linear-gradient(180deg,rgba(0,0,0,0.75),rgba(0,0,0,0.9))] ${standalone ? "" : "backdrop-blur-md"} transition-opacity duration-300`,
          mounted ? "opacity-100" : "opacity-100",
        ].join(" ")}
        role="presentation"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(198,162,58,0.04),transparent_52%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-film-grain-section opacity-[0.12] mix-blend-overlay"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cd-gold/50 to-transparent"
          aria-hidden
        />

        <div
          className={[
            "relative flex min-h-0 flex-1 flex-col transition-all duration-300 ease-out",
            mounted ? "translate-y-0" : "translate-y-0",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${uid}-title`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Barra superior — mesmo vocabulário do header do site */}
          <header
            className={`sticky top-0 z-[3] flex shrink-0 items-center justify-between border-b ${adminDivider} bg-[linear-gradient(180deg,rgba(6,4,5,0.96),rgba(6,4,5,0.92))] px-5 py-4 backdrop-blur-md sm:px-9 lg:px-12`}
          >
            <div className="min-w-0">
              <p className="font-rock text-[clamp(0.95rem,2.2vw,1.2rem)] uppercase leading-none tracking-[0.14em] text-[#ebe3d4]">
                Caio Durazzo
              </p>
              <p
                id={`${uid}-title`}
                className="mt-1 truncate font-display text-[10px] tracking-[0.28em] text-[#c6a15b]"
              >
                BACKSTAGE
              </p>
            </div>
            <div className="ml-4 flex flex-wrap items-center justify-end gap-3 sm:gap-4 lg:gap-6">
              {loggedIn ? (
                <>
                  <div className="max-w-full overflow-x-auto border border-white/[0.18] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex min-w-max">
                    <button
                      type="button"
                      onClick={() => setAdminTab("agenda")}
                      className={[
                        "min-h-11 px-3 py-2 font-display text-[8px] tracking-[0.22em] transition-colors sm:px-4",
                        adminTab === "agenda"
                          ? "bg-[#c6a15b] text-black"
                          : "text-white/72 hover:bg-white/[0.06] hover:text-white",
                      ].join(" ")}
                    >
                      AGENDA
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminTab("youtube")}
                      className={[
                        "border-l border-white/[0.18] min-h-11 px-3 py-2 font-display text-[8px] tracking-[0.22em] transition-colors sm:px-4",
                        adminTab === "youtube"
                          ? "bg-[#c6a15b] text-black"
                          : "text-white/72 hover:bg-white/[0.06] hover:text-white",
                      ].join(" ")}
                    >
                      YOUTUBE
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminTab("hero")}
                      className={[
                        "border-l border-white/[0.18] min-h-11 px-3 py-2 font-display text-[8px] tracking-[0.22em] transition-colors sm:px-4",
                        adminTab === "hero"
                          ? "bg-[#c6a15b] text-black"
                          : "text-white/72 hover:bg-white/[0.06] hover:text-white",
                      ].join(" ")}
                    >
                      HERO
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminTab("discos")}
                      className={[
                        "border-l border-white/[0.18] min-h-11 px-3 py-2 font-display text-[8px] tracking-[0.22em] transition-colors sm:px-4",
                        adminTab === "discos"
                          ? "bg-[#c6a15b] text-black"
                          : "text-white/72 hover:bg-white/[0.06] hover:text-white",
                      ].join(" ")}
                    >
                      DISCOGRAFIA
                    </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={doLogout}
                    className="font-display text-[9px] tracking-[0.26em] text-white/65 transition-colors hover:text-white"
                  >
                    SAIR
                  </button>
                </>
              ) : null}
              {standalone && !loggedIn ? (
                <a
                  href="/"
                  className="inline-flex min-h-10 items-center font-display text-[9px] tracking-[0.26em] text-white/65 transition-colors hover:text-white"
                >
                  VOLTAR
                </a>
              ) : !standalone ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center border border-white/25 text-white/75 transition-colors hover:border-[#c6a15b]/55 hover:text-white"
                  aria-label="Fechar"
                >
                  <span className="font-display text-xl leading-none" aria-hidden>
                    ×
                  </span>
                </button>
              ) : null}
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {!loggedIn ? (
              <div className="relative flex min-h-[min(72vh,640px)] items-center justify-center overflow-hidden px-6 py-16">
                <img
                  src={editorialAssets.hero}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.28]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,4,5,0.62)_0%,rgba(4,2,3,0.88)_100%)]" aria-hidden />
                <div className="absolute inset-0 bg-film-grain-section opacity-[0.08] mix-blend-overlay" aria-hidden />
                <div className="relative z-[1] w-full max-w-[26rem] border border-white/[0.12] bg-[linear-gradient(180deg,rgba(12,6,8,0.9)_0%,rgba(5,3,4,0.96)_100%)] px-7 py-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:px-10 sm:py-12">
                  <div>
                    <p className="font-rock text-[clamp(1.4rem,3vw,1.95rem)] uppercase tracking-[0.14em] text-[#ebe3d4]">
                      Caio Durazzo
                    </p>
                    <p className="mt-4 font-display text-[10px] tracking-[0.42em] text-[#c6a15b]">
                      STAFF
                    </p>
                    <div className="mx-auto mt-5 h-px w-14 bg-gradient-to-r from-transparent via-[#c6a15b]/55 to-transparent" />
                    <p className="mx-auto mt-6 max-w-[18rem] font-serif text-sm italic leading-relaxed text-white/68">
                      Acesso restrito.
                    </p>
                  </div>
                  <div className="mt-10 text-left space-y-3">
                    <label htmlFor={`${uid}-pw`} className={label}>
                      SENHA
                    </label>
                    <input
                      id={`${uid}-pw`}
                      type="password"
                      autoComplete="current-password"
                      value={pw}
                      onChange={(e) => {
                        setPw(e.target.value);
                        setLoginError(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") doLogin();
                      }}
                      className={field}
                    />
                    {loginError ? (
                      <p className="pt-1 font-display text-[10px] tracking-wide text-cd-warn">
                        Senha incorreta.
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={doLogin}
                    className="mt-8 w-full border border-white/35 py-4 font-display text-[10px] tracking-[0.28em] text-white transition-[border-color,background-color,color] hover:border-[#c6a15b] hover:bg-[#c6a15b] hover:text-black"
                  >
                    ENTRAR
                  </button>
                </div>
              </div>
            ) : adminTab === "youtube" ? (
              <AdminYoutubePanel />
            ) : adminTab === "hero" ? (
              <AdminHeroPanel showToast={showToast} />
            ) : adminTab === "discos" ? (
              <AdminDiscographyPanel showToast={showToast} />
            ) : (
              <div className="mx-auto grid max-w-[100rem] gap-16 px-5 py-12 sm:px-9 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-16">
                {/* Bloco — novo show */}
                <div>
                  <div className={`mb-10 border-b ${adminDivider} pb-8`}>
                    <p className="font-display text-[9px] tracking-[0.35em] text-white/55">
                      01
                    </p>
                    <h3 className={sectionTitle}>Adicionar show</h3>
                    <p className="mt-4 max-w-md font-serif text-sm italic leading-relaxed text-white/78">
                      Campos mínimos para publicar: data, local e cidade. O restante
                      aparece na ficha pública quando preenchido.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-7">
                    <div className="sm:col-span-1">
                      <label className={label}>DATA — obrigatório</label>
                      <input
                        type="date"
                        value={fDate}
                        onChange={(e) => setFDate(e.target.value)}
                        className={field}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className={label}>HORÁRIO</label>
                      <input
                        type="time"
                        value={fTime}
                        onChange={(e) => setFTime(e.target.value)}
                        className={field}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={label}>LOCAL — obrigatório</label>
                      <input
                        type="text"
                        value={fVenue}
                        onChange={(e) => setFVenue(e.target.value)}
                        placeholder="Casa, festival, estúdio…"
                        className={field}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className={label}>CIDADE — obrigatório</label>
                      <input
                        type="text"
                        value={fCity}
                        onChange={(e) => setFCity(e.target.value)}
                        className={field}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className={label}>ESTADO</label>
                      <input
                        type="text"
                        value={fState}
                        onChange={(e) => setFState(e.target.value)}
                        placeholder="UF"
                        maxLength={2}
                        className={`${field} uppercase`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={label}>ENDEREÇO</label>
                      <input
                        type="text"
                        value={fAddress}
                        onChange={(e) => setFAddress(e.target.value)}
                        className={field}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className={label}>PREÇO</label>
                      <input
                        type="text"
                        value={fPrice}
                        onChange={(e) => setFPrice(e.target.value)}
                        placeholder="Ex.: R$ 40"
                        className={field}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className={label}>LINK (INGRESSO)</label>
                      <input
                        type="url"
                        value={fLink}
                        onChange={(e) => setFLink(e.target.value)}
                        placeholder="https://…"
                        className={field}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={label}>OBSERVAÇÕES</label>
                      <textarea
                        value={fNotes}
                        onChange={(e) => setFNotes(e.target.value)}
                        rows={4}
                        className={fieldTextarea}
                      />
                    </div>
                  </div>

                  <div className={`mt-12 flex flex-wrap items-center gap-5 border-t ${adminDivider} pt-10`}>
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="border border-[#c6a15b] bg-[#c6a15b] px-10 py-4 font-display text-[10px] tracking-[0.22em] text-black transition-colors hover:bg-[#d4b56e]"
                    >
                      ADICIONAR SHOW
                    </button>
                    <button
                      type="button"
                      onClick={clearForm}
                      className="border border-white/30 px-6 py-4 font-display text-[9px] tracking-[0.24em] text-white/75 transition-colors hover:border-white/45 hover:text-white"
                    >
                      LIMPAR
                    </button>
                    {formError ? (
                      <span className="font-display text-[10px] text-cd-warn">
                        Data, local e cidade são obrigatórios.
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Bloco — cadastrados */}
                <div className="lg:border-l lg:border-white/[0.15] lg:pl-16">
                  <div className={`mb-10 border-b ${adminDivider} pb-8`}>
                    <p className="font-display text-[9px] tracking-[0.35em] text-white/55">
                      02
                    </p>
                    <h3 className={sectionTitle}>Shows cadastrados</h3>
                  </div>

                  {sorted.length === 0 ? (
                    <div className="border border-dashed border-white/22 px-8 py-20 text-center">
                      <p className="font-serif text-base italic text-white/75">
                        Nenhum show cadastrado
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-5 hidden font-display text-[9px] tracking-[0.28em] text-white/70 lg:grid lg:grid-cols-[6.5rem_1fr_minmax(0,9rem)_6rem] lg:gap-4 lg:px-3">
                        <span>DATA</span>
                        <span>LOCAL</span>
                        <span>CIDADE</span>
                        <span className="text-right">AÇÕES</span>
                      </div>
                      <ul className={`divide-y divide-white/[0.15] border-t ${adminDivider}`}>
                        {sorted.map((s) => {
                          const d = parseShowDate(s.date);
                          const day = String(d.getDate()).padStart(2, "0");
                          const mon = d
                            .toLocaleDateString("pt-BR", { month: "short" })
                            .replace(".", "")
                            .toUpperCase();
                          const yr = d.getFullYear();
                          const cityLine = [s.city, s.state].filter(Boolean).join(" / ");
                          const isFlash = flashId === s.id;
                          const isPending = pendingDeleteId === s.id;

                          return (
                            <li
                              key={s.id}
                              className={[
                                "py-10 transition-colors lg:px-3",
                                isFlash ? "animate-cd-row-flash" : "",
                                isPending ? "bg-cd-warn/12" : "",
                              ].join(" ")}
                            >
                              <div className="lg:grid lg:grid-cols-[6.5rem_1fr_minmax(0,9rem)_6rem] lg:items-start lg:gap-4">
                                <div className="flex lg:block lg:pt-0.5">
                                  <div>
                                    <p className="font-display text-[9px] tracking-[0.3em] text-white/70 lg:hidden">
                                      DATA
                                    </p>
                                    <p className="mt-1 font-heading text-3xl font-black leading-none text-[#c6a15b] lg:mt-0">
                                      {day}
                                    </p>
                                    <p className="mt-1 font-display text-[9px] tracking-[0.14em] text-white/72">
                                      {mon} · {yr}
                                      {s.time ? ` · ${s.time}` : ""}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-5 min-w-0 lg:mt-0">
                                  <p className="font-display text-[9px] tracking-[0.3em] text-white/70 lg:hidden">
                                    LOCAL
                                  </p>
                                  <p className="mt-1 font-title text-lg font-semibold leading-snug text-white">
                                    {s.venue}
                                  </p>
                                  {(s.address || s.price || s.notes) && (
                                    <p className="mt-2 font-serif text-xs leading-relaxed text-white/72">
                                      {[s.address, s.price, s.notes].filter(Boolean).join(" · ")}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-4 lg:mt-0">
                                  <p className="font-display text-[9px] tracking-[0.3em] text-white/70 lg:hidden">
                                    CIDADE
                                  </p>
                                  <p className="mt-1 font-display text-xs font-medium tracking-[0.12em] text-[#c6a15b]">
                                    {cityLine || "—"}
                                  </p>
                                  {s.link ? (
                                    <p className="mt-2 truncate font-display text-[9px] text-white/70">
                                      <span className="text-[#c6a15b]/90">Link · </span>
                                      {s.link}
                                    </p>
                                  ) : null}
                                </div>

                                <div className="mt-5 flex flex-col items-stretch gap-2 lg:mt-0 lg:items-end">
                                  <p className="font-display text-[9px] tracking-[0.3em] text-white/70 lg:hidden">
                                    AÇÕES
                                  </p>
                                  {isPending ? (
                                    <div className="flex flex-wrap justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setPendingDeleteId(null)}
                                        className="border border-white/30 px-3 py-2 font-display text-[8px] tracking-[0.2em] text-white/80 hover:border-white/45 hover:text-white"
                                      >
                                        CANCELAR
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => confirmDelete(s.id)}
                                        className="border border-cd-warn/55 px-3 py-2 font-display text-[8px] tracking-[0.2em] text-cd-warn hover:bg-cd-warn/20"
                                      >
                                        CONFIRMAR
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setPendingDeleteId(s.id)}
                                      className="self-end px-2 py-2 font-display text-[9px] tracking-[0.22em] text-white/78 underline decoration-white/35 underline-offset-4 transition-[color,text-decoration-color,opacity] hover:text-[#c6a15b] hover:decoration-[#c6a15b]/70 hover:opacity-100"
                                    >
                                      EXCLUIR
                                    </button>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast ? (
        <div
          className={`${standalone ? "sticky bottom-8 mx-auto mt-6" : "pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2"} z-[600] max-w-[90vw] border border-[#c6a15b]/45 bg-black/90 px-8 py-3.5 font-display text-[9px] tracking-[0.22em] text-white shadow-2xl`}
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </>
  );

  return standalone ? modalContent : createPortal(modalContent, document.body);
}
