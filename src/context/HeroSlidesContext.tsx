import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { heroSlideshowSlides, type HeroSlide } from "../data/heroSlideshow";
import { saveHeroSlides, subscribeHero } from "../lib/firestore/siteContent";
import type { HeroSlideRecord } from "../types/firebaseContent";

const MAX_FILE_BYTES = 2.4 * 1024 * 1024;

type HeroSlideOverride = Pick<HeroSlide, "id" | "src" | "objectPosition" | "label"> & {
  defaultSrc: string;
};

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
  const [slideOverrides, setSlideOverrides] = useState<HeroSlideOverride[]>(buildDefaultOverrides);

  useEffect(() => subscribeHero((slides) => {
    const defaults = buildDefaultOverrides();
    const defaultById = new Map(defaults.map((slide) => [slide.id, slide.defaultSrc]));
    const normalized = slides.map((slide) => ({
      id: slide.id,
      src: slide.src,
      objectPosition: slide.objectPosition,
      label: slide.label,
      defaultSrc: defaultById.get(slide.id) ?? slide.src,
    }));
    setSlideOverrides(normalized.length ? normalized : defaults);
  }), []);

  const persist = useCallback(async (next: HeroSlideOverride[]) => {
    const payload: HeroSlideRecord[] = next.map((slide, index) => ({
      id: slide.id,
      src: slide.src,
      objectPosition: slide.objectPosition,
      label: slide.label,
      sortOrder: index,
    }));
    await saveHeroSlides(payload);
  }, []);

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
      void persist(next);
      return next;
    });
  }, [persist]);

  const moveSlide = useCallback((id: string, delta: -1 | 1) => {
    setSlideOverrides((prev) => {
      const index = prev.findIndex((slide) => slide.id === id);
      if (index < 0) return prev;
      const nextIndex = index + delta;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(nextIndex, 0, moved);
      void persist(next);
      return next;
    });
  }, [persist]);

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
      void persist(next);
      return next;
    });
  }, [persist]);

  const removeSlide = useCallback((id: string) => {
    setSlideOverrides((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((slide) => slide.id !== id);
      void persist(next);
      return next;
    });
  }, [persist]);

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
      void persist(next);
      return next;
    });
  }, [persist]);

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
