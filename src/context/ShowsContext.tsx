import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { EXAMPLE_SHOWS } from "../data/exampleShows";
import { removeShowById, saveShow, subscribeShows } from "../lib/firestore/siteContent";
import type { Show } from "../types/show";

type ShowsContextValue = {
  shows: Show[];
  getShows: () => Show[];
  addShow: (show: Omit<Show, "id"> & { id?: number }) => void;
  deleteShow: (id: number) => void;
};

const ShowsContext = createContext<ShowsContextValue | null>(null);

export function ShowsProvider({ children }: { children: ReactNode }) {
  const [shows, setShows] = useState<Show[]>(() => EXAMPLE_SHOWS.map((show) => ({ ...show })));

  useEffect(() => subscribeShows(setShows), []);

  const addShow = useCallback((show: Omit<Show, "id"> & { id?: number }) => {
    const full: Show = {
      ...show,
      id: show.id ?? Date.now(),
    };
    setShows((prev) => {
      const next = [...prev, full];
      void saveShow(full);
      return next;
    });
  }, []);

  const deleteShow = useCallback((id: number) => {
    setShows((prev) => {
      const next = prev.filter((s) => s.id !== id);
      void removeShowById(id);
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
