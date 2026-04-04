import { useGameStore } from "@/store/gameStore";
import { usePendingEffectStore } from "@/store/pendingEffectStore";
import type { GameState } from "@/types";
import { useBattle } from "./useBattle";

export function usePermission(gameState: GameState) {
  const { battle, currentPhase, currentPlayerId, playerStates } = gameState;
  const { playerId } = useGameStore();
  const isPlayer = playerId === currentPlayerId;
  const { pendingOptionalEffect } = usePendingEffectStore();
  const { attackedPrompt } = useBattle();

  function canPlayMonster() {
    return (
      !battle && currentPhase === "main" && isPlayer && !pendingOptionalEffect
    );
  }

  function canAttack() {
    return (
      !battle && currentPhase === "main" && isPlayer && !pendingOptionalEffect
    );
  }

  function canEndTurn() {
    return (
      !battle && currentPhase === "main" && isPlayer && !pendingOptionalEffect
    );
  }

  function canBlock() {
    if (!battle) return false;
    const { step, attackerPlayerId } = battle;
    const hasActiveMonsterInBattle = playerStates
      .find((p) => p.playerId !== attackerPlayerId)
      ?.battleZone.some((c) => !c.exhausted);

    return step === "blocking" && hasActiveMonsterInBattle && attackedPrompt;
  }

  return { canPlayMonster, canAttack, canEndTurn, canBlock };
}
