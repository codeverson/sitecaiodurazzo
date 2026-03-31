export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

export const INTERVAL_LABELS = ["T", "b2", "2", "b3", "3", "4", "b5", "5", "b6", "6", "b7", "7"] as const;
export const INTERVAL_DESCRIPTORS = [
  "Tonica",
  "Segunda menor",
  "Segunda maior",
  "Terca menor",
  "Terca maior",
  "Quarta justa",
  "Tritono",
  "Quinta justa",
  "Sexta menor",
  "Sexta maior",
  "Setima menor",
  "Setima maior",
] as const;

export type NoteName = (typeof NOTES)[number];
export type IntervalLabel = (typeof INTERVAL_LABELS)[number];
export type IntervalDescriptor = (typeof INTERVAL_DESCRIPTORS)[number];
export type TheoryMode = "notes" | "scale" | "chord";
export type LabelMode = "notes" | "degrees";

export type TuningKey =
  | "standard"
  | "dropD"
  | "openG"
  | "openE"
  | "openD"
  | "dadgad"
  | "halfDown"
  | "fullDown"
  | "dropC"
  | "openA";

export type TuningDefinition = {
  notes: [number, number, number, number, number, number];
  octaves: [number, number, number, number, number, number];
  names: [string, string, string, string, string, string];
  label: string;
};

export const TUNINGS: Record<TuningKey, TuningDefinition> = {
  standard: {
    notes: [4, 11, 7, 2, 9, 4],
    octaves: [4, 3, 3, 3, 2, 2],
    names: ["e", "B", "G", "D", "A", "E"],
    label: "Standard",
  },
  dropD: {
    notes: [4, 11, 7, 2, 9, 2],
    octaves: [4, 3, 3, 3, 2, 2],
    names: ["e", "B", "G", "D", "A", "D"],
    label: "Drop D",
  },
  openG: {
    notes: [2, 11, 7, 2, 7, 2],
    octaves: [4, 3, 3, 3, 2, 2],
    names: ["D", "B", "G", "D", "G", "D"],
    label: "Open G",
  },
  openE: {
    notes: [4, 11, 8, 4, 11, 4],
    octaves: [4, 3, 3, 3, 2, 2],
    names: ["e", "B", "G#", "E", "B", "E"],
    label: "Open E",
  },
  openD: {
    notes: [2, 9, 6, 2, 9, 2],
    octaves: [4, 3, 3, 3, 2, 2],
    names: ["D", "A", "F#", "D", "A", "D"],
    label: "Open D",
  },
  dadgad: {
    notes: [2, 9, 7, 2, 9, 2],
    octaves: [4, 3, 3, 3, 2, 2],
    names: ["D", "A", "G", "D", "A", "D"],
    label: "DADGAD",
  },
  halfDown: {
    notes: [3, 10, 6, 1, 8, 3],
    octaves: [4, 3, 3, 3, 2, 2],
    names: ["d#", "A#", "F#", "C#", "G#", "D#"],
    label: "Meio Tom Abaixo",
  },
  fullDown: {
    notes: [2, 9, 5, 0, 7, 2],
    octaves: [4, 3, 3, 3, 2, 2],
    names: ["d", "A", "F", "C", "G", "D"],
    label: "Tom Abaixo",
  },
  dropC: {
    notes: [2, 9, 5, 0, 7, 0],
    octaves: [4, 3, 3, 3, 2, 2],
    names: ["d", "A", "F", "C", "G", "C"],
    label: "Drop C",
  },
  openA: {
    notes: [4, 8, 4, 9, 4, 4],
    octaves: [4, 3, 3, 3, 2, 2],
    names: ["E", "C#", "A", "E", "A", "E"],
    label: "Open A",
  },
};

export const SCALE_INTERVALS: Record<string, number[]> = {
  Maior: [0, 2, 4, 5, 7, 9, 11],
  "Menor Natural": [0, 2, 3, 5, 7, 8, 10],
  "Pentatônica Maior": [0, 2, 4, 7, 9],
  "Pentatônica Menor": [0, 3, 5, 7, 10],
  Blues: [0, 3, 5, 6, 7, 10],
  Dórico: [0, 2, 3, 5, 7, 9, 10],
  Mixolídio: [0, 2, 4, 5, 7, 9, 10],
  "Harmônica Menor": [0, 2, 3, 5, 7, 8, 11],
  Lídio: [0, 2, 4, 6, 7, 9, 11],
  Frígio: [0, 1, 3, 5, 7, 8, 10],
};

export const CHORD_INTERVALS: Record<string, number[]> = {
  Maior: [0, 4, 7],
  Menor: [0, 3, 7],
  Dom7: [0, 4, 7, 10],
  Maj7: [0, 4, 7, 11],
  Min7: [0, 3, 7, 10],
  Sus2: [0, 2, 7],
  Sus4: [0, 5, 7],
  Dim: [0, 3, 6],
  Aug: [0, 4, 8],
  "7#9": [0, 4, 7, 15],
  Add9: [0, 4, 7, 14],
  Min6: [0, 3, 7, 9],
};

export const FRET_DOTS: Record<number, number> = {
  3: 1,
  5: 1,
  7: 1,
  9: 1,
  12: 2,
  15: 1,
  17: 1,
  19: 1,
  21: 1,
  24: 2,
};

export function getStringLabel(tuning: TuningDefinition, stringIdx: number) {
  return `${tuning.names[stringIdx]} (${stringIdx + 1}ª)`;
}

export function getNoteAtFret(tuning: TuningDefinition, stringIdx: number, fret: number) {
  const openNote = tuning.notes[stringIdx];
  return (openNote + fret) % 12;
}

export function getOctaveAtFret(tuning: TuningDefinition, stringIdx: number, fret: number) {
  const openOctave = tuning.octaves[stringIdx];
  const openNote = tuning.notes[stringIdx];
  return openOctave + Math.floor((openNote + fret) / 12);
}

export function getIntervalFromRoot(note: number, root: number) {
  return (note - root + 12) % 12;
}

export function getIntervalLabel(interval: number): IntervalLabel {
  return INTERVAL_LABELS[interval] ?? "T";
}

export function getIntervalDescriptor(interval: number): IntervalDescriptor {
  return INTERVAL_DESCRIPTORS[interval] ?? "Tonica";
}

export function getDisplayLabel(note: number, root: number, labelMode: LabelMode) {
  return labelMode === "degrees" ? getIntervalLabel(getIntervalFromRoot(note, root)) : NOTES[note];
}

export function getActiveIntervals(mode: TheoryMode, currentType: string) {
  if (mode === "notes") return null;
  return (mode === "scale" ? SCALE_INTERVALS[currentType] : CHORD_INTERVALS[currentType]) ?? null;
}

export function isHighlighted(note: number, root: number, intervals: number[] | null) {
  if (!intervals) return true;
  return intervals.some((interval) => (root + interval) % 12 === note);
}

export function isRoot(note: number, root: number) {
  return note === root;
}

export type FretboardPoint = {
  stringIdx: number;
  fret: number;
  note: number;
  noteName: NoteName;
  interval: number;
  intervalLabel: IntervalLabel;
  intervalDescriptor: IntervalDescriptor;
  displayLabel: string;
  octave: number;
  stringLabel: string;
  highlighted: boolean;
  root: boolean;
};

export function buildFretboardPoints({
  tuning,
  fretCount,
  root,
  mode,
  currentType,
  labelMode,
}: {
  tuning: TuningDefinition;
  fretCount: number;
  root: number;
  mode: TheoryMode;
  currentType: string;
  labelMode: LabelMode;
}) {
  const intervals = getActiveIntervals(mode, currentType);
  const matrix: FretboardPoint[][] = [];

  for (let fret = 0; fret <= fretCount; fret += 1) {
    const column: FretboardPoint[] = [];
    for (let stringIdx = 0; stringIdx < 6; stringIdx += 1) {
      const note = getNoteAtFret(tuning, stringIdx, fret);
      const interval = getIntervalFromRoot(note, root);
      const point: FretboardPoint = {
        stringIdx,
        fret,
        note,
        noteName: NOTES[note],
        interval,
        intervalLabel: getIntervalLabel(interval),
        intervalDescriptor: getIntervalDescriptor(interval),
        displayLabel: getDisplayLabel(note, root, labelMode),
        octave: getOctaveAtFret(tuning, stringIdx, fret),
        stringLabel: getStringLabel(tuning, stringIdx),
        highlighted: isHighlighted(note, root, intervals),
        root: isRoot(note, root),
      };
      column.push(point);
    }
    matrix.push(column);
  }

  return matrix;
}

export type SelectedFretboardPoint = {
  note: string;
  string: string;
  fret: string;
  octave: string;
  degree: string;
  degreeName: string;
};

export function toSelectedPoint(point: FretboardPoint): SelectedFretboardPoint {
  return {
    note: point.noteName,
    string: point.stringLabel,
    fret: point.fret === 0 ? "0 (solta)" : String(point.fret),
    octave: String(point.octave),
    degree: point.intervalLabel,
    degreeName: point.intervalDescriptor,
  };
}
