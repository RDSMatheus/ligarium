import { battleStore } from "@/store/battleStore";
import { useGameStore } from "@/store/gameStore";
import {} from "react";
import { usePendingEffectStore } from "@/store/pendingEffectStore";
import { useGameSocket } from "./useGameSocket";
import type { CardInstance } from "@/types";

export function useBattle() {
  const {
    attacker,
    isDeclaringAttack,
    setAttacker,
    setIsDeclaringAttack,
    setTargetId,
    targetId,
    blocker,
    setBlocker,
    attackedPrompt,
    setAttackedPrompt,
  } = battleStore();

  const { gameState, playerId } = useGameStore();

  const {
    skipBlock,
    declareAttack,
    declareBlock,
    handleAttacked,
    handleSkipAttacked,
  } = useGameSocket();

  // ── Flags derivadas do gameState ──────────────────────────
  const isMePriority = gameState?.battle?.attackerPlayerId;
  const isOpponent = gameState?.battle?.attackerPlayerId !== playerId;
  const battleStep = gameState?.battle?.step;

  const pendingOptionalEffect = usePendingEffectStore(
    (s) => s.pendingOptionalEffect,
  );

  const showBlockPrompt =
    isMePriority &&
    isOpponent &&
    battleStep === "blocking" &&
    !attackedPrompt &&
    !pendingOptionalEffect
      ? true
      : false;

  const showAttackerResponse =
    isMePriority && !isOpponent && battleStep === "blocking";

  // ── Actions ───────────────────────────────────────────────
  function selectAttacker(instance: CardInstance) {
    setAttacker(instance);
    setIsDeclaringAttack(true);
  }

  function selectTarget(instanceId: string) {
    setTargetId(instanceId);
  }

  function clearTarget() {
    setTargetId(null);
  }

  function confirmAttack() {
    if (!attacker || !declareAttack) return;
    declareAttack(attacker.instanceId, targetId);
    reset();
  }

  function selectBlocker(instance: CardInstance | null) {
    setBlocker(instance);
  }

  function confirmBlocker() {
    if (!blocker || !declareBlock) return;
    declareBlock(blocker.instanceId);
  }

  function confirmNotBlocking() {
    if (!declareBlock) return;
    skipBlock();
  }

  function reset() {
    setAttacker(null);
    setTargetId(null);
    setIsDeclaringAttack(false);
  }

  const canConfirmAttack = !!attacker && !!targetId;

  return {
    attacker,
    targetId,
    isDeclaringAttack,
    showBlockPrompt,
    showAttackerResponse,
    selectAttacker,
    selectTarget,
    confirmAttack,
    canConfirmAttack,
    reset,
    clearTarget,
    confirmBlocker,
    selectBlocker,
    blocker,
    confirmNotBlocking,
    attackedPrompt,
    setAttackedPrompt,
    handleSkipAttacked,
    handleAttacked,
  };
}
