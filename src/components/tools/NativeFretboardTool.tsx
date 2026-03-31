import { useEffect, useMemo, useState } from "react";
import {
  CHORD_INTERVALS,
  FRET_DOTS,
  NOTES,
  SCALE_INTERVALS,
  TUNINGS,
  buildFretboardPoints,
  getDisplayLabel,
  getIntervalLabel,
  getStringLabel,
  toSelectedPoint,
  type FretboardPoint,
  type LabelMode,
  type TheoryMode,
  type TuningKey,
} from "../../lib/musicTheory";
import { playGuitarNote } from "../../lib/noteAudio";

const FRET_OPTIONS = [12, 15, 17, 21, 24];
const STRING_HEIGHT = 38;
const FRET_WIDTH = 54;
const OPEN_WIDTH = 46;
const LABEL_WIDTH = 54;
const NUT_WIDTH = 12;
const EXPORT_SCALE = 2;

function degreeAccent(interval: number) {
  if (interval === 0) return "border-cd-neon/70 bg-cd-neon/18 text-[#fff6dc]";
  if (interval === 3 || interval === 4 || interval === 10 || interval === 11) {
    return "border-cd-teal/35 bg-cd-teal/[0.08] text-cd-mist";
  }
  return "border-cd-mist/[0.16] bg-black/42 text-cd-wash/90";
}

export default function NativeFretboardTool() {
  const [tuningKey, setTuningKey] = useState<TuningKey>("standard");
  const [mode, setMode] = useState<TheoryMode>("notes");
  const [labelMode, setLabelMode] = useState<LabelMode>("notes");
  const [root, setRoot] = useState(0);
  const [currentType, setCurrentType] = useState<string>("");
  const [fretCount, setFretCount] = useState(17);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 640) {
      setFretCount(12);
    }
  }, []);

  const tuning = TUNINGS[tuningKey];
  const typeOptions = mode === "scale" ? Object.keys(SCALE_INTERVALS) : Object.keys(CHORD_INTERVALS);
  const resolvedType = mode === "notes" ? "" : currentType || typeOptions[0] || "";

  const points = useMemo(
    () =>
      buildFretboardPoints({
        tuning,
        fretCount,
        root,
        mode,
        currentType: resolvedType,
        labelMode,
      }),
    [tuning, fretCount, root, mode, resolvedType, labelMode],
  );

  const selectedPoint = useMemo(() => {
    if (!selectedKey) return null;
    for (const column of points) {
      const hit = column.find((point) => `${point.stringIdx}-${point.fret}` === selectedKey);
      if (hit) return hit;
    }
    return null;
  }, [points, selectedKey]);

  const info = selectedPoint ? toSelectedPoint(selectedPoint) : null;

  const handleModeChange = (nextMode: TheoryMode) => {
    setMode(nextMode);
    if (nextMode === "notes") {
      setCurrentType("");
      return;
    }
    const nextOptions = nextMode === "scale" ? Object.keys(SCALE_INTERVALS) : Object.keys(CHORD_INTERVALS);
    setCurrentType((prev) => prev || nextOptions[0] || "");
  };

  const exportPng = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const title =
      mode === "notes" ? `Fretboard · ${labelMode === "degrees" ? "Graus" : "Notas"}` : `${NOTES[root]} ${resolvedType}`;
    const width = 34 * 2 + LABEL_WIDTH + OPEN_WIDTH + NUT_WIDTH + fretCount * FRET_WIDTH;
    const height = 34 * 2 + 72 + STRING_HEIGHT * 6 + 44;

    canvas.width = width * EXPORT_SCALE;
    canvas.height = height * EXPORT_SCALE;
    ctx.scale(EXPORT_SCALE, EXPORT_SCALE);

    ctx.fillStyle = "#080304";
    ctx.fillRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, "#220c10");
    bg.addColorStop(0.34, "#18080b");
    bg.addColorStop(1, "#050203");
    ctx.fillStyle = bg;
    ctx.fillRect(10, 10, width - 20, height - 20);

    ctx.strokeStyle = "rgba(237,228,212,0.16)";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.fillStyle = "#61d0c4";
    ctx.font = "600 10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CAIO DURAZZO · ESTUDO", width / 2, 28);

    ctx.fillStyle = "#efe4d2";
    ctx.font = "700 22px Georgia, serif";
    ctx.fillText(title, width / 2, 54);

    ctx.fillStyle = "rgba(237,228,212,0.55)";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText(
      `${tuning.label} · ${mode === "notes" ? "Todas as notas" : mode === "scale" ? "Escala" : "Acorde"} · ${
        labelMode === "degrees" ? "Graus" : "Notas"
      }`,
      width / 2,
      72,
    );

    const top = 92;
    const boardLeft = 24;
    const xOpen = boardLeft + LABEL_WIDTH;
    const xNut = xOpen + OPEN_WIDTH;
    const xStart = xNut + NUT_WIDTH;
    const boardHeight = STRING_HEIGHT * 6;

    const wood = ctx.createLinearGradient(0, top, 0, top + boardHeight);
    wood.addColorStop(0, "#2b100f");
    wood.addColorStop(0.5, "#3a1418");
    wood.addColorStop(1, "#221012");
    ctx.fillStyle = wood;
    ctx.fillRect(xStart, top, fretCount * FRET_WIDTH, boardHeight);

    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fillRect(boardLeft, top, LABEL_WIDTH, boardHeight);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(xOpen, top, OPEN_WIDTH, boardHeight);

    const nut = ctx.createLinearGradient(xNut, 0, xNut + NUT_WIDTH, 0);
    nut.addColorStop(0, "#efe4d2");
    nut.addColorStop(1, "#cab8a1");
    ctx.fillStyle = nut;
    ctx.fillRect(xNut, top, NUT_WIDTH, boardHeight);

    for (let stringIdx = 0; stringIdx < 6; stringIdx += 1) {
      const y = top + stringIdx * STRING_HEIGHT + STRING_HEIGHT / 2;
      ctx.fillStyle = "#c9b89b";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(tuning.names[stringIdx], boardLeft + LABEL_WIDTH / 2, y + 4);

      ctx.strokeStyle = stringIdx < 4 ? "rgba(228,195,124,0.62)" : "rgba(214,217,221,0.58)";
      ctx.lineWidth = [1.2, 1.5, 1.8, 2.1, 2.7, 3][stringIdx];
      ctx.beginPath();
      ctx.moveTo(xNut, y);
      ctx.lineTo(xStart + fretCount * FRET_WIDTH, y);
      ctx.stroke();
    }

    for (let fret = 1; fret <= fretCount; fret += 1) {
      const x = xStart + fret * FRET_WIDTH;
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, top + boardHeight);
      ctx.stroke();
    }

    Object.entries(FRET_DOTS).forEach(([fretRaw, count]) => {
      const fret = Number(fretRaw);
      if (fret > fretCount) return;
      const x = xStart + (fret - 0.5) * FRET_WIDTH;
      const drawDot = (y: number) => {
        ctx.beginPath();
        ctx.fillStyle = "rgba(237,228,212,0.24)";
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      };
      if (count === 1) drawDot(top + STRING_HEIGHT * 2.5);
      if (count === 2) {
        drawDot(top + STRING_HEIGHT * 1.5);
        drawDot(top + STRING_HEIGHT * 3.5);
      }
    });

    for (let fret = 1; fret <= fretCount; fret += 1) {
      ctx.fillStyle = FRET_DOTS[fret] ? "#61d0c4" : "rgba(237,228,212,0.42)";
      ctx.font = "10px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(fret), xStart + (fret - 0.5) * FRET_WIDTH, top + boardHeight + 18);
    }

    points.forEach((column) => {
      column.forEach((point) => {
        if (!point.highlighted) return;
        const x = point.fret === 0 ? xOpen + OPEN_WIDTH / 2 : xStart + (point.fret - 0.5) * FRET_WIDTH;
        const y = top + point.stringIdx * STRING_HEIGHT + STRING_HEIGHT / 2;
        const label = point.displayLabel;

        ctx.beginPath();
        ctx.fillStyle = point.root
          ? "rgba(244,224,77,0.22)"
          : point.interval === 3 || point.interval === 4 || point.interval === 10 || point.interval === 11
            ? "rgba(97,208,196,0.12)"
            : "rgba(0,0,0,0.44)";
        ctx.strokeStyle = point.root ? "#f4e04d" : "rgba(237,228,212,0.24)";
        ctx.lineWidth = point.root ? 1.4 : 1.1;
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = point.root ? "#fff6dc" : "#efe4d2";
        ctx.font = `700 ${label.length > 2 ? 8 : 9}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x, y + 0.5);
        ctx.textBaseline = "alphabetic";
      });
    });

    ctx.fillStyle = "rgba(237,228,212,0.24)";
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Caio Durazzo · Ferramenta de estudo", width / 2, height - 12);

    const a = document.createElement("a");
    a.download = `caio-durazzo-fretboard-${title.replace(/[\s/]+/g, "-").toLowerCase()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const renderButton = (point: FretboardPoint) => {
    const isSelected = selectedKey === `${point.stringIdx}-${point.fret}`;
    const muted = !point.highlighted;
    return (
      <button
        key={`${point.stringIdx}-${point.fret}`}
        type="button"
        disabled={muted}
        onClick={() =>
          setSelectedKey((prev) => (prev === `${point.stringIdx}-${point.fret}` ? null : `${point.stringIdx}-${point.fret}`))
        }
        title={`${point.noteName} · ${point.intervalLabel} (${point.intervalDescriptor}) · ${point.stringLabel} · ${
          point.fret === 0 ? "solta" : `traste ${point.fret}`
        }`}
        aria-label={`${point.noteName}, ${point.intervalLabel}, ${point.intervalDescriptor}`}
        className={[
          "tool-note-btn",
          point.root ? "tool-note-btn-root" : degreeAccent(point.interval),
          isSelected ? "tool-note-btn-active" : "",
          muted ? "pointer-events-none opacity-[0.09]" : "",
        ].join(" ")}
        onMouseDown={async () => {
          await playGuitarNote((point.octave + 1) * 12 + point.note, point.stringIdx, audioMuted);
        }}
      >
        <span className={labelMode === "degrees" && point.displayLabel.length > 2 ? "text-[10px]" : ""}>
          {point.displayLabel}
        </span>
      </button>
    );
  };

  return (
    <div className="tool-shell">
      <div className="tool-shell-header">
        <div>
          <p className="tool-eyebrow">Ferramenta de estudo</p>
          <h2 className="cd-display-title mt-3 font-rock text-[clamp(1.8rem,4vw,3rem)] uppercase leading-[0.95] tracking-[0.08em] text-[#efe4d2]">
            Fretboard
          </h2>
          <p className="tool-shell-copy">
            Visualize notas, escalas, acordes e agora tambem os graus harmonicos relativos a raiz.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="cd-btn-ghost !px-5"
            onClick={() => setAudioMuted((prev) => !prev)}
            aria-pressed={audioMuted}
          >
            {audioMuted ? "Audio mutado" : "Audio ativo"}
          </button>
          <button type="button" className="cd-btn-primary" onClick={exportPng}>
            Exportar PNG
          </button>
        </div>
      </div>

      <div className="tool-controls-grid">
        <label className="tool-control">
          <span className="tool-control-label">Afinacao</span>
          <select value={tuningKey} onChange={(event) => setTuningKey(event.target.value as TuningKey)} className="tool-select">
            {Object.entries(TUNINGS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label} - {value.names.join(" ")}
              </option>
            ))}
          </select>
        </label>

        <label className="tool-control">
          <span className="tool-control-label">Modo</span>
          <select value={mode} onChange={(event) => handleModeChange(event.target.value as TheoryMode)} className="tool-select">
            <option value="notes">Todas as Notas</option>
            <option value="scale">Escala</option>
            <option value="chord">Acorde</option>
          </select>
        </label>

        <label className="tool-control">
          <span className="tool-control-label">Rotulo</span>
          <select
            value={labelMode}
            onChange={(event) => setLabelMode(event.target.value as LabelMode)}
            className="tool-select"
          >
            <option value="notes">Notas</option>
            <option value="degrees">Graus</option>
          </select>
        </label>

        <label className="tool-control">
          <span className="tool-control-label">Raiz</span>
          <select value={root} onChange={(event) => setRoot(Number(event.target.value))} className="tool-select">
            {NOTES.map((note, index) => (
              <option key={note} value={index}>
                {note}
              </option>
            ))}
          </select>
        </label>

        {mode !== "notes" ? (
          <label className="tool-control">
            <span className="tool-control-label">Tipo</span>
            <select value={resolvedType} onChange={(event) => setCurrentType(event.target.value)} className="tool-select">
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="tool-control">
          <span className="tool-control-label">Trastes</span>
          <select value={fretCount} onChange={(event) => setFretCount(Number(event.target.value))} className="tool-select">
            {FRET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} trastes
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="tool-panel overflow-x-auto">
        <div
          className="mx-auto min-w-max"
          style={{
            width: LABEL_WIDTH + OPEN_WIDTH + NUT_WIDTH + fretCount * FRET_WIDTH + 40,
          }}
        >
          <div className="mb-3 flex" style={{ marginLeft: LABEL_WIDTH + OPEN_WIDTH + NUT_WIDTH }}>
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
                  {getStringLabel(tuning, stringIdx)}
                </div>
              ))}
            </div>

            <div className="tool-open-column" style={{ width: OPEN_WIDTH }}>
              {points[0].map((point) => (
                <div key={`open-${point.stringIdx}`} className="flex items-center justify-center" style={{ height: STRING_HEIGHT }}>
                  {renderButton(point)}
                </div>
              ))}
            </div>

            <div className="tool-nut" style={{ width: NUT_WIDTH }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="tool-nut-slot" style={{ height: STRING_HEIGHT }} />
              ))}
            </div>

            <div className="tool-frets-area" style={{ width: fretCount * FRET_WIDTH }}>
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

              <div className="relative z-[3] flex">
                {points.slice(1).map((column, columnIndex) => (
                  <div key={columnIndex} className="flex flex-col" style={{ width: FRET_WIDTH }}>
                    {column.map((point) => (
                      <div key={`${columnIndex}-${point.stringIdx}`} className="flex items-center justify-center" style={{ height: STRING_HEIGHT }}>
                        {renderButton(point)}
                      </div>
                    ))}
                  </div>
                ))}
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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="tool-info-grid">
          <div className="tool-info-card">
            <span className="tool-info-label">Nota selecionada</span>
            <span className="tool-info-value">{info?.note ?? "—"}</span>
          </div>
          <div className="tool-info-card">
            <span className="tool-info-label">Grau / intervalo</span>
            <span className="tool-info-value">{info?.degree ?? "—"}</span>
            <span className="mt-2 text-xs uppercase tracking-[0.18em] text-cd-faint">{info?.degreeName ?? "—"}</span>
          </div>
          <div className="tool-info-card">
            <span className="tool-info-label">Corda</span>
            <span className="tool-info-value text-base">{info?.string ?? "—"}</span>
          </div>
          <div className="tool-info-card">
            <span className="tool-info-label">Traste</span>
            <span className="tool-info-value">{info?.fret ?? "—"}</span>
          </div>
          <div className="tool-info-card">
            <span className="tool-info-label">Oitava</span>
            <span className="tool-info-value">{info?.octave ?? "—"}</span>
          </div>
        </div>

        <div className="tool-panel">
          <p className="tool-eyebrow">Leitura pedagogica</p>
          <div className="mt-4 space-y-3 text-sm leading-[1.7] text-cd-wash/80">
            <p>
              Em <strong className="text-cd-mist">Graus</strong>, cada bolinha mostra a funcao harmonica relativa a{" "}
              <strong className="text-cd-mist">{NOTES[root]}</strong>.
            </p>
            <p>
              Base cromatica:{" "}
              {[0, 1, 2, 3, 4, 5].map((interval) => getIntervalLabel(interval)).join(" · ")} ·{" "}
              {[6, 7, 8, 9, 10, 11].map((interval) => getIntervalLabel(interval)).join(" · ")}
            </p>
            <p>
              Convencao teorica usada aqui: a tonica aparece como <strong className="text-cd-mist">T</strong>, e os
              demais graus seguem a leitura intervalar cromatica relativa a raiz.
            </p>
            <p>
              Exemplo da nota clicada:{" "}
              {selectedPoint
                ? `${selectedPoint.noteName} = ${getDisplayLabel(
                    selectedPoint.note,
                    root,
                    "degrees",
                  )} (${selectedPoint.intervalDescriptor}) em relacao a ${NOTES[root]}`
                : "clique em uma posicao para ver o intervalo aqui."}
            </p>
            <p>{audioMuted ? "Audio desativado no momento." : "Clique em qualquer posicao para ouvir a nota."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
