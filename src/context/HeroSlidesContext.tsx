import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { heroSlideshowSlides, type HeroSlide } from "../data/heroSlideshow";

export const HERO_SLIDES_STORAGE_KEY = "caio_durazzo_hero_slides";

const MAX_FILE_BYTES = 2.4 * 1024 * 1024;

type HeroSlideOverride = Pick<HeroSlide, "id" | "src" | "objectPosition" | "label"> & {
  defaultSrc: string;
};

function readSlides(): HeroSlideOverride[] | null {
  try {
    const raw = localStorage.getItem(HERO_SLIDES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const slides: HeroSlideOverride[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object" || Array.isArray(item)) continue;
      const entry = item as Record<string, unknown>;
      if (
        typeof entry.id === "string" &&
        typeof entry.src === "string" &&
        typeof entry.defaultSrc === "string" &&
        typeof entry.objectPosition === "string" &&
        typeof entry.label === "string"
      ) {
        slides.push({
          id: entry.id,
          src: entry.src,
          defaultSrc: entry.defaultSrc,
          objectPosition: entry.objectPosition,
          label: entry.label,
        });
      }
    }
    return slides.length ? slides : null;
  } catch {
    return null;
  }
}

function writeSlides(slides: HeroSlideOverride[]) {
  try {
    localStorage.setItem(HERO_SLIDES_STORAGE_KEY, JSON.stringify(slides));
  } catch {
    /* quota / private mode */
  }
}

type HeroSlidesContextValue = {
  slides: HeroSlide[];
  setSlide: (id: string, patch: Partial<Pick<HeroSlide, "src" | "objectPosition" | "label">>) => void;
  moveSlide: (id: string, delta: -1 | 1) => void;
  addSlide: () => void;
  removeSlide: (id: string) => void;
  resetSlideImage: (id: string) => void;
  maxFileBytes: number;
};

const HeroSlidesContext = createContext<HeroSlidesContextValue | null>(null);

function buildDefaultOverrides(): HeroSlideOverride[] {
  return heroSlideshowSlides.map((slide) => ({
    id: slide.id,
    src: slide.src,
    defaultSrc: slide.src,
    objectPosition: slide.objectPosition,
    label: slide.label,
  }));
}

export function HeroSlidesProvider({ children }: { children: ReactNode }) {
  const [slideOverrides, setSlideOverrides] = useState<HeroSlideOverride[]>(() => {
    if (typeof window === "undefined") return buildDefaultOverrides();
    const stored = readSlides();
    return stored ?? buildDefaultOverrides();
  });

  const setSlide = useCallback((id: string, patch: Partial<Pick<HeroSlide, "src" | "objectPosition" | "label">>) => {
    setSlideOverrides((prev) => {
      const next = prev.map((slide) =>
        slide.id === id
          ? {
              ...slide,
              ...patch,
            }
          : slide,
      );
      writeSlides(next);
      return next;
    });
  }, []);

  const moveSlide = useCallback((id: string, delta: -1 | 1) => {
    setSlideOverrides((prev) => {
      const index = prev.findIndex((slide) => slide.id === id);
      if (index < 0) return prev;
      const nextIndex = index + delta;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      writeSlides(next);
      return next;
    });
  }, []);

  const addSlide = useCallback(() => {
    setSlideOverrides((prev) => {
      const next = [
        ...prev,
        {
          id: `hero-custom-${Date.now()}`,
          src: heroSlideshowSlides[0]?.src ?? "",
          defaultSrc: heroSlideshowSlides[0]?.src ?? "",
          objectPosition: "50% 50%",
          label: "Novo slide",
        },
      ];
      writeSlides(next);
      return next;
    });
  }, []);

  const removeSlide = useCallback((id: string) => {
    setSlideOverrides((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((slide) => slide.id !== id);
      writeSlides(next);
      return next;
    });
  }, []);

  const resetSlideImage = useCallback((id: string) => {
    setSlideOverrides((prev) => {
      const next = prev.map((slide) =>
        slide.id === id
          ? {
              ...slide,
              src: slide.defaultSrc,
            }
          : slide,
      );
      writeSlides(next);
      return next;
    });
  }, []);

  const slides = useMemo(
    () =>
      slideOverrides.map((slide) => ({
        id: slide.id,
        src: slide.src,
        objectPosition: slide.objectPosition,
        label: slide.label,
      })),
    [slideOverrides],
  );

  const value = useMemo(
    () => ({
      slides,
      setSlide,
      moveSlide,
      addSlide,
      removeSlide,
      resetSlideImage,
      maxFileBytes: MAX_FILE_BYTES,
    }),
    [addSlide, moveSlide, removeSlide, resetSlideImage, setSlide, slides],
  );

  return <HeroSlidesContext.Provider value={value}>{children}</HeroSlidesContext.Provider>;
}

export function useHeroSlides(): HeroSlidesContextValue {
  const ctx = useContext(HeroSlidesContext);
  if (!ctx) throw new Error("useHeroSlides must be used within HeroSlidesProvider");
  return ctx;
}
