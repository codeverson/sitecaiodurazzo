import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { discographyData, flattenDiscography, type DiscographyFlatItem } from "../data/discographyData";
import { clearSpotifyResolveCache } from "../lib/resolveSpotifyAlbumData";

export const DISCOGRAPHY_COVERS_STORAGE_KEY = "caio_durazzo_discography_covers";
export const DISCOGRAPHY_META_STORAGE_KEY = "caio_durazzo_discography_meta";

const MAX_FILE_BYTES = 1.8 * 1024 * 1024;

function readCovers(): Record<string, string> {
  try {
    const raw = localStorage.getItem(DISCOGRAPHY_COVERS_STORAGE_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as unknown;
    if (!p || typeof p !== "object" || Array.isArray(p)) return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(p)) {
      if (typeof k === "string" && typeof v === "string" && v.trim().length > 0) {
        out[k] = v.trim();
      }
    }
    return out;
  } catch {
    return {};
  }
}

function writeCovers(map: Record<string, string>) {
  try {
    localStorage.setItem(DISCOGRAPHY_COVERS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* quota / private mode */
  }
}

type DiscographyMetaOverride = Partial<
  Pick<DiscographyFlatItem, "year" | "title" | "format" | "project" | "role">
>;

function readMeta(): Record<string, DiscographyMetaOverride> {
  try {
    const raw = localStorage.getItem(DISCOGRAPHY_META_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    const out: Record<string, DiscographyMetaOverride> = {};
    for (const [flatId, value] of Object.entries(parsed)) {
      if (typeof flatId !== "string" || !value || typeof value !== "object" || Array.isArray(value)) continue;
      const entry = value as Record<string, unknown>;
      const next: DiscographyMetaOverride = {};
      if (typeof entry.year === "string") next.year = entry.year;
      if (typeof entry.title === "string") next.title = entry.title;
      if (typeof entry.format === "string") next.format = entry.format;
      if (typeof entry.project === "string") next.project = entry.project;
      if (typeof entry.role === "string") next.role = entry.role;
      out[flatId] = next;
    }
    return out;
  } catch {
    return {};
  }
}

function writeMeta(map: Record<string, DiscographyMetaOverride>) {
  try {
    localStorage.setItem(DISCOGRAPHY_META_STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* quota / private mode */
  }
}

type DiscographyCoversContextValue = {
  /** Mapa flatId → URL (https ou data URL) salvo no admin. */
  coverOverrides: Record<string, string>;
  metaOverrides: Record<string, DiscographyMetaOverride>;
  /** Lista plana já mesclada para o carrossel. */
  shelfItems: DiscographyFlatItem[];
  setCoverOverride: (flatId: string, url: string | null) => void;
  setMetaOverride: (flatId: string, patch: DiscographyMetaOverride) => void;
  maxFileBytes: number;
};

const DiscographyCoversContext = createContext<DiscographyCoversContextValue | null>(null);

export function DiscographyCoversProvider({ children }: { children: ReactNode }) {
  const [coverOverrides, setCoverOverrides] = useState<Record<string, string>>(() =>
    typeof window !== "undefined" ? readCovers() : {},
  );
  const [metaOverrides, setMetaOverrides] = useState<Record<string, DiscographyMetaOverride>>(() =>
    typeof window !== "undefined" ? readMeta() : {},
  );

  const setCoverOverride = useCallback((flatId: string, url: string | null) => {
    setCoverOverrides((prev) => {
      const next = { ...prev };
      const trimmed = url?.trim() ?? "";
      if (!trimmed) {
        delete next[flatId];
      } else {
        next[flatId] = trimmed;
      }
      writeCovers(next);
      clearSpotifyResolveCache();
      return next;
    });
  }, []);

  const setMetaOverride = useCallback((flatId: string, patch: DiscographyMetaOverride) => {
    setMetaOverrides((prev) => {
      const base = prev[flatId] ?? {};
      const merged: DiscographyMetaOverride = {
        ...base,
        ...patch,
      };
      const next = { ...prev, [flatId]: merged };
      writeMeta(next);
      return next;
    });
  }, []);

  const shelfItems = useMemo((): DiscographyFlatItem[] => {
    const base = flattenDiscography(discographyData);
    return base.map((item) => ({
      ...item,
      year: metaOverrides[item.flatId]?.year ?? item.year,
      title: metaOverrides[item.flatId]?.title ?? item.title,
      format: metaOverrides[item.flatId]?.format ?? item.format,
      project: metaOverrides[item.flatId]?.project ?? item.project,
      role: metaOverrides[item.flatId]?.role ?? item.role,
      coverUrlOverride: coverOverrides[item.flatId] ?? item.coverUrlOverride,
    }));
  }, [coverOverrides, metaOverrides]);

  const value = useMemo(
    () => ({
      coverOverrides,
      metaOverrides,
      shelfItems,
      setCoverOverride,
      setMetaOverride,
      maxFileBytes: MAX_FILE_BYTES,
    }),
    [coverOverrides, metaOverrides, shelfItems, setCoverOverride, setMetaOverride],
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
