import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { discographyData, flattenDiscography, type DiscographyFlatItem } from "../data/discographyData";
import { clearSpotifyResolveCache } from "../lib/resolveSpotifyAlbumData";
import { isFirebaseConfigured } from "../lib/firebase";
import {
  deleteDiscographyRecord,
  saveDiscographyRecord,
  subscribeDiscography,
} from "../lib/firestore/siteContent";
import type { DiscographyRecord } from "../types/firebaseContent";

const MAX_FILE_BYTES = 1.8 * 1024 * 1024;

const STATIC_DISCOGRAPHY_FLAT = flattenDiscography(discographyData);
const STATIC_FLAT_ID_SET = new Set(STATIC_DISCOGRAPHY_FLAT.map((i) => i.flatId));

const CUSTOM_DISCOGRAPHY_FLAT_ID_PREFIX = "custom-";

const LOCAL_CUSTOM_DISCOGRAPHY_KEY = "caio-durazzo-discography-custom-v1";
const LOCAL_STATIC_OVERRIDES_KEY = "caio-durazzo-discography-static-overrides-v1";

function isPanelCustomFlatId(flatId: string): boolean {
  return flatId.startsWith(CUSTOM_DISCOGRAPHY_FLAT_ID_PREFIX);
}

function loadLocalCustomDiscography(): DiscographyRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_CUSTOM_DISCOGRAPHY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((row): row is DiscographyRecord => {
      if (!row || typeof row !== "object") return false;
      const rec = row as Record<string, unknown>;
      return typeof rec.flatId === "string" && isPanelCustomFlatId(rec.flatId);
    });
  } catch {
    return [];
  }
}

function persistLocalCustomDiscography(rows: DiscographyRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_CUSTOM_DISCOGRAPHY_KEY, JSON.stringify(rows));
  } catch {
    /* quota / private mode */
  }
}

function loadLocalStaticOverrides(): Record<string, Partial<DiscographyRecord>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_STATIC_OVERRIDES_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const out: Record<string, Partial<DiscographyRecord>> = {};
    for (const [flatId, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (!STATIC_FLAT_ID_SET.has(flatId) || !v || typeof v !== "object") continue;
      out[flatId] = { ...(v as Partial<DiscographyRecord>), flatId };
    }
    return out;
  } catch {
    return {};
  }
}

function persistLocalStaticOverrides(map: Record<string, Partial<DiscographyRecord>>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_STATIC_OVERRIDES_KEY, JSON.stringify(map));
  } catch {
    /* quota / private mode */
  }
}

export type AdminDiscographyEntry = {
  item: DiscographyFlatItem;
  hidden: boolean;
  /** Catálogo base: removido do painel principal e do site (restaurável pelo filtro Excluídos). */
  excluded: boolean;
  isCustom: boolean;
};

type DiscographyMetaOverride = Partial<
  Pick<
    DiscographyFlatItem,
    "year" | "title" | "format" | "project" | "role" | "spotifyUrl" | "spotifyFound" | "listenUrl"
  >
>;

type DiscographyCoversContextValue = {
  adminPanelItems: AdminDiscographyEntry[];
  shelfItems: DiscographyFlatItem[];
  setCoverOverride: (flatId: string, url: string | null) => void;
  setMetaOverride: (flatId: string, patch: DiscographyMetaOverride) => void;
  setDiscographyHidden: (flatId: string, hidden: boolean) => void;
  addCustomDiscographyRelease: () => void;
  removeCustomDiscographyRelease: (flatId: string) => void;
  /** Só catálogo base: marca como excluído do painel e do site (ou restaura). */
  setCatalogExcludedFromPanel: (flatId: string, excluded: boolean) => void;
  maxFileBytes: number;
};

function mergeStaticItem(item: DiscographyFlatItem, row?: DiscographyRecord): DiscographyFlatItem {
  return {
    ...item,
    year: row?.year ?? item.year,
    title: row?.title ?? item.title,
    format: row?.format ?? item.format,
    project: row?.project ?? item.project,
    role: row?.role ?? item.role,
    spotifyUrl: row?.spotifyUrl !== undefined ? row.spotifyUrl : item.spotifyUrl,
    spotifyFound: row?.spotifyFound !== undefined ? row.spotifyFound : item.spotifyFound,
    listenUrl: row?.listenUrl !== undefined ? row.listenUrl : item.listenUrl,
    coverUrlOverride: row?.coverUrl?.trim() ? row.coverUrl.trim() : item.coverUrlOverride,
  };
}

function recordToFlatItem(row: DiscographyRecord): DiscographyFlatItem {
  return {
    flatId: row.flatId,
    year: row.year ?? "",
    title: row.title ?? "",
    format: row.format ?? "",
    project: row.project ?? "",
    role: row.role ?? "",
    spotifyUrl: row.spotifyUrl ?? null,
    spotifyFound: row.spotifyFound ?? false,
    listenUrl: row.listenUrl ?? undefined,
    coverUrlOverride: row.coverUrl?.trim() || undefined,
  };
}

const DiscographyCoversContext = createContext<DiscographyCoversContextValue | null>(null);

export function DiscographyCoversProvider({ children }: { children: ReactNode }) {
  const firebaseEnabled = isFirebaseConfigured();

  const [firestoreRows, setFirestoreRows] = useState<DiscographyRecord[]>([]);
  const [localCustomRows, setLocalCustomRows] = useState<DiscographyRecord[]>(() =>
    firebaseEnabled ? [] : loadLocalCustomDiscography(),
  );
  const [localStaticOverrides, setLocalStaticOverrides] = useState<Record<string, Partial<DiscographyRecord>>>(() =>
    firebaseEnabled ? {} : loadLocalStaticOverrides(),
  );

  useEffect(
    () =>
      subscribeDiscography((rows) => {
        setFirestoreRows(rows);
      }),
    [],
  );

  const discographyRows = useMemo(() => {
    if (firebaseEnabled) return firestoreRows;
    return [...firestoreRows, ...localCustomRows];
  }, [firebaseEnabled, firestoreRows, localCustomRows]);

  const adminPanelItems = useMemo((): AdminDiscographyEntry[] => {
    const rowsById: Record<string, DiscographyRecord> = {};
    discographyRows.forEach((r) => {
      rowsById[r.flatId] = { ...r };
    });
    if (!firebaseEnabled) {
      for (const [flatId, patch] of Object.entries(localStaticOverrides)) {
        if (!STATIC_FLAT_ID_SET.has(flatId)) continue;
        const base = rowsById[flatId] ?? { flatId };
        rowsById[flatId] = { ...base, ...patch, flatId };
      }
    }

    const staticEntries: AdminDiscographyEntry[] = STATIC_DISCOGRAPHY_FLAT.map((item) => {
      const row = rowsById[item.flatId];
      return {
        item: mergeStaticItem(item, row),
        hidden: Boolean(row?.hidden),
        excluded: Boolean(row?.excluded),
        isCustom: false,
      };
    });

    const customEntries: AdminDiscographyEntry[] = discographyRows
      .filter((r) => !STATIC_FLAT_ID_SET.has(r.flatId))
      .map((row) => ({
        item: recordToFlatItem(row),
        hidden: Boolean(row.hidden),
        excluded: false,
        isCustom: true,
      }));

    const all = [...staticEntries, ...customEntries];
    all.sort((a, b) => {
      if (a.excluded !== b.excluded) return a.excluded ? 1 : -1;
      if (a.hidden !== b.hidden) return a.hidden ? 1 : -1;
      const ya = Number.parseInt(a.item.year, 10) || 0;
      const yb = Number.parseInt(b.item.year, 10) || 0;
      if (ya !== yb) return ya - yb;
      return a.item.title.localeCompare(b.item.title, "pt");
    });
    return all;
  }, [discographyRows, firebaseEnabled, localStaticOverrides]);

  const shelfItems = useMemo(
    () =>
      adminPanelItems
        .filter((e) => {
          if (e.excluded) return false;
          if (e.hidden) return false;
          if (e.isCustom && !e.item.title.trim()) return false;
          return true;
        })
        .map((e) => e.item),
    [adminPanelItems],
  );

  const setCoverOverride = useCallback(
    (flatId: string, url: string | null) => {
      const trimmed = url?.trim() ?? "";
      if (!firebaseEnabled && isPanelCustomFlatId(flatId)) {
        setLocalCustomRows((prev) => {
          const next = prev.map((r) =>
            r.flatId === flatId ? { ...r, coverUrl: trimmed || undefined } : r,
          );
          persistLocalCustomDiscography(next);
          return next;
        });
        clearSpotifyResolveCache();
        return;
      }
      void saveDiscographyRecord({ flatId, coverUrl: trimmed || undefined });
      clearSpotifyResolveCache();
    },
    [firebaseEnabled],
  );

  const setMetaOverride = useCallback(
    (flatId: string, patch: DiscographyMetaOverride) => {
      if (!firebaseEnabled && isPanelCustomFlatId(flatId)) {
        setLocalCustomRows((prev) => {
          const next = prev.map((r) => (r.flatId === flatId ? { ...r, ...patch } : r));
          persistLocalCustomDiscography(next);
          return next;
        });
        clearSpotifyResolveCache();
        return;
      }
      void saveDiscographyRecord({ flatId, ...patch });
      clearSpotifyResolveCache();
    },
    [firebaseEnabled],
  );

  const setDiscographyHidden = useCallback(
    (flatId: string, hidden: boolean) => {
      if (!firebaseEnabled && isPanelCustomFlatId(flatId)) {
        setLocalCustomRows((prev) => {
          const next = prev.map((r) => (r.flatId === flatId ? { ...r, hidden } : r));
          persistLocalCustomDiscography(next);
          return next;
        });
        return;
      }
      if (!firebaseEnabled && STATIC_FLAT_ID_SET.has(flatId)) {
        setLocalStaticOverrides((prev) => {
          const next = { ...prev, [flatId]: { ...prev[flatId], flatId, hidden } };
          persistLocalStaticOverrides(next);
          return next;
        });
        return;
      }
      void saveDiscographyRecord({ flatId, hidden });
    },
    [firebaseEnabled],
  );

  const setCatalogExcludedFromPanel = useCallback(
    (flatId: string, excluded: boolean) => {
      if (!STATIC_FLAT_ID_SET.has(flatId)) return;
      if (!firebaseEnabled) {
        setLocalStaticOverrides((prev) => {
          const next = { ...prev, [flatId]: { ...prev[flatId], flatId, excluded } };
          persistLocalStaticOverrides(next);
          return next;
        });
        clearSpotifyResolveCache();
        return;
      }
      void saveDiscographyRecord({ flatId, excluded });
      clearSpotifyResolveCache();
    },
    [firebaseEnabled],
  );

  const addCustomDiscographyRelease = useCallback(() => {
    const flatId = `${CUSTOM_DISCOGRAPHY_FLAT_ID_PREFIX}${crypto.randomUUID()}`;
    const record: DiscographyRecord = {
      flatId,
      year: "",
      title: "",
      format: "",
      project: "",
      role: "",
      spotifyUrl: null,
      spotifyFound: false,
      listenUrl: null,
      hidden: false,
    };
    if (firebaseEnabled) {
      void saveDiscographyRecord(record);
      return;
    }
    setLocalCustomRows((prev) => {
      const next = [...prev, record];
      persistLocalCustomDiscography(next);
      return next;
    });
  }, [firebaseEnabled]);

  const removeCustomDiscographyRelease = useCallback(
    (flatId: string) => {
      if (!flatId.startsWith(CUSTOM_DISCOGRAPHY_FLAT_ID_PREFIX)) return;
      if (firebaseEnabled) {
        void deleteDiscographyRecord(flatId);
      } else {
        setLocalCustomRows((prev) => {
          const next = prev.filter((r) => r.flatId !== flatId);
          persistLocalCustomDiscography(next);
          return next;
        });
      }
      clearSpotifyResolveCache();
    },
    [firebaseEnabled],
  );

  const value = useMemo(
    () => ({
      adminPanelItems,
      shelfItems,
      setCoverOverride,
      setMetaOverride,
      setDiscographyHidden,
      addCustomDiscographyRelease,
      removeCustomDiscographyRelease,
      setCatalogExcludedFromPanel,
      maxFileBytes: MAX_FILE_BYTES,
    }),
    [
      adminPanelItems,
      shelfItems,
      setCoverOverride,
      setMetaOverride,
      setDiscographyHidden,
      addCustomDiscographyRelease,
      removeCustomDiscographyRelease,
      setCatalogExcludedFromPanel,
    ],
  );

  return (
    <DiscographyCoversContext.Provider value={value}>{children}</DiscographyCoversContext.Provider>
  );
}

export function useDiscographyCovers(): DiscographyCoversContextValue {
  const ctx = useContext(DiscographyCoversContext);
  if (!ctx) {
    throw new Error("useDiscographyCovers must be used within DiscographyCoversProvider");
  }
  return ctx;
}
