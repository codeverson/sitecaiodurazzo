import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { EXAMPLE_SHOWS } from "../data/exampleShows";
import type { Show } from "../types/show";

export const SHOWS_STORAGE_KEY = "caio_durazzo_shows";

function readShows(): Show[] {
  try {
    const raw = localStorage.getItem(SHOWS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const o = row as Record<string, unknown>;
        const id = typeof o.id === "number" ? o.id : Number(o.id);
        if (!Number.isFinite(id)) return null;
        return {
          id,
          date: String(o.date ?? ""),
          time: String(o.time ?? ""),
          venue: String(o.venue ?? ""),
          city: String(o.city ?? ""),
          state: String(o.state ?? ""),
          address: String(o.address ?? ""),
          price: String(o.price ?? ""),
          link: String(o.link ?? ""),
          notes: String(o.notes ?? ""),
        } satisfies Show;
      })
      .filter((x): x is Show => x !== null);
  } catch {
    return [];
  }
}

function writeShows(shows: Show[]) {
  try {
    localStorage.setItem(SHOWS_STORAGE_KEY, JSON.stringify(shows));
  } catch {
    /* ignore quota / private mode */
  }
}

function loadShowsForClient(): Show[] {
  const existing = readShows();
  if (existing.length > 0) return existing;
  const seed = EXAMPLE_SHOWS.map((s) => ({ ...s }));
  writeShows(seed);
  return seed;
}

type ShowsContextValue = {
  shows: Show[];
  getShows: () => Show[];
  addShow: (show: Omit<Show, "id"> & { id?: number }) => void;
  deleteShow: (id: number) => void;
};

const ShowsContext = createContext<ShowsContextValue | null>(null);

export function ShowsProvider({ children }: { children: ReactNode }) {
  const [shows, setShows] = useState<Show[]>(() =>
    typeof window !== "undefined" ? loadShowsForClient() : [],
  );

  const addShow = useCallback((show: Omit<Show, "id"> & { id?: number }) => {
    const full: Show = {
      ...show,
      id: show.id ?? Date.now(),
    };
    setShows((prev) => {
      const next = [...prev, full];
      writeShows(next);
      return next;
    });
  }, []);

  const deleteShow = useCallback((id: number) => {
    setShows((prev) => {
      const next = prev.filter((s) => s.id !== id);
      writeShows(next);
      return next;
    });
  }, []);

  const getShows = useCallback(() => shows, [shows]);

  const value = useMemo(
    () => ({ shows, getShows, addShow, deleteShow }),
    [shows, getShows, addShow, deleteShow],
  );

  return (
    <ShowsContext.Provider value={value}>{children}</ShowsContext.Provider>
  );
}

export function useShows() {
  const ctx = useContext(ShowsContext);
  if (!ctx) {
    throw new Error("useShows must be used within ShowsProvider");
  }
  return ctx;
}
