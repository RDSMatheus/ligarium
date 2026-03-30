import { battleStore } from "@/store/battleStore";
import { useGameStore } from "@/store/gameStore";
import { useState } from "react";
import { useGameSocket } from "./useGameSocket";
import type { CardInstance } from "@/types";

interface UseBattleProps {
  declareAttack: (attackerId: string, targetId: string | null) => void;
  declareBlock?: (blockerId: string) => void;
}

export function useBattle({ declareAttack, declareBlock }: UseBattleProps) {
  const {
    attacker,
    isDeclaringAttack,
    setAttacker,
    setIsDeclaringAttack,
    setTargetId,
    targetId,
    blocker,
    setBlocker,
  } = battleStore();

  const { gameState, playerId } = useGameStore();

  const { skipBlock } = useGameSocket(gameState?.id);

  // ── Flags derivadas do gameState ──────────────────────────
  const isMePriority = gameState?.chain?.priority === playerId;
  const isOpponent = gameState?.battle?.attackerPlayerId !== playerId;
  const battleStep = gameState?.battle?.step;

  const showBlockPrompt =
    isMePriority && isOpponent && battleStep === "declare";

  const showAttackerResponse =
    isMePriority && !isOpponent && battleStep === "declare";

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
    if (!attacker) return;
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
  };
}
