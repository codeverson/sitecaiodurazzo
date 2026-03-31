import { useEffect, useMemo, useState, type FormEvent } from "react";
import NativeFretboardTool from "./tools/NativeFretboardTool";
import NativeTabMakerTool from "./tools/NativeTabMakerTool";

const STUDENT_PASSWORD = "1234";
const STORAGE_KEY = "caio-durazzo-student-area-unlocked";

const tools = [
  {
    id: "fretboard",
    label: "Fretboard",
    description: "Visualize notas, escalas, acordes e graus harmonicos relativos a raiz no braco.",
  },
  {
    id: "tabmaker",
    label: "Tab Maker",
    description: "Monte tablaturas, registre slides e bends e exporte estudos na identidade nova.",
  },
] as const;

type ToolId = (typeof tools)[number]["id"];

export default function StudentAreaPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolId>("fretboard");

  const currentTool = useMemo(() => tools.find((tool) => tool.id === activeTool) ?? tools[0], [activeTool]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Área do Aluno — Caio Durazzo";

    let meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute("content") ?? null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      "Área do aluno com acesso ao Fretboard e ao Tab Maker de Caio Durazzo.",
    );

    if (typeof window !== "undefined" && window.sessionStorage.getItem(STORAGE_KEY) === "true") {
      setUnlocked(true);
    }

    return () => {
      document.title = prevTitle;
      if (prevDescription != null) {
        meta?.setAttribute("content", prevDescription);
      }
    };
  }, []);

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== STUDENT_PASSWORD) {
      setError("Senha incorreta.");
      return;
    }
    window.sessionStorage.setItem(STORAGE_KEY, "true");
    setUnlocked(true);
    setPassword("");
    setError("");
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setUnlocked(false);
    setPassword("");
    setError("");
  };

  return (
    <main className="relative min-h-[100svh] bg-transparent pt-28 text-cd-mist sm:pt-32 lg:pt-36">
      <section className="mx-auto max-w-[90rem] px-6 pb-16 sm:px-10 sm:pb-20 lg:px-14 xl:px-16">
        {!unlocked ? (
          <div className="mx-auto max-w-[34rem] border border-cd-mist/[0.12] bg-[linear-gradient(160deg,rgba(30,12,16,0.9)_0%,rgba(11,5,7,0.98)_100%)] px-6 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.32)] sm:px-8 sm:py-10">
            <p className="font-display text-[9px] font-semibold tracking-[0.4em] text-cd-teal">ALUNO</p>
            <h1 className="mt-5 font-rock text-[clamp(1.8rem,4.5vw,3rem)] uppercase leading-[0.96] tracking-[0.08em] text-[#f2ead8]">
              Área do aluno
            </h1>
            <p className="mt-5 max-w-[28rem] font-body text-[1rem] leading-[1.78] text-cd-wash/[0.88]">
              Acesso às ferramentas de estudo com Fretboard e Tab Maker.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleUnlock}>
              <label className="block">
                <span className="mb-2 block font-display text-[9px] font-semibold tracking-[0.28em] text-cd-faint">
                  Senha
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError("");
                  }}
                  autoComplete="current-password"
                  className="w-full border border-cd-mist/[0.14] bg-black/35 px-4 py-3 font-body text-base text-cd-mist outline-none transition-colors focus:border-cd-neon/45"
                />
              </label>
              {error ? <p className="font-body text-sm text-[#e7a29b]">{error}</p> : null}
              <button type="submit" className="cd-btn-primary">
                Entrar
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-6 border border-cd-mist/[0.1] bg-[linear-gradient(160deg,rgba(25,10,13,0.72)_0%,rgba(10,4,6,0.88)_100%)] px-6 py-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="font-display text-[9px] font-semibold tracking-[0.4em] text-cd-teal">ALUNO</p>
                <h1 className="mt-4 font-rock text-[clamp(1.8rem,4.5vw,3rem)] uppercase leading-[0.96] tracking-[0.08em] text-[#f2ead8]">
                  Ferramentas de estudo
                </h1>
                <p className="mt-4 font-body text-[1rem] leading-[1.78] text-cd-wash/[0.86]">
                  Acesse as duas ferramentas disponíveis e alterne entre elas conforme o estudo.
                </p>
              </div>
              <button type="button" onClick={handleLogout} className="cd-btn-ghost">
                Sair
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {tools.map((tool) => {
                const active = tool.id === activeTool;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setActiveTool(tool.id)}
                    className={[
                      "border px-4 py-3 text-left transition-colors",
                      active
                        ? "border-cd-neon/40 bg-cd-mist/[0.06] text-cd-mist"
                        : "border-cd-mist/[0.08] bg-black/20 text-cd-wash/75 hover:border-cd-mist/[0.16] hover:text-cd-mist",
                    ].join(" ")}
                  >
                    <span className="block font-display text-[9px] font-semibold uppercase tracking-[0.24em]">
                      {tool.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 border border-cd-mist/[0.08] bg-black/18 px-5 py-4">
              <p className="font-body text-sm leading-[1.7] text-cd-wash/[0.82]">{currentTool.description}</p>
            </div>

            <div className="mt-6 overflow-hidden border border-cd-mist/[0.12] bg-black/35">
              <div className="p-4 sm:p-5 lg:p-6">
                {currentTool.id === "fretboard" ? <NativeFretboardTool /> : <NativeTabMakerTool />}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
