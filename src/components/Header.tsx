import { useEffect, useId, useState } from "react";
import type { SocialLink } from "../data/mock";
import { editorialAssets } from "../data/editorialAssets";

function SocialIcon({ platform }: { platform: SocialLink["platform"] }) {
  const common = "h-3.5 w-3.5";
  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path
          d="M7.5 2.75h9A4.75 4.75 0 0 1 21.25 7.5v9A4.75 4.75 0 0 1 16.5 21.25h-9A4.75 4.75 0 0 1 2.75 16.5v-9A4.75 4.75 0 0 1 7.5 2.75Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12 16.1a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  if (platform === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M10 8.5 15.5 12 10 15.5V8.5Z" fill="currentColor" />
        <path
          d="M21.25 12c0-2.1-.2-3.1-.5-3.8a3 3 0 0 0-1.6-1.6C18.4 6.25 17.4 6 12 6s-6.4.25-6.9.6a3 3 0 0 0-1.6 1.6C3.2 9 3 10 3 12s.2 3.1.5 3.8a3 3 0 0 0 1.6 1.6c.5.35 1.5.6 6.9.6s6.4-.25 6.9-.6a3 3 0 0 0 1.6-1.6c.3-.7.5-1.7.5-3.8Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
      <path
        d="M7 5.5c4.8-2.1 9.2-2.1 13 0M8.5 10c3.4-1.5 6.6-1.5 9.1 0M10 14.2c2-1 3.9-1 5.6 0M12 18.2h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NavLink({
  href,
  children,
  onNavigate,
  forceLight = false,
}: {
  href: string;
  children: string;
  onNavigate?: () => void;
  forceLight?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className={[
        "font-display text-[10px] font-medium uppercase tracking-[0.22em] transition-[color] duration-200",
        forceLight ? "text-white/92 hover:text-white" : "text-cd-wash/[0.78] hover:text-cd-mist",
      ].join(" ")}
    >
      <span
        className={[
          "relative inline-block pb-0.5 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100",
          forceLight ? "after:bg-white/55" : "after:bg-cd-gold/55",
        ].join(" ")}
      >
        {children}
      </span>
    </a>
  );
}

function MenuGlyph({ open, light }: { open: boolean; light: boolean }) {
  const stroke = light ? "currentColor" : "currentColor";
  return (
    <span className="relative inline-flex h-4 w-5 items-center justify-center" aria-hidden>
      <span
        className={[
          "absolute h-px w-5 transition-transform duration-200",
          open ? "translate-y-0 rotate-45" : "-translate-y-[5px] rotate-0",
        ].join(" ")}
        style={{ backgroundColor: stroke }}
      />
      <span
        className={[
          "absolute h-px w-5 transition-opacity duration-200",
          open ? "opacity-0" : "opacity-100",
        ].join(" ")}
        style={{ backgroundColor: stroke }}
      />
      <span
        className={[
          "absolute h-px w-5 transition-transform duration-200",
          open ? "translate-y-0 -rotate-45" : "translate-y-[5px] rotate-0",
        ].join(" ")}
        style={{ backgroundColor: stroke }}
      />
    </span>
  );
}

function SocialButton({
  s,
  onNavigate,
  forceLight = false,
}: {
  s: SocialLink;
  onNavigate?: () => void;
  forceLight?: boolean;
}) {
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={s.label}
      onClick={onNavigate}
      className={[
        "flex h-8 w-8 items-center justify-center transition-[color,border-color,background-color] duration-200",
        forceLight
          ? "border border-white/14 text-white/88 hover:border-white/28 hover:bg-white/[0.05] hover:text-white"
          : "border border-cd-mist/[0.12] text-cd-muted hover:border-cd-golddim/45 hover:bg-cd-mist/[0.04] hover:text-cd-mist",
      ].join(" ")}
    >
      <SocialIcon platform={s.platform} />
    </a>
  );
}

export default function Header({
  navItems,
  socials,
  onOpenAdmin,
  staffHref,
  studentHref,
  brandHref = "#top",
}: {
  navItems: Array<{ label: string; href: string }>;
  socials: SocialLink[];
  onOpenAdmin?: () => void;
  staffHref?: string;
  studentHref?: string;
  brandHref?: string;
}) {
  const menuId = useId();
  const [scrolled, setScrolled] = useState(false);
  /** Só no topo absoluto o fundo fica transparente; qualquer scroll → barra preta. */
  const [atPageTop, setAtPageTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const barSolid = !atPageTop || menuOpen;
  const highlightedLabels = new Set(["Contratar", "Aulas"]);
  const desktopNavItems = navItems.filter((item) => !highlightedLabels.has(item.label));
  const highlightedNavItems = navItems.filter((item) => highlightedLabels.has(item.label));
  const mobileOverlayItems = navItems;

  useEffect(() => {
    const TOP_EPS = 2;
    const update = () => {
      setAtPageTop(window.scrollY <= TOP_EPS);
      setScrolled(window.scrollY > 32);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const useLightHeaderText = !barSolid;

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-[100] transition-[background-color] duration-[480ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none",
        barSolid ? "bg-[#030201]" : "bg-transparent",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-[100rem] items-center justify-between transition-[padding] duration-300 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-8",
          scrolled ? "px-4 py-2.5 sm:px-6 lg:px-10" : "px-4 py-3 sm:px-6 lg:px-10",
        ].join(" ")}
      >
          {/* Esquerda — wordmark */}
          <div className="flex min-w-0 items-center gap-3 lg:justify-self-start">
            <a href={brandHref} onClick={closeMenu} className="group flex min-w-0 items-center gap-3 outline-offset-4">
              <span
                className={[
                  "shrink-0 w-px bg-gradient-to-b from-transparent via-cd-gold/40 to-transparent",
                  scrolled ? "h-6 sm:h-7" : "h-7 sm:h-8",
                ].join(" ")}
                aria-hidden
              />
              <span
                className={[
                  "font-rock uppercase not-italic leading-none tracking-[0.14em] text-[#ebe3d4] transition-[font-size,color] duration-300 group-hover:text-cd-mist",
                  scrolled
                    ? "text-[clamp(0.88rem,2.1vw,1.05rem)]"
                    : "text-[clamp(0.95rem,2.4vw,1.2rem)]",
                ].join(" ")}
              >
                Caio Durazzo
              </span>
            </a>
          </div>

          {/* Centro — navegação (desktop) */}
          <nav
            aria-label="Principal"
            className="hidden min-w-0 justify-center lg:flex lg:justify-self-center"
          >
            <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 xl:gap-x-8">
              {desktopNavItems.map((item) => (
                <li key={item.href + item.label}>
                  <NavLink href={item.href} forceLight={useLightHeaderText}>
                    {item.label.toUpperCase()}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Direita — redes + ações (desktop) */}
          <div className="hidden items-center justify-end gap-0 lg:flex lg:justify-self-end">
            <ul className="mr-4 flex items-center gap-2.5" aria-label="Ações em destaque">
              {highlightedNavItems.map((item) => {
                const isPrimary = item.label === "Contratar";

                return (
                  <li key={item.href + item.label}>
                    <a
                      href={item.href}
                      onClick={closeMenu}
                      className={
                        isPrimary
                          ? [
                              "inline-flex min-h-9 items-center px-4 font-display text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors duration-200",
                              useLightHeaderText
                                ? "text-white/92 hover:text-white"
                                : "text-cd-neon hover:text-[#fff7bf]",
                            ].join(" ")
                          : [
                              "inline-flex min-h-9 items-center px-4 font-display text-[10px] font-medium uppercase tracking-[0.24em] transition-colors duration-200",
                              useLightHeaderText
                                ? "text-white/92 hover:text-white"
                                : "text-cd-teal/90 hover:text-cd-mist",
                            ].join(" ")
                      }
                    >
                      {item.label.toUpperCase()}
                    </a>
                  </li>
                );
              })}
            </ul>
            <ul className="flex items-center gap-1" aria-label="Redes sociais">
              {socials.map((s) => (
                <li key={s.platform}>
                  <SocialButton s={s} forceLight={useLightHeaderText} />
                </li>
              ))}
            </ul>
            {onOpenAdmin || staffHref ? (
              <>
                <span className="mx-4 h-4 w-px shrink-0 bg-cd-mist/[0.1]" aria-hidden />
                {staffHref ? (
                  <a
                    href={staffHref}
                    onClick={closeMenu}
                    className={[
                      "font-display text-[10px] font-medium uppercase tracking-[0.26em] transition-colors duration-200",
                      useLightHeaderText ? "text-white/80 hover:text-white" : "text-cd-faint hover:text-cd-wash",
                    ].join(" ")}
                    aria-label="Abrir painel backstage"
                  >
                    BACKSTAGE
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAdmin?.();
                      closeMenu();
                    }}
                    className={[
                      "font-display text-[10px] font-medium uppercase tracking-[0.26em] transition-colors duration-200",
                      useLightHeaderText ? "text-white/80 hover:text-white" : "text-cd-faint hover:text-cd-wash",
                    ].join(" ")}
                    aria-label="Abrir painel da agenda"
                  >
                    BACKSTAGE
                  </button>
                )}
                {studentHref ? (
                  <>
                    <span className="mx-3 font-display text-[10px] font-medium uppercase tracking-[0.22em] text-cd-faint/65">
                      |
                    </span>
                    <a
                      href={studentHref}
                      onClick={closeMenu}
                      className={[
                        "font-display text-[10px] font-medium uppercase tracking-[0.26em] transition-colors duration-200",
                        useLightHeaderText ? "text-white/80 hover:text-white" : "text-cd-faint hover:text-cd-wash",
                      ].join(" ")}
                      aria-label="Abrir área do aluno"
                    >
                      ALUNO
                    </a>
                  </>
                ) : null}
              </>
            ) : null}
          </div>

          {/* Mobile — alternar menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              className={[
                "ml-1 flex h-10 items-center gap-3 border px-3.5 font-display text-[9px] font-medium uppercase tracking-[0.28em] transition-[border-color,background-color,color] duration-200",
                useLightHeaderText
                  ? "border-white/18 text-white/90 hover:border-white/30 hover:bg-white/[0.04]"
                  : "border-cd-mist/[0.12] text-cd-wash/90 hover:border-cd-mist/25 hover:bg-cd-mist/[0.04]",
              ].join(" ")}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span>{menuOpen ? "Fechar" : "Menu"}</span>
              <MenuGlyph open={menuOpen} light={useLightHeaderText} />
            </button>
          </div>
      </div>

      {/* Mobile — painel abaixo do header */}
      <div
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
        aria-label="Navegação do site"
        className={[
          "absolute left-0 right-0 top-full z-[105] lg:hidden",
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
          "overflow-y-auto bg-[linear-gradient(180deg,rgba(3,2,1,0.985)_0%,rgba(10,4,6,0.985)_100%)] transition-opacity duration-300 ease-out",
        ].join(" ")}
      >
        <nav
          aria-label="Principal — mobile"
          className="flex min-h-[calc(100svh-100%)] flex-col px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-0 sm:px-8"
        >
          <div className="border-t border-cd-mist/[0.06]" />
          <ul className="divide-y divide-cd-mist/[0.06]">
            {mobileOverlayItems.map((item) => (
              <li key={item.href + item.label}>
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className={[
                    "flex min-h-[3.75rem] items-center justify-between py-3 font-rock text-[clamp(1rem,5vw,1.55rem)] uppercase tracking-[0.1em] transition-colors sm:min-h-[4.25rem] sm:py-3.5 sm:text-[clamp(1.2rem,5vw,1.9rem)]",
                    item.label === "Contratar"
                      ? "text-cd-neon hover:text-[#fff7bf]"
                      : item.label === "Aulas"
                        ? "text-cd-teal/90 hover:text-cd-mist"
                        : "text-[#f2ead8] hover:text-white",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 overflow-hidden border border-cd-mist/[0.08] bg-black/30">
            <img
              src={editorialAssets.lessons}
              alt="Caio Durazzo"
              className="h-48 w-full object-cover object-center"
            />
          </div>
          <div className="pt-6">
            <div className="border-t border-cd-mist/[0.08] pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <ul className="flex items-center gap-2" aria-label="Redes sociais">
                  {socials.map((s) => (
                    <li key={s.platform}>
                      <SocialButton s={s} onNavigate={closeMenu} forceLight />
                    </li>
                  ))}
                </ul>
                {staffHref ? (
                  <a
                    href={staffHref}
                    onClick={closeMenu}
                    className="font-display text-[10px] font-medium uppercase tracking-[0.26em] text-cd-faint hover:text-cd-wash"
                    aria-label="Abrir painel backstage"
                  >
                    Backstage
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenAdmin?.();
                      closeMenu();
                    }}
                    className="font-display text-[10px] font-medium uppercase tracking-[0.26em] text-cd-faint hover:text-cd-wash"
                    aria-label="Abrir painel da agenda"
                  >
                    Staff
                  </button>
                )}
                {studentHref ? (
                  <>
                    <span className="font-display text-[10px] font-medium uppercase tracking-[0.22em] text-cd-faint/65">
                      |
                    </span>
                    <a
                      href={studentHref}
                      onClick={closeMenu}
                      className="font-display text-[10px] font-medium uppercase tracking-[0.26em] text-cd-faint hover:text-cd-wash"
                      aria-label="Abrir área do aluno"
                    >
                      Aluno
                    </a>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </nav>
      </div>

    </header>
  );
}
