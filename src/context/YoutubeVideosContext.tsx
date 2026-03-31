import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_YOUTUBE_VIDEOS } from "../data/defaultYoutubeVideos";
import type { YoutubeVideoItem } from "../types/youtubeVideo";

export const YOUTUBE_VIDEOS_STORAGE_KEY = "caio_durazzo_youtube_videos";

function normalizeVideo(row: Record<string, unknown>, fallbackId: number): YoutubeVideoItem | null {
  const id = typeof row.id === "number" ? row.id : Number(row.id);
  const nid = Number.isFinite(id) ? id : fallbackId;
  return {
    id: nid,
    title: String(row.title ?? ""),
    url: String(row.url ?? ""),
    label: String(row.label ?? ""),
    thumbnailUrl: String(row.thumbnailUrl ?? ""),
    isFeatured: Boolean(row.isFeatured),
    order: typeof row.order === "number" ? row.order : Number(row.order) || 0,
    isActive: row.isActive !== false,
  };
}

function readVideos(): YoutubeVideoItem[] {
  try {
    const raw = localStorage.getItem(YOUTUBE_VIDEOS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((row, i) =>
        row && typeof row === "object"
          ? normalizeVideo(row as Record<string, unknown>, Date.now() + i)
          : null,
      )
      .filter((x): x is YoutubeVideoItem => x !== null);
  } catch {
    return [];
  }
}

function writeVideos(videos: YoutubeVideoItem[]) {
  try {
    localStorage.setItem(YOUTUBE_VIDEOS_STORAGE_KEY, JSON.stringify(videos));
  } catch {
    /* ignore */
  }
}

function ensureOneFeatured(list: YoutubeVideoItem[]): YoutubeVideoItem[] {
  const cleared = list.map((v) => ({ ...v, isFeatured: v.isActive && v.isFeatured }));
  const active = cleared.filter((v) => v.isActive);
  if (active.length === 0) return cleared.map((v) => ({ ...v, isFeatured: false }));
  const anyFeatured = active.some((v) => v.isFeatured);
  if (anyFeatured) {
    let seen = false;
    return cleared.map((v) => {
      if (!v.isActive || !v.isFeatured) return { ...v, isFeatured: false };
      if (seen) return { ...v, isFeatured: false };
      seen = true;
      return v;
    });
  }
  const byOrder = [...active].sort((a, b) => a.order - b.order);
  const firstId = byOrder[0]!.id;
  return cleared.map((v) => ({ ...v, isFeatured: v.id === firstId }));
}

function loadInitial(): YoutubeVideoItem[] {
  const existing = readVideos();
  if (existing.length > 0) {
    const sorted = [...existing].sort((a, b) => a.order - b.order);
    return ensureOneFeatured(sorted);
  }
  const seed = DEFAULT_YOUTUBE_VIDEOS.map((v) => ({ ...v }));
  writeVideos(seed);
  return seed;
}

type YoutubeVideosContextValue = {
  videos: YoutubeVideoItem[];
  setVideosRaw: (next: YoutubeVideoItem[]) => void;
  updateVideo: (id: number, patch: Partial<YoutubeVideoItem>) => void;
  addVideo: (v: Omit<YoutubeVideoItem, "id" | "order"> & { id?: number; order?: number }) => void;
  removeVideo: (id: number) => void;
  moveVideo: (id: number, direction: "up" | "down") => void;
  setFeatured: (id: number) => void;
  toggleActive: (id: number) => void;
};

const YoutubeVideosContext = createContext<YoutubeVideosContextValue | null>(null);

export function YoutubeVideosProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<YoutubeVideoItem[]>(() =>
    typeof window !== "undefined" ? loadInitial() : [],
  );

  const commit = useCallback((updater: (prev: YoutubeVideoItem[]) => YoutubeVideoItem[]) => {
    setVideos((prev) => {
      const next = ensureOneFeatured(updater(prev).sort((a, b) => a.order - b.order));
      writeVideos(next);
      return next;
    });
  }, []);

  const setVideosRaw = useCallback((next: YoutubeVideoItem[]) => {
    setVideos(() => {
      const sorted = [...next].sort((a, b) => a.order - b.order);
      const norm = ensureOneFeatured(sorted);
      writeVideos(norm);
      return norm;
    });
  }, []);

  const updateVideo = useCallback(
    (id: number, patch: Partial<YoutubeVideoItem>) => {
      commit((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
    },
    [commit],
  );

  const addVideo = useCallback(
    (v: Omit<YoutubeVideoItem, "id" | "order"> & { id?: number; order?: number }) => {
      commit((prev) => {
        const maxOrder = prev.reduce((m, x) => Math.max(m, x.order), -1);
        const nextId = v.id ?? Date.now();
        const next: YoutubeVideoItem = {
          id: nextId,
          title: v.title,
          url: v.url,
          label: v.label,
          thumbnailUrl: v.thumbnailUrl ?? "",
          isFeatured: v.isFeatured ?? false,
          order: v.order ?? maxOrder + 1,
          isActive: v.isActive !== false,
        };
        return [...prev, next];
      });
    },
    [commit],
  );

  const removeVideo = useCallback(
    (id: number) => {
      commit((prev) => prev.filter((v) => v.id !== id));
    },
    [commit],
  );

  const moveVideo = useCallback(
    (id: number, direction: "up" | "down") => {
      commit((prev) => {
        const sorted = [...prev].sort((a, b) => a.order - b.order);
        const idx = sorted.findIndex((v) => v.id === id);
        if (idx < 0) return prev;
        const j = direction === "up" ? idx - 1 : idx + 1;
        if (j < 0 || j >= sorted.length) return prev;
        const a = sorted[idx]!;
        const b = sorted[j]!;
        return prev.map((v) => {
          if (v.id === a.id) return { ...v, order: b.order };
          if (v.id === b.id) return { ...v, order: a.order };
          return v;
        });
      });
    },
    [commit],
  );

  const setFeatured = useCallback(
    (id: number) => {
      commit((prev) =>
        prev.map((v) => ({ ...v, isFeatured: v.id === id && v.isActive })),
      );
    },
    [commit],
  );

  const toggleActive = useCallback(
    (id: number) => {
      commit((prev) => {
        const next = prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v));
        const active = next.filter((v) => v.isActive);
        if (active.length && !active.some((v) => v.isFeatured)) {
          const first = [...active].sort((a, b) => a.order - b.order)[0]!;
          return next.map((v) => ({ ...v, isFeatured: v.id === first.id }));
        }
        return next;
      });
    },
    [commit],
  );

  const value = useMemo(
    () => ({
      videos,
      setVideosRaw,
      updateVideo,
      addVideo,
      removeVideo,
      moveVideo,
      setFeatured,
      toggleActive,
    }),
    [
      videos,
      setVideosRaw,
      updateVideo,
      addVideo,
      removeVideo,
      moveVideo,
      setFeatured,
      toggleActive,
    ],
  );

  return (
    <YoutubeVideosContext.Provider value={value}>{children}</YoutubeVideosContext.Provider>
  );
}

export function useYoutubeVideos() {
  const ctx = useContext(YoutubeVideosContext);
  if (!ctx) {
    throw new Error("useYoutubeVideos must be used within YoutubeVideosProvider");
  }
  return ctx;
}
