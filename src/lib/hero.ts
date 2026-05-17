export const FRAME_COUNT = 167;

export const framePath = (n: number) =>
  `/frames/frame_${String(n).padStart(4, "0")}.jpg`;

export type Dialogue = {
  id: string;
  show: number;
  hide: number;
  quote: string;
  speaker: string;
  film: string;
};

export const DIALOGUES: Dialogue[] = [
  {
    id: "d1",
    show: 0.12,
    hide: 0.32,
    quote: "Cuts that transcend space-time. This is the ultimate technique.",
    speaker: "TYzEN",
    film: "EDITING PHILOSOPHY",
  },
  {
    id: "d2",
    show: 0.38,
    hide: 0.58,
    quote: "Every frame is a domain. Every second is an expansion.",
    speaker: "TYzEN",
    film: "VISUAL STORYTELLING",
  },
  {
    id: "d3",
    show: 0.64,
    hide: 0.84,
    quote: "Throughout the timeline, I alone am the honored editor.",
    speaker: "TYzEN",
    film: "DOMAIN OF MOTION",
  },
];

export const HERO_TEXT_FADE_END = 0.1;
