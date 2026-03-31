import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { type DiscographyFlatItem } from "../data/discographyData";
import { useDiscographyCovers } from "../context/DiscographyCoversContext";

const adminDivider = "border-white/[0.15]";

const field =
  "w-full border border-white/40 bg-black/80 px-4 py-3.5 font-serif text-sm text-white placeholder:text-white/55 transition-[border-color,box-shadow] focus:border-[#c6a15b] focus:outline-none focus:ring-2 focus:ring-[#c6a15b]/35 focus:shadow-[0_0_0_1px_rgba(198,161,91,0.25)]";

const label =
  "mb-2 block font-display text-[10px] tracking-[0.28em] text-white/85";

const sectionTitle =
  "mt-3 font-heading text-2xl font-black uppercase tracking-[0.08em] text-white sm:text-3xl";

function DiscographyCoverRow({
  item,
  override,
  onSaveMeta,
  fileInputId,
  maxFileBytes,
  onPickFile,
  setCoverOverride,
  showToast,
}: {
  item: DiscographyFlatItem;
  override: string | undefined;
  onSaveMeta: (
    flatId: string,
    patch: Partial<Pick<DiscographyFlatItem, "year" | "title" | "format" | "project" | "role">>,
  ) => void;
  fileInputId: string;
  maxFileBytes: number;
  onPickFile: (flatId: string, files: FileList | null) => void;
  setCoverOverride: (flatId: string, url: string | null) => void;
  showToast: (msg: string) => void;
}) {
  const httpOverride = override?.startsWith("http") ? override : "";
  const [urlDraft, setUrlDraft] = useState(httpOverride);
  const [metaDraft, setMetaDraft] = useState({
    year: item.year,
    title: item.title,
    role: item.role,
    format: item.format,
    project: item.project,
  });

  useEffect(() => {
    setUrlDraft(override?.startsWith("http") ? override : "");
  }, [override]);

  useEffect(() => {
    setMetaDraft({
      year: item.year,
      title: item.title,
      role: item.role,
      format: item.format,
      project: item.project,
    });
  }, [item.format, item.project, item.role, item.title, item.year]);

  const preview = override ?? item.coverUrlOverride ?? item.localCoverPath ?? null;

  const applyUrl = useCallback(() => {
    const v = urlDraft.trim();
    if (!v) {
      showToast("Cole a URL antes de aplicar.");
      return;
    }
    if (!/^https?:\/\//i.test(v)) {
      showToast("Use uma URL que comece com http:// ou https://");
      return;
    }
    setCoverOverride(item.flatId, v);
    showToast("URL da capa salva.");
  }, [item.flatId, setCoverOverride, showToast, urlDraft]);

  return (
    <li className="py-8 sm:py-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="shrink-0">
          <p className={label}>PRÉVIA</p>
          <div className="relative h-36 w-36 overflow-hidden border border-white/25 bg-black/60 sm:h-40 sm:w-40">
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-3 text-center font-display text-[8px] tracking-[0.2em] text-white/35">
                SEM CAPA
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-5">
          <div>
            <p className="font-display text-[8px] tracking-[0.32em] text-[#c6a15b]/90">
              {item.project.toUpperCase()} · {item.year}
            </p>
            <p className="mt-2 font-heading text-lg font-bold uppercase tracking-[0.06em] text-white">
              {item.title}
            </p>
            <p className="mt-1 font-display text-[9px] tracking-[0.22em] text-white/50">{item.format}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor={`year-${item.flatId}`}>
                Ano
              </label>
              <input
                id={`year-${item.flatId}`}
                type="text"
                value={metaDraft.year}
                onChange={(e) => setMetaDraft((prev) => ({ ...prev, year: e.target.value }))}
                onBlur={() => onSaveMeta(item.flatId, { year: metaDraft.year.trim() })}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor={`project-${item.flatId}`}>
                Projeto
              </label>
              <input
                id={`project-${item.flatId}`}
                type="text"
                value={metaDraft.project}
                onChange={(e) => setMetaDraft((prev) => ({ ...prev, project: e.target.value }))}
                onBlur={() => onSaveMeta(item.flatId, { project: metaDraft.project.trim() })}
                className={field}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor={`title-${item.flatId}`}>
                Título
              </label>
              <input
                id={`title-${item.flatId}`}
                type="text"
                value={metaDraft.title}
                onChange={(e) => setMetaDraft((prev) => ({ ...prev, title: e.target.value }))}
                onBlur={() => onSaveMeta(item.flatId, { title: metaDraft.title.trim() })}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor={`role-${item.flatId}`}>
                Função / crédito
              </label>
              <input
                id={`role-${item.flatId}`}
                type="text"
                value={metaDraft.role}
                onChange={(e) => setMetaDraft((prev) => ({ ...prev, role: e.target.value }))}
                onBlur={() => onSaveMeta(item.flatId, { role: metaDraft.role.trim() })}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor={`format-${item.flatId}`}>
                Formato
              </label>
              <input
                id={`format-${item.flatId}`}
                type="text"
                value={metaDraft.format}
                onChange={(e) => setMetaDraft((prev) => ({ ...prev, format: e.target.value }))}
                onBlur={() => onSaveMeta(item.flatId, { format: metaDraft.format.trim() })}
                className={field}
              />
            </div>
          </div>

          <div>
            <label className={label} htmlFor={`url-${item.flatId}`}>
              URL da imagem (HTTPS)
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <input
                id={`url-${item.flatId}`}
                type="url"
                inputMode="url"
                placeholder="https://…"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                onBlur={() => {
                  const v = urlDraft.trim();
                  if (!v || v === httpOverride) return;
                  if (!/^https?:\/\//i.test(v)) return;
                  setCoverOverride(item.flatId, v);
                  showToast("URL da capa salva.");
                }}
                className={`${field} sm:flex-1`}
              />
              <button
                type="button"
                className="shrink-0 border border-white/35 px-4 py-3.5 font-display text-[9px] tracking-[0.22em] text-white transition-[border-color,background-color] hover:border-[#c6a15b] hover:bg-[#c6a15b]/15 sm:self-stretch"
                onClick={applyUrl}
              >
                APLICAR URL
              </button>
            </div>
          </div>

          <div>
            <label className={label} htmlFor={fileInputId}>
              Enviar arquivo
            </label>
            <input
              id={fileInputId}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="block w-full max-w-md font-serif text-xs text-white/80 file:mr-4 file:border file:border-white/35 file:bg-black/80 file:px-4 file:py-2 file:font-display file:text-[9px] file:tracking-[0.2em] file:text-white hover:file:border-[#c6a15b]/55"
              onChange={(e) => {
                onPickFile(item.flatId, e.target.files);
                e.target.value = "";
              }}
            />
            <p className="mt-2 font-display text-[8px] tracking-[0.12em] text-white/40">
              Máx. ~{Math.round(maxFileBytes / (1024 * 1024) * 10) / 10} MB · JPG, PNG, WebP ou GIF
            </p>
          </div>

          {override ? (
            <button
              type="button"
              className="font-display text-[9px] tracking-[0.26em] text-white/55 underline decoration-white/25 underline-offset-4 transition-colors hover:text-red-300/90"
              onClick={() => {
                setCoverOverride(item.flatId, null);
                setUrlDraft("");
                showToast("Capa removida.");
              }}
            >
              Remover capa manual
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export default function AdminDiscographyPanel({
  showToast,
}: {
  showToast: (msg: string) => void;
}) {
  const uid = useId();
  const { coverOverrides, setCoverOverride, setMetaOverride, maxFileBytes, shelfItems } = useDiscographyCovers();

  const discographyItems = useMemo(() => shelfItems, [shelfItems]);

  const onPickFile = useCallback(
    (flatId: string, fileList: FileList | null) => {
      const file = fileList?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showToast("Escolha um arquivo de imagem (JPG, PNG, WebP…).");
        return;
      }
      if (file.size > maxFileBytes) {
        showToast("Arquivo grande demais. Máx. ~1,8 MB — comprima ou use URL HTTPS.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const r = reader.result;
        if (typeof r === "string") {
          setCoverOverride(flatId, r);
          showToast("Capa salva neste navegador.");
        }
      };
      reader.onerror = () => showToast("Não foi possível ler o arquivo.");
      reader.readAsDataURL(file);
    },
    [maxFileBytes, setCoverOverride, showToast],
  );

  const onSaveMeta = useCallback(
    (
      flatId: string,
      patch: Partial<Pick<DiscographyFlatItem, "year" | "title" | "format" | "project" | "role">>,
    ) => {
      setMetaOverride(flatId, patch);
      showToast("Dados do disco salvos.");
    },
    [setMetaOverride, showToast],
  );

  return (
    <div className="mx-auto max-w-[100rem] px-5 py-12 sm:px-9 lg:px-12 lg:py-16">
      <div className={`mb-10 border-b ${adminDivider} pb-8`}>
        <p className="font-display text-[9px] tracking-[0.35em] text-white/55">DISCOGRAFIA</p>
        <h3 className={sectionTitle}>Discografia</h3>
        <p className="mt-4 max-w-2xl font-serif text-sm italic leading-relaxed text-white/78">
          Edite ano, título, função/crédito, formato, categoria/projeto e capas. As alterações ficam
          salvas apenas neste navegador (localStorage).
        </p>
      </div>

      <ul className={`divide-y divide-white/[0.12] border-t ${adminDivider}`}>
        {discographyItems.map((item) => (
          <DiscographyCoverRow
            key={item.flatId}
            item={item}
            override={coverOverrides[item.flatId]}
            onSaveMeta={onSaveMeta}
            fileInputId={`${uid}-file-${item.flatId}`}
            maxFileBytes={maxFileBytes}
            onPickFile={onPickFile}
            setCoverOverride={setCoverOverride}
            showToast={showToast}
          />
        ))}
      </ul>
    </div>
  );
}
