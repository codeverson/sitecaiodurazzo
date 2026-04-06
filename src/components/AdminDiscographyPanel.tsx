import { useCallback, useEffect, useMemo, useState } from "react";
import { type DiscographyFlatItem } from "../data/discographyData";
import { useDiscographyCovers, type AdminDiscographyEntry } from "../context/DiscographyCoversContext";
import { uploadImageToHostinger } from "../lib/hostingerUploads";

const adminDivider = "border-white/[0.15]";

const field =
  "w-full border border-white/40 bg-black/80 px-4 py-3.5 font-serif text-sm text-white placeholder:text-white/55 transition-[border-color,box-shadow] focus:border-[#c6a15b] focus:outline-none focus:ring-2 focus:ring-[#c6a15b]/35 focus:shadow-[0_0_0_1px_rgba(198,161,91,0.25)]";

const label =
  "mb-2 block font-display text-[10px] tracking-[0.28em] text-white/85";

const sectionTitle = "font-heading text-2xl font-black uppercase tracking-[0.08em] text-white sm:text-3xl";

const filterBtnBase =
  "border px-3 py-2 font-display text-[8px] tracking-[0.2em] transition-colors sm:px-4 sm:text-[9px] sm:tracking-[0.22em]";
const filterBtnActive = "border-[#c6a15b] bg-black/70 text-[#f2e6c8]";
const filterBtnIdle = "border-white/25 text-white/65 hover:border-white/45 hover:text-white/90";

type DiscographyPanelFilter = "all" | "visible" | "hidden" | "excluded";

type MetaPatch = Partial<
  Pick<
    DiscographyFlatItem,
    "year" | "title" | "format" | "project" | "role" | "spotifyUrl" | "spotifyFound" | "listenUrl"
  >
>;

function DiscographyCoverRow({
  entry,
  onSaveMeta,
  setCoverOverride,
  setDiscographyHidden,
  setCatalogExcludedFromPanel,
  removeCustomDiscographyRelease,
  showToast,
}: {
  entry: AdminDiscographyEntry;
  onSaveMeta: (flatId: string, patch: MetaPatch) => void;
  setCoverOverride: (flatId: string, url: string | null) => void;
  setDiscographyHidden: (flatId: string, hidden: boolean) => void;
  setCatalogExcludedFromPanel: (flatId: string, excluded: boolean) => void;
  removeCustomDiscographyRelease: (flatId: string) => void;
  showToast: (msg: string) => void;
}) {
  const { item, hidden, excluded, isCustom } = entry;
  const [metaDraft, setMetaDraft] = useState({
    year: item.year,
    title: item.title,
    role: item.role,
    format: item.format,
    project: item.project,
  });
  const [spotifyDraft, setSpotifyDraft] = useState(item.spotifyUrl ?? "");
  const [listenUrlDraft, setListenUrlDraft] = useState(item.listenUrl ?? "");

  useEffect(() => {
    setMetaDraft({
      year: item.year,
      title: item.title,
      role: item.role,
      format: item.format,
      project: item.project,
    });
    setSpotifyDraft(item.spotifyUrl ?? "");
    setListenUrlDraft(item.listenUrl ?? "");
  }, [item.format, item.listenUrl, item.project, item.role, item.spotifyUrl, item.title, item.year]);

  const preview = item.coverUrlOverride ?? item.localCoverPath ?? null;

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
          <div className="flex flex-wrap items-center gap-2">
            {excluded ? (
              <span className="inline-flex border border-rose-500/40 bg-rose-950/35 px-2 py-1 font-display text-[8px] tracking-[0.2em] text-rose-100/90">
                EXCLUÍDO DO PAINEL
              </span>
            ) : hidden ? (
              <span className="inline-flex border border-amber-500/45 bg-amber-950/40 px-2 py-1 font-display text-[8px] tracking-[0.2em] text-amber-100/90">
                OCULTO NO SITE
              </span>
            ) : (
              <span className="inline-flex border border-emerald-500/35 bg-emerald-950/30 px-2 py-1 font-display text-[8px] tracking-[0.2em] text-emerald-100/85">
                VISÍVEL NO SITE
              </span>
            )}
            {isCustom ? (
              <span className="inline-flex border border-white/20 px-2 py-1 font-display text-[8px] tracking-[0.2em] text-white/60">
                LANÇAMENTO ADICIONADO NO PAINEL
              </span>
            ) : (
              <span className="inline-flex border border-white/15 px-2 py-1 font-display text-[8px] tracking-[0.2em] text-white/45">
                CATÁLOGO BASE
              </span>
            )}
          </div>

          <div>
            <p className="font-display text-[8px] tracking-[0.32em] text-[#c6a15b]/90">
              {item.project.toUpperCase()} · {item.year || "—"}
            </p>
            <p className="mt-2 font-heading text-lg font-bold uppercase tracking-[0.06em] text-white">
              {item.title || "(sem título)"}
            </p>
            <p className="mt-1 font-display text-[9px] tracking-[0.22em] text-white/50">{item.format || "—"}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {excluded ? (
              <button
                type="button"
                className="border border-emerald-500/40 px-4 py-2 font-display text-[9px] tracking-[0.22em] text-emerald-100/90 transition-colors hover:border-emerald-400/60 hover:text-white"
                onClick={() => {
                  setCatalogExcludedFromPanel(item.flatId, false);
                  showToast("Disco de volta ao painel e elegível para o site (ajuste visibilidade se precisar).");
                }}
              >
                Restaurar no painel
              </button>
            ) : (
              <>
                {hidden ? (
                  <button
                    type="button"
                    className="border border-white/35 px-4 py-2 font-display text-[9px] tracking-[0.22em] text-white/85 transition-colors hover:border-emerald-400/50 hover:text-white"
                    onClick={() => {
                      setDiscographyHidden(item.flatId, false);
                      showToast("Lançamento voltará a aparecer no site.");
                    }}
                  >
                    Mostrar no site
                  </button>
                ) : (
                  <button
                    type="button"
                    className="border border-white/25 px-4 py-2 font-display text-[9px] tracking-[0.22em] text-white/70 transition-colors hover:border-amber-400/45 hover:text-white"
                    onClick={() => {
                      setDiscographyHidden(item.flatId, true);
                      showToast("Lançamento oculto no site público (continua listado aqui).");
                    }}
                  >
                    Ocultar do site
                  </button>
                )}
                {isCustom ? (
                  <button
                    type="button"
                    className="border border-red-500/35 px-4 py-2 font-display text-[9px] tracking-[0.22em] text-red-200/90 transition-colors hover:border-red-400/55 hover:text-red-100"
                    onClick={() => {
                      if (
                        typeof window !== "undefined" &&
                        !window.confirm(
                          "Excluir este lançamento para sempre? Esta ação não pode ser desfeita e o item deixa de aparecer no painel.",
                        )
                      ) {
                        return;
                      }
                      removeCustomDiscographyRelease(item.flatId);
                      showToast("Lançamento removido.");
                    }}
                  >
                    Excluir lançamento
                  </button>
                ) : (
                  <button
                    type="button"
                    className="border border-red-500/35 px-4 py-2 font-display text-[9px] tracking-[0.22em] text-red-200/90 transition-colors hover:border-red-400/55 hover:text-red-100"
                    onClick={() => {
                      if (
                        typeof window !== "undefined" &&
                        !window.confirm(
                          "Excluir este disco do painel e do site? Ele deixa de aparecer na lista principal; use o filtro «Excluídos do painel» para restaurar.",
                        )
                      ) {
                        return;
                      }
                      setCatalogExcludedFromPanel(item.flatId, true);
                      showToast("Disco excluído do painel e do site. Restaure pelo filtro «Excluídos do painel».");
                    }}
                  >
                    Excluir do painel
                  </button>
                )}
              </>
            )}
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
                onBlur={() => {
                  onSaveMeta(item.flatId, { year: metaDraft.year.trim() });
                  showToast("Dados do disco salvos.");
                }}
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
                onBlur={() => {
                  onSaveMeta(item.flatId, { project: metaDraft.project.trim() });
                  showToast("Dados do disco salvos.");
                }}
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
                onBlur={() => {
                  onSaveMeta(item.flatId, { title: metaDraft.title.trim() });
                  showToast("Dados do disco salvos.");
                }}
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
                onBlur={() => {
                  onSaveMeta(item.flatId, { role: metaDraft.role.trim() });
                  showToast("Dados do disco salvos.");
                }}
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
                onBlur={() => {
                  onSaveMeta(item.flatId, { format: metaDraft.format.trim() });
                  showToast("Dados do disco salvos.");
                }}
                className={field}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor={`spotify-${item.flatId}`}>
                Link do Spotify (opcional)
              </label>
              <input
                id={`spotify-${item.flatId}`}
                type="url"
                inputMode="url"
                placeholder="https://open.spotify.com/..."
                value={spotifyDraft}
                onChange={(e) => setSpotifyDraft(e.target.value)}
                onBlur={() => {
                  const t = spotifyDraft.trim();
                  onSaveMeta(item.flatId, {
                    spotifyUrl: t || null,
                    spotifyFound: Boolean(t),
                  });
                  showToast("Link do Spotify salvo.");
                }}
                className={field}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor={`listen-${item.flatId}`}>
                Link para ouvir sem Spotify (opcional)
              </label>
              <p className="mb-2 max-w-xl font-serif text-xs italic text-white/45">
                Use quando não houver Spotify: pode ser um link do Google Drive, Dropbox ou outro endereço onde o áudio
                esteja disponível. Cole o link completo que você copiar do navegador.
              </p>
              <input
                id={`listen-${item.flatId}`}
                type="url"
                inputMode="url"
                placeholder="https://drive.google.com/... ou outro link direto"
                value={listenUrlDraft}
                onChange={(e) => setListenUrlDraft(e.target.value)}
                onBlur={() => {
                  const t = listenUrlDraft.trim();
                  onSaveMeta(item.flatId, { listenUrl: t || null });
                  showToast(t ? "Link alternativo salvo." : "Link alternativo removido.");
                }}
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
                    showToast("Capa enviada com sucesso.");
                  })
                  .catch((error: unknown) => {
                    const message = error instanceof Error ? error.message : "Nao foi possivel enviar o arquivo.";
                    showToast(message);
                  });
                e.target.value = "";
              }}
            />
          </div>

          {item.coverUrlOverride ? (
            <button
              type="button"
              className="font-display text-[9px] tracking-[0.26em] text-white/55 underline decoration-white/25 underline-offset-4 transition-colors hover:text-red-300/90"
              onClick={() => {
                setCoverOverride(item.flatId, null);
                showToast("Capa manual removida.");
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
  const {
    adminPanelItems,
    setCoverOverride,
    setMetaOverride,
    setDiscographyHidden,
    addCustomDiscographyRelease,
    removeCustomDiscographyRelease,
    setCatalogExcludedFromPanel,
  } = useDiscographyCovers();

  const discographyItems = useMemo(() => adminPanelItems, [adminPanelItems]);

  const [panelFilter, setPanelFilter] = useState<DiscographyPanelFilter>("all");

  const filterCounts = useMemo(() => {
    const all = discographyItems.filter((e) => !e.excluded).length;
    const visible = discographyItems.filter((e) => !e.excluded && !e.hidden).length;
    const hidden = discographyItems.filter((e) => !e.excluded && e.hidden).length;
    const excluded = discographyItems.filter((e) => e.excluded).length;
    return { all, visible, hidden, excluded };
  }, [discographyItems]);

  const filteredDiscographyItems = useMemo(() => {
    switch (panelFilter) {
      case "all":
        return discographyItems.filter((e) => !e.excluded);
      case "visible":
        return discographyItems.filter((e) => !e.excluded && !e.hidden);
      case "hidden":
        return discographyItems.filter((e) => !e.excluded && e.hidden);
      case "excluded":
        return discographyItems.filter((e) => e.excluded);
      default:
        return discographyItems;
    }
  }, [discographyItems, panelFilter]);

  const onSaveMeta = useCallback(
    (flatId: string, patch: MetaPatch) => {
      setMetaOverride(flatId, patch);
    },
    [setMetaOverride],
  );

  return (
    <div className="mx-auto max-w-[100rem] px-5 py-12 sm:px-9 lg:px-12 lg:py-16">
      <div className={`mb-10 border-b ${adminDivider} pb-8`}>
        <h3 className={sectionTitle}>Discografia</h3>
        <p className="mt-4 max-w-2xl font-serif text-sm italic leading-relaxed text-white/78">
          O site só lista discos visíveis (não ocultos e não excluídos do painel). &quot;Ocultar do site&quot; mantém o
          disco na lista principal para reativar depois. &quot;Excluir do painel&quot; (catálogo base) ou &quot;Excluir
          lançamento&quot; (álbuns adicionados aqui) remove do público; os do catálogo base podem ser restaurados pelo
          filtro &quot;Excluídos do painel&quot;.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
          <span className="font-display text-[9px] tracking-[0.28em] text-white/55">FILTRAR LISTA</span>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "Todos", filterCounts.all] as const,
                ["visible", "Visíveis no site", filterCounts.visible] as const,
                ["hidden", "Ocultos no site", filterCounts.hidden] as const,
                ["excluded", "Excluídos do painel", filterCounts.excluded] as const,
              ] satisfies readonly (readonly [DiscographyPanelFilter, string, number])[]
            ).map(([id, label, count]) => (
              <button
                key={id}
                type="button"
                className={[filterBtnBase, panelFilter === id ? filterBtnActive : filterBtnIdle].join(" ")}
                onClick={() => setPanelFilter(id)}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="mt-6 border border-[#c6a15b]/55 bg-black/60 px-5 py-3 font-display text-[9px] tracking-[0.26em] text-[#f2e6c8] transition-colors hover:border-[#c6a15b] hover:bg-black/80"
          onClick={() => {
            addCustomDiscographyRelease();
            showToast("Novo álbum adicionado à lista. Preencha ano, título e projeto.");
          }}
        >
          Adicionar álbum
        </button>
      </div>

      <ul className="divide-y divide-white/[0.12]">
        {filteredDiscographyItems.length === 0 ? (
          <li className="py-12 text-center font-serif text-sm italic text-white/50">
            {panelFilter === "excluded"
              ? "Nenhum disco excluído do painel. Itens do catálogo base excluídos aparecem aqui para restauração."
              : panelFilter === "visible"
                ? "Nenhum disco visível no site com este filtro."
                : panelFilter === "hidden"
                  ? "Nenhum disco oculto no site no momento."
                  : "Nenhum disco nesta lista."}
          </li>
        ) : (
          filteredDiscographyItems.map((entry) => (
            <DiscographyCoverRow
              key={entry.item.flatId}
              entry={entry}
              onSaveMeta={onSaveMeta}
              setCoverOverride={setCoverOverride}
              setDiscographyHidden={setDiscographyHidden}
              setCatalogExcludedFromPanel={setCatalogExcludedFromPanel}
              removeCustomDiscographyRelease={removeCustomDiscographyRelease}
              showToast={showToast}
            />
          ))
        )}
      </ul>

      <div className="mt-10 border-t border-white/[0.12] pt-8">
        <p className="max-w-2xl font-serif text-sm text-white/65">
          Quer incluir outro disco no carrossel? Adicione mais um álbum — ele entra na lista acima para você editar.
        </p>
        <button
          type="button"
          className="mt-4 border border-[#c6a15b]/45 bg-black/50 px-5 py-3 font-display text-[9px] tracking-[0.26em] text-[#f2e6c8] transition-colors hover:border-[#c6a15b] hover:bg-black/75"
          onClick={() => {
            addCustomDiscographyRelease();
            showToast("Novo álbum adicionado à lista. Preencha ano, título e projeto.");
          }}
        >
          + Adicionar outro álbum
        </button>
      </div>
    </div>
  );
}
