import type { CardInstance } from "@/types";
import { create } from "zustand";

interface EvoInfo {
  evolve: boolean;
  zone?: "mainZone" | "battleZone";
  materials?: {
    instanceId: string;
    templateId: string;
    zone: "mainZone" | "battleZone";
  }[];
}

interface EvoMonster {
  selectedPreEvo: string | null;
  setSelectedPreEvo: (cardId: string | null) => void;
  selectedEvoCard: CardInstance | null;
  setSelectedEvoCard: (card: CardInstance | null) => void;
  isEvolvingMonsterInfo: EvoInfo | null;
  setIsEvolvingMonsterInfo: (info: EvoInfo | null) => void;
}

export const evoMonsterStore = create<EvoMonster>((set) => ({
  selectedPreEvo: null,
  setSelectedPreEvo: (card) => set({ selectedPreEvo: card }),
  selectedEvoCard: null,
  setSelectedEvoCard: (card) => set({ selectedEvoCard: card }),
  isEvolvingMonsterInfo: null,
  setIsEvolvingMonsterInfo: (info) => set({ isEvolvingMonsterInfo: info }),
}));

export default evoMonsterStore;
