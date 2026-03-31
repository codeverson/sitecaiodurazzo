let sharedAudioContext: AudioContext | null = null;
let guitarPlayerPromise: Promise<{ player: WebAudioFontPlayerLike; preset: unknown } | null> | null = null;

type WebAudioFontPlayerLike = {
  loader: {
    decodeAfterLoading: (context: AudioContext, variableName: string) => void;
    waitLoad: (callback: () => void) => void;
  };
  queueWaveTable: (
    context: AudioContext,
    target: AudioNode,
    preset: unknown,
    when: number,
    pitch: number,
    duration: number,
    volume: number,
  ) => void;
};

declare global {
  interface Window {
    WebAudioFontPlayer?: new () => WebAudioFontPlayerLike;
    _tone_0252_Acoustic_Guitar_sf2_file?: unknown;
  }
}

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return null;
  if (!sharedAudioContext) sharedAudioContext = new AudioContextCtor();
  return sharedAudioContext;
}

export function midiToFrequency(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Document not available"));
      return;
    }

    const existing = document.querySelector(`script[data-audio-src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.audioSrc = src;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

async function getGuitarSoundfont(context: AudioContext) {
  if (guitarPlayerPromise) return guitarPlayerPromise;

  guitarPlayerPromise = (async () => {
    try {
      await loadScript("https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js");
      await loadScript("https://surikov.github.io/webaudiofontdata/sound/0252_Acoustic_Guitar_sf2_file.js");

      if (!window.WebAudioFontPlayer || !window._tone_0252_Acoustic_Guitar_sf2_file) return null;

      const player = new window.WebAudioFontPlayer();
      player.loader.decodeAfterLoading(context, "_tone_0252_Acoustic_Guitar_sf2_file");

      await new Promise<void>((resolve) => {
        player.loader.waitLoad(() => resolve());
      });

      return {
        player,
        preset: window._tone_0252_Acoustic_Guitar_sf2_file,
      };
    } catch {
      return null;
    }
  })();

  return guitarPlayerPromise;
}

function playFallbackPluck(context: AudioContext, midi: number) {
  const now = context.currentTime;
  const frequency = midiToFrequency(midi);
  const osc = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(frequency, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(Math.min(3200, frequency * 5), now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  osc.start(now);
  osc.stop(now + 0.85);
}

export async function playGuitarNote(midi: number, stringIdx: number, muted: boolean) {
  if (muted) return;
  const context = getAudioContext();
  if (!context) return;
  if (context.state === "suspended") await context.resume();

  const now = context.currentTime;
  const instrument = await getGuitarSoundfont(context);

  if (instrument) {
    const targetGain = context.createGain();
    targetGain.gain.setValueAtTime(0.26, now);
    targetGain.connect(context.destination);
    instrument.player.queueWaveTable(
      context,
      targetGain,
      instrument.preset,
      now,
      midi,
      1.8,
      Math.max(0.12, 0.22 - stringIdx * 0.01),
    );
    window.setTimeout(() => {
      try {
        targetGain.disconnect();
      } catch {
        // noop
      }
    }, 2200);
    return;
  }

  playFallbackPluck(context, midi);
}
