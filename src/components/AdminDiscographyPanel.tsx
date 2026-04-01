import { useCallback, useEffect, useMemo, useState } from "react";
import { type DiscographyFlatItem } from "../data/discographyData";
import { useDiscographyCovers } from "../context/DiscographyCoversContext";
import { uploadImageToHostinger } from "../lib/hostingerUploads";

const adminDivider = "border-white/[0.15]";

const field =
  "w-full border border-white/40 bg-black/80 px-4 py-3.5 font-serif text-sm text-white placeholder:text-white/55 transition-[border-color,box-shadow] focus:border-[#c6a15b] focus:outline-none focus:ring-2 focus:ring-[#c6a15b]/35 focus:shadow-[0_0_0_1px_rgba(198,161,91,0.25)]";

const label =
  "mb-2 block font-display text-[10px] tracking-[0.28em] text-white/85";

const sectionTitle = "font-heading text-2xl font-black uppercase tracking-[0.08em] text-white sm:text-3xl";

function DiscographyCoverRow({
  item,
  override,
  onSaveMeta,
  setCoverOverride,
  showToast,
}: {
  item: DiscographyFlatItem;
  override: string | undefined;
  onSaveMeta: (
    flatId: string,
    patch: Partial<Pick<DiscographyFlatItem, "year" | "title" | "format" | "project" | "role">>,
  ) => void;
  setCoverOverride: (flatId: string, url: string | null) => void;
  showToast: (msg: string) => void;
}) {
  const [metaDraft, setMetaDraft] = useState({
    year: item.year,
    title: item.title,
    role: item.role,
    format: item.format,
    project: item.project,
  });
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
            <label className={label} htmlFor={`upload-${item.flatId}`}>
              Enviar arquivo
            </label>
            <input
              id={`upload-${item.flatId}`}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="block w-full max-w-md font-serif text-xs text-white/80 file:mr-4 file:border file:border-white/35 file:bg-black/80 file:px-4 file:py-2 file:font-display file:text-[9px] file:tracking-[0.2em] file:text-white hover:file:border-[#c6a15b]/55"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!file.type.startsWith("image/")) {
                  showToast("Escolha um arquivo de imagem (JPG, PNG, WebP…).");
                  return;
                }
                void uploadImageToHostinger("discography", file)
                  .then((fileUrl) => {
                    setCoverOverride(item.flatId, fileUrl);
                    showToast("Capa enviada para a hospedagem.");
                  })
                  .catch((error: unknown) => {
                    const message = error instanceof Error ? error.message : "Nao foi possivel enviar o arquivo.";
                    showToast(message);
                  });
                e.target.value = "";
              }}
            />
          </div>

          {override ? (
            <button
              type="button"
              className="font-display text-[9px] tracking-[0.26em] text-white/55 underline decoration-white/25 underline-offset-4 transition-colors hover:text-red-300/90"
              onClick={() => {
                setCoverOverride(item.flatId, null);
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
  const { coverOverrides, setCoverOverride, setMetaOverride, shelfItems } = useDiscographyCovers();

  const discographyItems = useMemo(() => shelfItems, [shelfItems]);

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
        <h3 className={sectionTitle}>Discografia</h3>
        <p className="mt-4 max-w-2xl font-serif text-sm italic leading-relaxed text-white/78">
          Edite ano, título, função/crédito, formato, categoria/projeto e capas. As alterações ficam
          salvas no Firestore para refletir no site publicado. As capas podem ser enviadas direto para a hospedagem.
        </p>
      </div>

      <ul className="divide-y divide-white/[0.12]">
        {discographyItems.map((item) => (
          <DiscographyCoverRow
            key={item.flatId}
            item={item}
            override={coverOverrides[item.flatId]}
            onSaveMeta={onSaveMeta}
            setCoverOverride={setCoverOverride}
            showToast={showToast}
          />
        ))}
      </ul>
    </div>
  );
}
