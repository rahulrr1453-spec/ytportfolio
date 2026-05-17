export const CINE_FRAME_COUNT = 167;

export const cineFramePath = (n: number) =>
  `/frames2/frame_${String(n).padStart(4, "0")}.jpg`;

export type Beat = {
  id: string;
  show: number;
  hide: number;
  label: string;
  quote: string;
  speaker: string;
  film: string;
};

export const BEATS: Beat[] = [
  {
    id: "b1",
    show: 0.12,
    hide: 0.32,
    label: "01 — Color Grading",
    quote: "Eyes that see the infinite spectrum. Pure cyan brilliance.",
    speaker: "TYzEN",
    film: "POST-PRODUCTION",
  },
  {
    id: "b2",
    show: 0.38,
    hide: 0.58,
    label: "02 — Motion Graphics",
    quote: "Manipulating space between frames to create infinite motion.",
    speaker: "TYzEN",
    film: "VISUAL EFFECTS",
  },
  {
    id: "b3",
    show: 0.64,
    hide: 0.84,
    label: "03 — Final Render",
    quote: "The expansion of the void is complete. Witness the edit.",
    speaker: "TYzEN",
    film: "EXPORT SETTINGS",
  },
];

export const CINE_INTRO_FADE_END = 0.1;
