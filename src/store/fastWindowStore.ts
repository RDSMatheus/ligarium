import type { FastTimingWindow } from "@/data/cardDatabase";
import { create } from "zustand";

interface FastWindowStore {
  activeTrigger: FastTimingWindow | null;
  setActiveTrigger: (trigger: FastTimingWindow | null) => void;
}

export const useFastWindowStore = create<FastWindowStore>((set) => ({
  activeTrigger: null,
  setActiveTrigger: (trigger) => set({ activeTrigger: trigger }),
}));
