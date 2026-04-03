import type { CardInstance } from "@/types";
import { create } from "zustand";

interface InfoCardStore {
  card: CardInstance | null;
  setCard: (card: CardInstance) => void;
}

export const useCardInfoStore = create<InfoCardStore>((set) => ({
  card: null,
  setCard: (card) => set({ card }),
}));
