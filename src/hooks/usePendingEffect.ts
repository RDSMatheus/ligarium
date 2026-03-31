import { usePendingEffectStore } from "@/store/pendingEffectStore";
import usePlayerState from "./usePlayerState";
import { useGameStore } from "@/store/gameStore";
import type { EffectTarget } from "@/types";
import { cardTemplates } from "@/data/cardDatabase";

export function usePendingEffect() {
  const pending = usePendingEffectStore((s) => s.pendingOptionalEffect);
  const target = usePendingEffectStore((s) => s.targetZone);
  const requiresTarget = usePendingEffectStore((s) => s.requiresTarget);
  const setPending = usePendingEffectStore((s) => s.setPendingOptionalEffect);
  const setEffectTarget = usePendingEffectStore((s) => s.setEffectTarget);
  const effectTarget = usePendingEffectStore((s) => s.effectTarget);
  const isEffectTargetSelected = usePendingEffectStore(
    (s) => s.isEffectTargetSelected,
  );
  const setIsEffectTargetSelected = usePendingEffectStore(
    (s) => s.setIsEffectTargetSelected,
  );

  const ps = usePlayerState();
  if (!ps || !target) return null;

  const { meState, oppState } = ps;

  const zones = {
    opponent_farm: oppState.farm,
    own_farm: meState.farm,
    opponent_battle: oppState.battleZone,
    own_battle: meState.battleZone,
    opponent_hand: oppState.hand,
    own_hand: meState.hand,
    opponent_main: oppState.mainZone,
    own_main: meState.mainZone,
    opponent_trash: oppState.trash,
    own_trash: meState.trash,
    any: [
      ...oppState.farm,
      ...meState.farm,
      ...oppState.battleZone,
      ...meState.battleZone,
      ...oppState.hand,
      ...meState.hand,
      ...oppState.mainZone,
      ...oppState.trash,
      ...meState.trash,
    ],
  };

  const zonesLabel: Record<EffectTarget, string> = {
    opponent_farm: "Farm do oponente",
    own_farm: "Minha farm",
    opponent_battle: "Battle Zone do oponente",
    own_battle: "Minha Battle Zone",
    opponent_hand: "Mão do oponente",
    own_hand: "Minha mão",
    opponent_main: "Main Zone do oponente",
    own_main: "Minha Main Zone",
    opponent_trash: "Trash do oponente",
    own_trash: "Meu trash",
    any: "Qualquer zona",
  };

  const filter = pending?.targetFilter ?? "any";

  // cria lista plana de { card, zone, zoneLabel }
  const selectableCards = target.flatMap((zone) =>
    (zones[zone] ?? [])
      .filter((card) => {
        if (filter === "active") return !card.exhausted;
        if (filter === "exhausted") return card.exhausted;
        return true;
      })
      .map((card) => ({
        card,
        zone,
        zoneLabel: zonesLabel[zone],
      })),
  );

  const hasLegalTarget = selectableCards.length > 0;

  return {
    target,
    requiresTarget,
    setPending,
    pending,
    zones,
    zonesLabel,
    setEffectTarget,
    effectTarget,
    hasLegalTarget,
    selectableCards,
    isEffectTargetSelected,
    setIsEffectTargetSelected,
  };
}
