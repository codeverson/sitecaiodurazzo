import { useEffect, useMemo, useRef, useState } from "react";
import {
  FRET_DOTS,
  NOTES,
  TUNINGS,
  getNoteAtFret,
  getOctaveAtFret,
  type TuningKey,
} from "../../lib/musicTheory";

const FRET_OPTIONS = [12, 15, 17, 21, 24];
const STRING_HEIGHT = 38;
const FRET_WIDTH = 54;
const OPEN_WIDTH = 46;
const LABEL_WIDTH = 54;
const NUT_WIDTH = 12;
const EXPORT_SCALE = 2;
const BASE_OCTAVES = [4, 3, 3, 3, 2, 2] as const;

type TabEntry =
  | { type: "note"; stringIdx: number; fret: number }
  | { type: "slide"; stringIdx: number; from: number; to: number; direction: "up" | "down" }
  | { type: "bend"; stringIdx: number; fret: number; amount: 0.5 | 1 };

type GestureState = {
  active: boolean;
  stringIdx: number;
  fret: number;
  startX: number;
  startY: number;
  targetFret: number;
  gestureType: "slide" | "bend" | null;
  bendAmount: 0.5 | 1;
};

function entryToken(entry: TabEntry) {
  if (entry.type === "note") return String(entry.fret);
  if (entry.type === "slide") return `${entry.from}${entry.direction === "up" ? "/" : "\\"}${entry.to}`;
  return `${entry.fret}b${entry.fret + (entry.amount === 1 ? 2 : 1)}`;
}

export default function NativeTabMakerTool() {
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [tuningKey, setTuningKey] = useState<TuningKey>("standard");
  const [fretCount, setFretCount] = useState(17);
  const [capo, setCapo] = useState(0);
  const [tabData, setTabData] = useState<TabEntry[]>([]);
  const [redoStack, setRedoStack] = useState<TabEntry[]>([]);
  const [gesture, setGesture] = useState<GestureState | null>(null);
  const boardAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 640) {
      setFretCount(12);
    }
  }, []);

  const tuning = TUNINGS[tuningKey];

  const lastLabel = useMemo(() => {
    const last = tabData.at(-1);
    if (!last) return "—";
    if (last.type === "slide") {
      return `${tuning.names[last.stringIdx]}: ${last.from}${last.direction === "up" ? "/" : "\\"}${last.to}`;
    }
    if (last.type === "bend") {
      return `${tuning.names[last.stringIdx]}: ${last.fret}b (${last.amount === 1 ? "1 tom" : "1/2 tom"})`;
    }
    const midi = (BASE_OCTAVES[last.stringIdx] + 1) * 12 + tuning.notes[last.stringIdx] + last.fret + capo;
    const note = NOTES[midi % 12];
    const oct = Math.floor(midi / 12) - 1;
    return `${note}${oct} · ${tuning.names[last.stringIdx]} · ${last.fret === 0 ? "solta" : `traste ${last.fret}`}`;
  }, [tabData, tuning, capo]);

  const staff = useMemo(() => {
    if (!tabData.length) {
      return tuning.names.map((name) => `${name}|--|`).join("\n");
    }
    const widths = tabData.map((entry) => entryToken(entry).length);
    return tuning.names
      .map((name, stringIdx) => {
        let line = `${name}|-`;
        tabData.forEach((entry, index) => {
          const token = entryToken(entry);
          const width = widths[index];
          line += entry.stringIdx === stringIdx ? `${token.padEnd(width, "-")}-` : `${"-".repeat(width)}-`;
        });
        return `${line}|`;
      })
      .join("\n");
  }, [tabData, tuning.names]);

  const blocked = (fret: number) => capo > 0 && fret < capo;

  const noteInfo = (stringIdx: number, fret: number) => {
    const midi = (BASE_OCTAVES[stringIdx] + 1) * 12 + tuning.notes[stringIdx] + fret + capo;
    const note = NOTES[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return { note, full: `${note}${octave}` };
  };

  const commitEntry = (entry: TabEntry) => {
    setTabData((prev) => [...prev, entry]);
    setRedoStack([]);
  };

  const handlePointerDown = (stringIdx: number, fret: number, clientX: number, clientY: number) => {
    if (blocked(fret)) return;
    setGesture({
      active: true,
      stringIdx,
      fret,
      startX: clientX,
      startY: clientY,
      targetFret: fret,
      gestureType: null,
      bendAmount: 0.5,
    });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    setGesture((prev) => {
      if (!prev?.active) return prev;
      const dx = clientX - prev.startX;
      const dy = clientY - prev.startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX > 20 && absX > absY * 1.5) {
        const boardWidth = boardAreaRef.current?.clientWidth ?? fretCount * FRET_WIDTH;
        const delta = Math.round(dx / (boardWidth / fretCount));
        return {
          ...prev,
          targetFret: Math.max(0, Math.min(fretCount, prev.fret + delta)),
          gestureType: "slide",
        };
      }

      if (dy < -20 && absY > absX * 1.5) {
        return { ...prev, gestureType: "bend", bendAmount: absY > 60 ? 1 : 0.5 };
      }

      return { ...prev, gestureType: null, targetFret: prev.fret };
    });
  };

  const handlePointerUp = () => {
    if (!gesture?.active) return;
    if (gesture.gestureType === "slide" && gesture.targetFret !== gesture.fret) {
      commitEntry({
        type: "slide",
        stringIdx: gesture.stringIdx,
        from: gesture.fret,
        to: gesture.targetFret,
        direction: gesture.targetFret > gesture.fret ? "up" : "down",
      });
    } else if (gesture.gestureType === "bend") {
      commitEntry({
        type: "bend",
        stringIdx: gesture.stringIdx,
        fret: gesture.fret,
        amount: gesture.bendAmount,
      });
    } else {
      commitEntry({ type: "note", stringIdx: gesture.stringIdx, fret: gesture.fret });
    }
    setGesture(null);
  };

  const exportPng = () => {
    if (!tabData.length) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const linesPerBlock = 28;
    const totalLines = Math.ceil(tabData.length / linesPerBlock);
    const mono = 8.6;
    const pad = 40;
    let maxChars = 0;

    const buildLine = (stringIdx: number, start: number, end: number) => {
      let line = `${tuning.names[stringIdx]}|-`;
      for (let i = start; i < end; i += 1) {
        const token = entryToken(tabData[i]);
        const width = token.length;
        line += tabData[i].stringIdx === stringIdx ? `${token.padEnd(width, "-")}-` : `${"-".repeat(width)}-`;
      }
      return `${line}|`;
    };

    for (let block = 0; block < totalLines; block += 1) {
      const start = block * linesPerBlock;
      const end = Math.min(start + linesPerBlock, tabData.length);
      for (let stringIdx = 0; stringIdx < 6; stringIdx += 1) {
        maxChars = Math.max(maxChars, buildLine(stringIdx, start, end).length);
      }
    }

    const width = Math.max(pad * 2 + maxChars * mono, 640);
    const blockHeight = 6 * 24 + 18;
    const height = pad * 2 + 110 + totalLines * blockHeight + (totalLines - 1) * 16;

    canvas.width = width * EXPORT_SCALE;
    canvas.height = height * EXPORT_SCALE;
    ctx.scale(EXPORT_SCALE, EXPORT_SCALE);

    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, "#220c10");
    bg.addColorStop(0.4, "#18080b");
    bg.addColorStop(1, "#050203");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(237,228,212,0.16)";
    ctx.strokeRect(12, 12, width - 24, height - 24);

    let y = pad;
    ctx.textAlign = "center";
    ctx.fillStyle = "#61d0c4";
    ctx.font = "600 10px Inter, sans-serif";
    ctx.fillText("CAIO DURAZZO · TAB MAKER", width / 2, y);
    y += 24;

    ctx.fillStyle = "#efe4d2";
    ctx.font = "700 22px Georgia, serif";
    ctx.fillText(songTitle || "Tablatura", width / 2, y);
    y += 20;

    ctx.fillStyle = "rgba(237,228,212,0.62)";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText(
      `${artistName || "Caio Durazzo"} · ${tuning.label}${capo > 0 ? ` · Capo ${capo}` : ""}`,
      width / 2,
      y,
    );
    y += 24;

    ctx.strokeStyle = "rgba(97,208,196,0.25)";
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - pad, y);
    ctx.stroke();
    y += 22;

    ctx.textAlign = "left";
    ctx.font = '14px "Courier New", monospace';
    for (let block = 0; block < totalLines; block += 1) {
      const start = block * linesPerBlock;
      const end = Math.min(start + linesPerBlock, tabData.length);
      for (let stringIdx = 0; stringIdx < 6; stringIdx += 1) {
        const line = buildLine(stringIdx, start, end);
        ctx.fillStyle = "#61d0c4";
        ctx.fillText(tuning.names[stringIdx], pad, y + stringIdx * 22);
        ctx.fillStyle = "#efe4d2";
        ctx.fillText(line.slice(tuning.names[stringIdx].length), pad + mono * tuning.names[stringIdx].length, y + stringIdx * 22);
      }
      y += blockHeight;
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(237,228,212,0.24)";
    ctx.font = "10px Inter, sans-serif";
    ctx.fillText("Caio Durazzo · Ferramenta de estudo", width / 2, height - 16);

    const link = document.createElement("a");
    link.download = `${artistName || "caio-durazzo"}-${songTitle || "tab"}`.replace(/\s+/g, "-").toLowerCase() + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.ctrlKey || event.metaKey;
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

      if (mod && event.shiftKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        setRedoStack((prev) => {
          const next = [...prev];
          const restored = next.pop();
          if (restored) setTabData((entries) => [...entries, restored]);
          return next;
        });
        return;
      }

      if (mod && event.key.toLowerCase() === "z") {
        event.preventDefault();
        setTabData((prev) => {
          const next = [...prev];
          const removed = next.pop();
          if (removed) setRedoStack((redo) => [...redo, removed]);
          return next;
        });
        return;
      }

      if (!isTyping && (event.key === "Delete" || event.key === "Backspace")) {
        event.preventDefault();
        setTabData((prev) => {
          const next = [...prev];
          const removed = next.pop();
          if (removed) setRedoStack((redo) => [...redo, removed]);
          return next;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="tool-shell">
      <div className="tool-shell-header">
        <div>
          <p className="tool-eyebrow">Ferramenta de transcricao</p>
          <h2 className="cd-display-title mt-3 font-rock text-[clamp(1.8rem,4vw,3rem)] uppercase leading-[0.95] tracking-[0.08em] text-[#efe4d2]">
            Tab Maker
          </h2>
          <p className="tool-shell-copy">
            Monte tablaturas, registre slides e bends e exporte o material ja alinhado a identidade nova do projeto.
          </p>
        </div>
        <button type="button" className="cd-btn-primary" onClick={exportPng}>
          Exportar PNG
        </button>
      </div>

      <div className="tool-controls-grid">
        <label className="tool-control">
          <span className="tool-control-label">Musica</span>
          <input className="tool-input" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} />
        </label>
        <label className="tool-control">
          <span className="tool-control-label">Artista</span>
          <input className="tool-input" value={artistName} onChange={(e) => setArtistName(e.target.value)} />
        </label>
        <label className="tool-control">
          <span className="tool-control-label">Afinacao</span>
          <select className="tool-select" value={tuningKey} onChange={(e) => setTuningKey(e.target.value as TuningKey)}>
            {Object.entries(TUNINGS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label} - {value.names.join(" ")}
              </option>
            ))}
          </select>
        </label>
        <label className="tool-control">
          <span className="tool-control-label">Trastes</span>
          <select className="tool-select" value={fretCount} onChange={(e) => setFretCount(Number(e.target.value))}>
            {FRET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <div className="tool-control">
          <span className="tool-control-label">Capo</span>
          <div className="flex items-center gap-2">
            <button type="button" className="cd-btn-ghost !px-4 !py-3" onClick={() => setCapo((v) => Math.max(0, v - 1))}>
              -
            </button>
            <div className="tool-panel flex min-w-[3.5rem] items-center justify-center px-0 py-3 font-rock text-xl text-[#efe4d2]">
              {capo}
            </div>
            <button
              type="button"
              className="cd-btn-ghost !px-4 !py-3"
              onClick={() => setCapo((v) => Math.min(12, v + 1))}
            >
              +
            </button>
          </div>
        </div>
        <div className="tool-control">
          <span className="tool-control-label">Acoes</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="cd-btn-ghost !px-4 !py-3"
              onClick={() =>
                setTabData((prev) => {
                  const next = [...prev];
                  const removed = next.pop();
                  if (removed) setRedoStack((redo) => [...redo, removed]);
                  return next;
                })
              }
            >
              Desfazer
            </button>
            <button
              type="button"
              className="cd-btn-ghost !px-4 !py-3"
              onClick={() =>
                setRedoStack((prev) => {
                  const next = [...prev];
                  const restored = next.pop();
                  if (restored) setTabData((entries) => [...entries, restored]);
                  return next;
                })
              }
            >
              Refazer
            </button>
            <button
              type="button"
              className="cd-btn-ghost !border-cd-cherry/45 !text-[#f0b1a8]"
              onClick={() => {
                setTabData([]);
                setRedoStack([]);
              }}
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      <div className="tool-panel overflow-x-auto">
        <p className="tool-eyebrow">Tablatura</p>
        <pre className="mt-4 whitespace-pre font-mono text-[13px] leading-[1.72] text-cd-mist">{staff}</pre>
      </div>

      <div className="tool-panel overflow-x-auto">
        <div
          className="min-w-max"
          style={{
            width: LABEL_WIDTH + OPEN_WIDTH + NUT_WIDTH + fretCount * FRET_WIDTH + 40,
          }}
        >
          <div className="mb-3 flex">
            <div style={{ width: LABEL_WIDTH }} />
            <div className="flex items-center justify-center text-[11px] tracking-[0.14em] text-cd-faint" style={{ width: OPEN_WIDTH }}>
              0
            </div>
            <div style={{ width: NUT_WIDTH }} />
            {Array.from({ length: fretCount }).map((_, index) => {
              const fret = index + 1;
              return (
                <div
                  key={fret}
                  className={`flex items-center justify-center text-[11px] tracking-[0.14em] ${
                    FRET_DOTS[fret] ? "text-cd-teal" : "text-cd-faint"
                  }`}
                  style={{ width: FRET_WIDTH }}
                >
                  {fret}
                </div>
              );
            })}
          </div>

          <div className="tool-fretboard">
            <div className="tool-string-labels" style={{ width: LABEL_WIDTH }}>
              {Array.from({ length: 6 }).map((_, stringIdx) => (
                <div key={stringIdx} className="tool-string-label" style={{ height: STRING_HEIGHT }}>
                  {tuning.names[stringIdx]}
                </div>
              ))}
            </div>

            <div className="tool-open-column" style={{ width: OPEN_WIDTH }}>
              {Array.from({ length: 6 }).map((_, stringIdx) => (
                <div key={stringIdx} className="flex items-center justify-center" style={{ height: STRING_HEIGHT }}>
                  <button
                    type="button"
                    disabled={blocked(0)}
                    onPointerDown={(e) => handlePointerDown(stringIdx, 0, e.clientX, e.clientY)}
                    onPointerMove={(e) => handlePointerMove(e.clientX, e.clientY)}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={() => setGesture(null)}
                    className={`tool-note-btn ${blocked(0) ? "pointer-events-none opacity-[0.16]" : "border-cd-mist/[0.16] bg-black/42 text-cd-wash/90"}`}
                    title={`${noteInfo(stringIdx, 0).full} · ${tuning.names[stringIdx]} · solta`}
                  >
                    {noteInfo(stringIdx, 0).note}
                  </button>
                </div>
              ))}
            </div>

            <div className="tool-nut" style={{ width: NUT_WIDTH }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="tool-nut-slot" style={{ height: STRING_HEIGHT }} />
              ))}
            </div>

            <div ref={boardAreaRef} className="tool-frets-area" style={{ width: fretCount * FRET_WIDTH }}>
              {capo > 0 ? (
                <div
                  className="absolute top-0 z-[5] h-full w-[10px] -translate-x-1/2 rounded-[999px] bg-[linear-gradient(180deg,rgba(244,224,77,0.35)_0%,rgba(244,224,77,0.88)_50%,rgba(244,224,77,0.35)_100%)] shadow-[0_0_20px_rgba(244,224,77,0.25)]"
                  style={{ left: capo * FRET_WIDTH }}
                />
              ) : null}

              <div className="absolute inset-0">
                {Array.from({ length: 6 }).map((_, stringIdx) => (
                  <div
                    key={stringIdx}
                    className={`tool-string-line ${stringIdx >= 4 ? "tool-string-line-bass" : ""}`}
                    style={{ top: stringIdx * STRING_HEIGHT + STRING_HEIGHT / 2 }}
                  />
                ))}
              </div>

              <div className="absolute inset-0 flex">
                {Array.from({ length: fretCount }).map((_, index) => (
                  <div key={index} className="tool-fret-line" style={{ width: FRET_WIDTH }} />
                ))}
              </div>

              <div className="absolute inset-0">
                {Object.entries(FRET_DOTS).map(([fretRaw, count]) => {
                  const fret = Number(fretRaw);
                  if (fret > fretCount) return null;
                  const left = (fret - 0.5) * FRET_WIDTH;
                  if (count === 1) {
                    return (
                      <span
                        key={fret}
                        className="tool-position-dot"
                        style={{ left, top: STRING_HEIGHT * 2.5 }}
                        aria-hidden
                      />
                    );
                  }
                  return (
                    <div key={fret}>
                      <span className="tool-position-dot" style={{ left, top: STRING_HEIGHT * 1.5 }} aria-hidden />
                      <span className="tool-position-dot" style={{ left, top: STRING_HEIGHT * 3.5 }} aria-hidden />
                    </div>
                  );
                })}
              </div>

              <div className="relative z-[4] flex">
                {Array.from({ length: fretCount }).map((_, fretIndex) => {
                  const fret = fretIndex + 1;
                  return (
                    <div key={fret} className="flex flex-col" style={{ width: FRET_WIDTH }}>
                      {Array.from({ length: 6 }).map((__, stringIdx) => {
                        const info = noteInfo(stringIdx, fret);
                        const isBlocked = blocked(fret);
                        const isGestureStart =
                          gesture?.active && gesture.stringIdx === stringIdx && gesture.fret === fret && gesture.gestureType !== null;
                        return (
                          <div key={`${fret}-${stringIdx}`} className="flex items-center justify-center" style={{ height: STRING_HEIGHT }}>
                            <button
                              type="button"
                              disabled={isBlocked}
                              onPointerDown={(e) => handlePointerDown(stringIdx, fret, e.clientX, e.clientY)}
                              onPointerMove={(e) => handlePointerMove(e.clientX, e.clientY)}
                              onPointerUp={handlePointerUp}
                              onPointerCancel={() => setGesture(null)}
                              className={[
                                "tool-note-btn",
                                isGestureStart ? "tool-note-btn-active" : "border-cd-mist/[0.16] bg-black/42 text-cd-wash/90",
                                isBlocked ? "pointer-events-none opacity-[0.16]" : "",
                              ].join(" ")}
                              title={`${info.full} · ${tuning.names[stringIdx]} · traste ${fret}`}
                            >
                              {info.note}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-3 flex" style={{ marginLeft: LABEL_WIDTH + OPEN_WIDTH + NUT_WIDTH }}>
            {Array.from({ length: fretCount }).map((_, index) => {
              const fret = index + 1;
              const count = FRET_DOTS[fret] || 0;
              return (
                <div key={fret} className="flex items-center justify-center gap-1" style={{ width: FRET_WIDTH, height: 18 }}>
                  {Array.from({ length: count }).map((__, dotIndex) => (
                    <span key={dotIndex} className="tool-position-dot-small" />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="tool-info-grid !xl:grid-cols-3">
          <div className="tool-info-card">
            <span className="tool-info-label">Notas</span>
            <span className="tool-info-value">{tabData.length}</span>
          </div>
          <div className="tool-info-card">
            <span className="tool-info-label">Ultima entrada</span>
            <span className="mt-3 text-sm leading-[1.6] text-cd-wash/85">{lastLabel}</span>
          </div>
          <div className="tool-info-card">
            <span className="tool-info-label">Atalhos</span>
            <span className="mt-3 text-sm leading-[1.7] text-cd-wash/80">Desfazer, refazer, limpar, slide horizontal e bend vertical.</span>
          </div>
        </div>
        <div className="tool-panel">
          <p className="tool-eyebrow">Gestos</p>
          <div className="mt-4 space-y-3 text-sm leading-[1.7] text-cd-wash/80">
            <p>
              Clique para inserir nota simples. Arraste na horizontal para criar <strong className="text-cd-mist">slide</strong>.
            </p>
            <p>
              Arraste para cima para criar <strong className="text-cd-mist">bend</strong> de meio tom ou um tom.
            </p>
            <p>
              O capo bloqueia visualmente as casas anteriores e entra no calculo de leitura e export.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
