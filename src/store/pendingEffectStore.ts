import type { TargetZone } from "@/data/cardDatabase";
import type {
  CardInstance,
  EffectTarget,
  PendingOptionalEffect,
} from "@/types";
import { create } from "zustand";

interface PendingEffectStore {
  pendingOptionalEffect: PendingOptionalEffect | null;
  setPendingOptionalEffect: (effect: PendingOptionalEffect | null) => void;
  isEffectTargetSelected: boolean;
  setIsEffectTargetSelected: (effect: boolean) => void;
  effectTarget: CardInstance | null;
  setEffectTarget: (effectTarget: CardInstance | null) => void;
  requiresTarget: boolean;
  setRequiresTarget: (target: boolean) => void;
  targetZone: EffectTarget[] | null;
  setTargetZone: (target: EffectTarget[] | null) => void;
}

export const usePendingEffectStore = create<PendingEffectStore>((set) => ({
  pendingOptionalEffect: null,
  setPendingOptionalEffect: (effect) => set({ pendingOptionalEffect: effect }),
  isEffectTargetSelected: false,
  setIsEffectTargetSelected: (effect) =>
    set({ isEffectTargetSelected: effect }),
  effectTarget: null,
  setEffectTarget: (effectTarget) => set({ effectTarget }),
  requiresTarget: false,
  setRequiresTarget: (target) => set({ requiresTarget: target }),
  targetZone: null,
  setTargetZone: (target) => set({ targetZone: target }),
}));
