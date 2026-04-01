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
import { saveDiscographyRecord, subscribeDiscography } from "../lib/firestore/siteContent";
import type { DiscographyRecord } from "../types/firebaseContent";

const MAX_FILE_BYTES = 1.8 * 1024 * 1024;

type DiscographyMetaOverride = Partial<
  Pick<DiscographyFlatItem, "year" | "title" | "format" | "project" | "role">
>;

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
  const [coverOverrides, setCoverOverrides] = useState<Record<string, string>>({});
  const [metaOverrides, setMetaOverrides] = useState<Record<string, DiscographyMetaOverride>>({});

  useEffect(
    () =>
      subscribeDiscography((rows) => {
        const nextCovers: Record<string, string> = {};
        const nextMeta: Record<string, DiscographyMetaOverride> = {};
        rows.forEach((row) => {
          if (row.coverUrl?.trim()) nextCovers[row.flatId] = row.coverUrl.trim();
          nextMeta[row.flatId] = {
            year: row.year,
            title: row.title,
            format: row.format,
            project: row.project,
            role: row.role,
          };
        });
        setCoverOverrides(nextCovers);
        setMetaOverrides(nextMeta);
      }),
    [],
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
      const record: DiscographyRecord = { flatId, coverUrl: trimmed || undefined };
      void saveDiscographyRecord(record);
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
      void saveDiscographyRecord({ flatId, ...merged });
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
