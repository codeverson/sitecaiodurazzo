import { useCallback, useMemo, useState } from "react";
import { useYoutubeVideos } from "../context/YoutubeVideosContext";
import { parseYoutubeVideoId } from "../lib/youtube";
import type { YoutubeVideoItem } from "../types/youtubeVideo";

const field =
  "w-full border border-white/40 bg-black/80 px-3 py-2.5 font-serif text-sm text-white placeholder:text-white/45 transition-[border-color,box-shadow] focus:border-[#c6a15b] focus:outline-none focus:ring-2 focus:ring-[#c6a15b]/35";
const label = "mb-1.5 block font-display text-[8px] tracking-[0.26em] text-white/75";
const adminDivider = "border-white/[0.15]";

export default function AdminYoutubePanel() {
  const { videos, updateVideo, addVideo, removeVideo, moveVideo, setFeatured, toggleActive } =
    useYoutubeVideos();
  const [toast, setToast] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const sorted = useMemo(
    () => [...videos].sort((a, b) => a.order - b.order),
    [videos],
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const handleAdd = useCallback(() => {
    addVideo({
      title: "Novo vídeo",
      url: "https://www.youtube.com/watch?v=",
      label: "",
      thumbnailUrl: "",
      isFeatured: sorted.length === 0,
      isActive: true,
    });
    showToast("Vídeo adicionado. Cole a URL e ajuste o título.");
  }, [addVideo, sorted.length, showToast]);

  return (
    <div className="mx-auto max-w-[56rem] px-5 py-12 sm:px-9 lg:px-12 lg:py-16">
      <div className={`mb-10 border-b ${adminDivider} pb-8`}>
        <p className="font-display text-[9px] tracking-[0.35em] text-white/55">YOUTUBE</p>
        <h3 className="mt-2 font-heading text-2xl font-black uppercase tracking-[0.08em] text-white sm:text-3xl">
          Vídeos do site
        </h3>
        <p className="mt-4 max-w-xl font-serif text-sm italic leading-relaxed text-white/75">
          Defina destaque, ordem, título e URL. Thumbnail vazia usa automaticamente a capa do
          YouTube. Desative itens para ocultar na home sem apagar.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="border border-[#c6a15b] bg-[#c6a15b] px-8 py-3.5 font-display text-[9px] tracking-[0.22em] text-black transition-colors hover:bg-[#d4b56e]"
        >
          ADICIONAR VÍDEO
        </button>
      </div>

      <ul className="space-y-8">
        {sorted.map((v, idx) => (
          <li
            key={v.id}
            className={`border ${adminDivider} bg-white/[0.02] p-5 sm:p-6`}
          >
            <VideoEditorRow
              v={v}
              index={idx}
              total={sorted.length}
              isPendingDelete={pendingDeleteId === v.id}
              onChange={(patch) => updateVideo(v.id, patch)}
              onMove={(dir) => moveVideo(v.id, dir)}
              onFeatured={() => {
                setFeatured(v.id);
                showToast("Vídeo em destaque atualizado.");
              }}
              onToggleActive={() => toggleActive(v.id)}
              onRequestDelete={() => setPendingDeleteId(v.id)}
              onCancelDelete={() => setPendingDeleteId(null)}
              onConfirmDelete={() => {
                removeVideo(v.id);
                setPendingDeleteId(null);
                showToast("Vídeo removido.");
              }}
            />
          </li>
        ))}
      </ul>

      {toast ? (
        <div
          className="pointer-events-none fixed bottom-8 left-1/2 z-[600] max-w-[90vw] -translate-x-1/2 border border-[#c6a15b]/45 bg-black/90 px-8 py-3.5 font-display text-[9px] tracking-[0.22em] text-white shadow-2xl"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function VideoEditorRow({
  v,
  index,
  total,
  isPendingDelete,
  onChange,
  onMove,
  onFeatured,
  onToggleActive,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  v: YoutubeVideoItem;
  index: number;
  total: number;
  isPendingDelete: boolean;
  onChange: (patch: Partial<YoutubeVideoItem>) => void;
  onMove: (dir: "up" | "down") => void;
  onFeatured: () => void;
  onToggleActive: () => void;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  const idPreview = parseYoutubeVideoId(v.url);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label}>TÍTULO</label>
          <input
            type="text"
            value={v.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className={field}
            placeholder="Título exibido no site"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>URL DO YOUTUBE</label>
          <input
            type="url"
            value={v.url}
            onChange={(e) => onChange({ url: e.target.value })}
            className={field}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {idPreview ? (
            <p className="mt-2 font-display text-[8px] tracking-wide text-white/50">
              ID detectado: <span className="text-[#c6a15b]/90">{idPreview}</span>
            </p>
          ) : v.url.trim() ? (
            <p className="mt-2 font-display text-[8px] text-cd-warn">URL não reconhecida.</p>
          ) : null}
        </div>
        <div>
          <label className={label}>RÓTULO (OPCIONAL)</label>
          <input
            type="text"
            value={v.label}
            onChange={(e) => onChange({ label: e.target.value })}
            className={field}
            placeholder="Ex.: ao vivo"
          />
        </div>
        <div>
          <label className={label}>THUMBNAIL (OPCIONAL)</label>
          <input
            type="url"
            value={v.thumbnailUrl}
            onChange={(e) => onChange({ thumbnailUrl: e.target.value })}
            className={field}
            placeholder="Vazio = automático"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/[0.1] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <label className="flex cursor-pointer items-center gap-2 font-display text-[9px] tracking-[0.2em] text-white/85">
          <input
            type="checkbox"
            checked={v.isActive}
            onChange={onToggleActive}
            className="h-3.5 w-3.5 accent-[#c6a15b]"
          />
          ATIVO NA HOME
        </label>
        <label className="flex cursor-pointer items-center gap-2 font-display text-[9px] tracking-[0.2em] text-white/85">
          <input
            type="radio"
            name="youtube-featured"
            checked={v.isFeatured}
            onChange={() => v.isActive && onFeatured()}
            disabled={!v.isActive}
            className="h-3.5 w-3.5 accent-[#c6a15b]"
          />
          DESTAQUE (PRINCIPAL)
        </label>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            disabled={index <= 0}
            onClick={() => onMove("up")}
            className="border border-white/30 px-3 py-2 font-display text-[8px] tracking-[0.18em] text-white/80 disabled:opacity-35 hover:border-white/45"
          >
            SUBIR
          </button>
          <button
            type="button"
            disabled={index >= total - 1}
            onClick={() => onMove("down")}
            className="border border-white/30 px-3 py-2 font-display text-[8px] tracking-[0.18em] text-white/80 disabled:opacity-35 hover:border-white/45"
          >
            DESCER
          </button>
        </div>
        {isPendingDelete ? (
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={onCancelDelete}
              className="border border-white/30 px-3 py-2 font-display text-[8px] tracking-[0.18em] text-white/80"
            >
              CANCELAR
            </button>
            <button
              type="button"
              onClick={onConfirmDelete}
              className="border border-cd-warn/55 px-3 py-2 font-display text-[8px] tracking-[0.18em] text-cd-warn"
            >
              CONFIRMAR EXCLUSÃO
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onRequestDelete}
            className="mt-1 self-start font-display text-[9px] tracking-[0.2em] text-white/78 underline decoration-white/35 underline-offset-4 hover:text-[#c6a15b]"
          >
            EXCLUIR
          </button>
        )}
      </div>
    </div>
  );
}
