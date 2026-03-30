import type { CardInstance } from "@/types";
import { useState } from "react";
import { create } from "zustand";

interface PlayMonster {
  selectedHandCard: CardInstance | null;
  setSelectedHandCard: (card: CardInstance | null) => void;
  selectedFarmCard: CardInstance | null;
  setSelectedFarmCard: (card: CardInstance | null) => void;
  exhaustingIds: string[];
  setExhaustingIds: (ids: string[]) => void;
  toggleExhaustingId: (id: string) => void;
  resetExhaustingIds: () => void;
}

export const playMonsterStore = create<PlayMonster>((set) => ({
  selectedHandCard: null,
  setSelectedHandCard: (card) => set({ selectedHandCard: card }),
  selectedFarmCard: null,
  setSelectedFarmCard: (card) => set({ selectedFarmCard: card }),
  exhaustingIds: [],
  setExhaustingIds: (ids) => set({ exhaustingIds: ids }),
  toggleExhaustingId: (id) =>
    set((state) => {
      const prev = state.exhaustingIds ?? [];
      return {
        exhaustingIds: prev.includes(id)
          ? prev.filter((i) => i !== id)
          : [...prev, id],
      };
    }),
  resetExhaustingIds: () => set({ exhaustingIds: [] }),
}));
