import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  writeBatch,
  type FirestoreDataConverter,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { discographyData, flattenDiscography } from "../../data/discographyData";
import { heroSlideshowSlides } from "../../data/heroSlideshow";
import { heroCopy } from "../../data/siteCopy";
import { EXAMPLE_SHOWS } from "../../data/exampleShows";
import { DEFAULT_YOUTUBE_VIDEOS } from "../../data/defaultYoutubeVideos";
import type {
  DiscographyRecord,
  HeroContentDocument,
  HeroSlideRecord,
  SiteSeedPayload,
  SiteSettingsDocument,
} from "../../types/firebaseContent";
import type { Show } from "../../types/show";
import type { YoutubeVideoItem } from "../../types/youtubeVideo";

function parseHeroTaglinesFromFirestore(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const lines = raw
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.trim())
    .filter(Boolean);
  return lines.length ? lines : undefined;
}

const LOCAL_HERO_TAGLINES_KEY = "caio-durazzo-hero-taglines-v1";

function loadLocalHeroTaglines(): string[] | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const stored = window.localStorage.getItem(LOCAL_HERO_TAGLINES_KEY);
    if (!stored) return undefined;
    const parsed: unknown = JSON.parse(stored);
    return parseHeroTaglinesFromFirestore(parsed);
  } catch {
    return undefined;
  }
}

const heroConverter: FirestoreDataConverter<HeroContentDocument> = {
  toFirestore(value) {
    return value;
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    const slides = Array.isArray(data.slides) ? data.slides : [];
    return {
      slides: slides
        .map((slide, index) => {
          if (!slide || typeof slide !== "object") return null;
          const record = slide as Record<string, unknown>;
          if (typeof record.id !== "string" || typeof record.src !== "string") return null;
          return {
            id: record.id,
            src: record.src,
            label: typeof record.label === "string" ? record.label : "",
            objectPosition: typeof record.objectPosition === "string" ? record.objectPosition : "50% 50%",
            sortOrder: typeof record.sortOrder === "number" ? record.sortOrder : index,
          } satisfies HeroSlideRecord;
        })
        .filter((slide): slide is HeroSlideRecord => slide !== null)
        .sort((a, b) => a.sortOrder - b.sortOrder),
      heroTaglines: parseHeroTaglinesFromFirestore(data.heroTaglines),
    };
  },
};

const showConverter: FirestoreDataConverter<Show> = {
  toFirestore(value) {
    return value;
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      id: Number(data.id ?? snapshot.id),
      date: String(data.date ?? ""),
      time: String(data.time ?? ""),
      venue: String(data.venue ?? ""),
      city: String(data.city ?? ""),
      state: String(data.state ?? ""),
      address: String(data.address ?? ""),
      price: String(data.price ?? ""),
      link: String(data.link ?? ""),
      notes: String(data.notes ?? ""),
    };
  },
};

const youtubeConverter: FirestoreDataConverter<YoutubeVideoItem> = {
  toFirestore(value) {
    return value;
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      id: Number(data.id ?? snapshot.id),
      title: String(data.title ?? ""),
      url: String(data.url ?? ""),
      label: String(data.label ?? ""),
      thumbnailUrl: String(data.thumbnailUrl ?? ""),
      isFeatured: Boolean(data.isFeatured),
      order: Number(data.order ?? 0),
      isActive: data.isActive !== false,
    };
  },
};

const discographyConverter: FirestoreDataConverter<DiscographyRecord> = {
  toFirestore(value) {
    return value;
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      flatId: snapshot.id,
      year: typeof data.year === "string" ? data.year : undefined,
      title: typeof data.title === "string" ? data.title : undefined,
      format: typeof data.format === "string" ? data.format : undefined,
      project: typeof data.project === "string" ? data.project : undefined,
      role: typeof data.role === "string" ? data.role : undefined,
      coverUrl: typeof data.coverUrl === "string" ? data.coverUrl : undefined,
      hidden: typeof data.hidden === "boolean" ? data.hidden : undefined,
      excluded: typeof data.excluded === "boolean" ? data.excluded : undefined,
      spotifyUrl: data.spotifyUrl === null ? null : typeof data.spotifyUrl === "string" ? data.spotifyUrl : undefined,
      spotifyFound: typeof data.spotifyFound === "boolean" ? data.spotifyFound : undefined,
      listenUrl: typeof data.listenUrl === "string" ? data.listenUrl : data.listenUrl === null ? null : undefined,
    };
  },
};

const settingsConverter: FirestoreDataConverter<SiteSettingsDocument> = {
  toFirestore(value) {
    return value;
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      maintenanceMode: Boolean(data.maintenanceMode),
    };
  },
};

export const heroDocRef = doc(db, "siteContent", "hero").withConverter(heroConverter);
export const settingsDocRef = doc(db, "siteContent", "settings").withConverter(settingsConverter);
export const showsCollectionRef = collection(db, "shows").withConverter(showConverter);
export const youtubeCollectionRef = collection(db, "youtubeVideos").withConverter(youtubeConverter);
export const discographyCollectionRef = collection(db, "discography").withConverter(discographyConverter);

export function buildSeedPayload(): SiteSeedPayload {
  return {
    hero: heroSlideshowSlides.map((slide, index) => ({
      ...slide,
      sortOrder: index,
    })),
    shows: EXAMPLE_SHOWS.map((show) => ({ ...show })),
    youtubeVideos: DEFAULT_YOUTUBE_VIDEOS.map((video) => ({ ...video })),
    discography: flattenDiscography(discographyData).map((item) => ({
      flatId: item.flatId,
      year: item.year,
      title: item.title,
      format: item.format,
      project: item.project,
      role: item.role,
      coverUrl: item.coverUrlOverride,
    })),
    settings: {
      maintenanceMode: false,
    },
  };
}

export type HeroLiveSnapshot = {
  slides: HeroSlideRecord[];
  /** Vindo do Firestore ou do localStorage (dev); vazio/ausente usa siteCopy no cliente. */
  heroTaglines?: string[];
};

export function subscribeHero(
  callback: (snap: HeroLiveSnapshot) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!isFirebaseConfigured()) {
    const localLines = loadLocalHeroTaglines();
    callback({
      slides: buildSeedPayload().hero,
      heroTaglines: localLines,
    });
    return () => {};
  }
  return onSnapshot(
    heroDocRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback({
          slides: buildSeedPayload().hero,
          heroTaglines: [...heroCopy.heroTaglines],
        });
        return;
      }
      const docData = snapshot.data();
      callback({
        slides: docData.slides.length ? docData.slides : buildSeedPayload().hero,
        heroTaglines: docData.heroTaglines,
      });
    },
    (error) => onError?.(error),
  );
}

export function subscribeSiteSettings(
  callback: (settings: SiteSettingsDocument) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!isFirebaseConfigured()) {
    callback(buildSeedPayload().settings);
    return () => {};
  }
  return onSnapshot(
    settingsDocRef,
    (snapshot) => {
      callback(snapshot.exists() ? snapshot.data() : buildSeedPayload().settings);
    },
    (error) => onError?.(error),
  );
}

export function subscribeShows(callback: (shows: Show[]) => void, onError?: (error: Error) => void): () => void {
  if (!isFirebaseConfigured()) {
    callback(buildSeedPayload().shows);
    return () => {};
  }
  return onSnapshot(
    query(showsCollectionRef, orderBy("date", "asc")),
    (snapshot) => {
      const rows = snapshot.docs.map((docItem) => docItem.data());
      callback(rows.length ? rows : buildSeedPayload().shows);
    },
    (error) => onError?.(error),
  );
}

export function subscribeYoutubeVideos(
  callback: (videos: YoutubeVideoItem[]) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!isFirebaseConfigured()) {
    callback(buildSeedPayload().youtubeVideos);
    return () => {};
  }
  return onSnapshot(
    query(youtubeCollectionRef, orderBy("order", "asc")),
    (snapshot) => {
      const rows = snapshot.docs.map((docItem) => docItem.data());
      callback(rows.length ? rows : buildSeedPayload().youtubeVideos);
    },
    (error) => onError?.(error),
  );
}

export function subscribeDiscography(
  callback: (rows: DiscographyRecord[]) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!isFirebaseConfigured()) {
    callback(buildSeedPayload().discography);
    return () => {};
  }
  return onSnapshot(
    discographyCollectionRef,
    (snapshot) => {
      const rows = snapshot.docs.map((docItem) => docItem.data());
      callback(rows);
    },
    (error) => onError?.(error),
  );
}

export async function saveHeroSlides(slides: HeroSlideRecord[]): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await setDoc(heroDocRef, { slides }, { merge: true });
}

export async function saveHeroTaglines(heroTaglines: string[]): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await setDoc(heroDocRef, { heroTaglines }, { merge: true });
}

export { LOCAL_HERO_TAGLINES_KEY };

export async function saveSiteSettings(settings: SiteSettingsDocument): Promise<void> {
  await setDoc(settingsDocRef, settings, { merge: true });
}

export async function saveShow(show: Show): Promise<void> {
  await setDoc(doc(showsCollectionRef, String(show.id)), show);
}

export async function removeShowById(id: number): Promise<void> {
  await deleteDoc(doc(showsCollectionRef, String(id)));
}

export async function saveYoutubeVideo(video: YoutubeVideoItem): Promise<void> {
  await setDoc(doc(youtubeCollectionRef, String(video.id)), video);
}

export async function removeYoutubeVideo(id: number): Promise<void> {
  await deleteDoc(doc(youtubeCollectionRef, String(id)));
}

export async function saveDiscographyRecord(record: DiscographyRecord): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await setDoc(doc(discographyCollectionRef, record.flatId), record, { merge: true });
}

export async function deleteDiscographyRecord(flatId: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await deleteDoc(doc(discographyCollectionRef, flatId));
}

export async function seedFirestoreIfEmpty(): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;
  const [heroSnap, showsSnap] = await Promise.all([
    getDocs(query(collection(db, "siteContent"), limit(1))),
    getDocs(query(collection(db, "shows"), limit(1))),
  ]);
  if (!heroSnap.empty || !showsSnap.empty) return false;

  const seed = buildSeedPayload();
  const batch = writeBatch(db);
  batch.set(doc(db, "siteContent", "hero"), {
    slides: seed.hero,
    heroTaglines: [...heroCopy.heroTaglines],
  });
  batch.set(doc(db, "siteContent", "settings"), seed.settings);
  seed.shows.forEach((show) => batch.set(doc(db, "shows", String(show.id)), show));
  seed.youtubeVideos.forEach((video) => batch.set(doc(db, "youtubeVideos", String(video.id)), video));
  seed.discography.forEach((item) => batch.set(doc(db, "discography", item.flatId), item));
  await batch.commit();
  return true;
}
