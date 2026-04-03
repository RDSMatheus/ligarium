import type { CardInstance } from "@/types";
import { create } from "zustand";

interface BattleStore {
  attacker: CardInstance | null;
  setAttacker: (attacker: CardInstance | null) => void;
  attackedPrompt: boolean;
  setAttackedPrompt: (attacked: boolean) => void;
  blocker: CardInstance | null;
  setBlocker: (blocker: CardInstance | null) => void;
  targetId: string | null;
  setTargetId: (targetId: string | null) => void;
  isDeclaringAttack: boolean;
  setIsDeclaringAttack: (isDeclaringAttack: boolean) => void;
}

export const battleStore = create<BattleStore>((set) => ({
  attacker: null,
  setAttacker: (attacker) => set({ attacker }),
  attackedPrompt: false,
  setAttackedPrompt: (attacked) => set({ attackedPrompt: attacked }),
  blocker: null,
  setBlocker: (blocker) => set({ blocker }),
  targetId: null,
  setTargetId: (targetId) => set({ targetId }),
  isDeclaringAttack: false,
  setIsDeclaringAttack: (isDeclaring) =>
    set({ isDeclaringAttack: isDeclaring }),
}));
