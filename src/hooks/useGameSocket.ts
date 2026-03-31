import { useGameStore } from "@/store/gameStore";
import { useEffect } from "react";
import socket from "@/socket";
import type { PendingOptionalEffect } from "@/types";
import { usePendingEffectStore } from "@/store/pendingEffectStore";

export function useGameSocket() {
  const setPendingOptionalEffect = usePendingEffectStore(
    (s) => s.setPendingOptionalEffect,
  );
  const setRequiresTarget = usePendingEffectStore((s) => s.setRequiresTarget);
  const setTargetZone = usePendingEffectStore((s) => s.setTargetZone);
  const gameState = useGameStore((s) => s.gameState);
  const gameId = gameState ? gameState.id : "";

  useEffect(() => {
    function handlePending(payload: { effect: PendingOptionalEffect }) {
      const { effect } = payload;
      const { requiresTarget, targetZone } = effect;
      setPendingOptionalEffect(effect);
      console.log("esse é o payload: ", payload);
      if (!requiresTarget || !targetZone) return;
      setRequiresTarget(requiresTarget);
      setTargetZone(targetZone);
    }

    socket.on("game:pending_optional_effect", handlePending);
    return () => {
      socket.off("game:pending_optional_effect", handlePending);
    };
  }, [setPendingOptionalEffect, gameState]);

  function endTurn() {
    socket.emit("action:end_turn", { gameId });
  }

  function drawPhase() {
    socket.emit("action:draw", { gameId }, (res: any) => {
      console.log("res draw phase:", res);
    });
  }

  function farmAction(cardInstanceId: string) {
    socket.emit("action:farm", { gameId, cardInstanceId });
  }

  function moveMonsterToBattle(cardInstanceId: string) {
    socket.emit("action:move_to_battle", { gameId, cardInstanceId });
  }

  function declareAttack(
    attackerInstanceId: string,
    targetInstanceId: string | null,
  ) {
    socket.emit("action:declare_attack", {
      gameId,
      attackerInstanceId,
      targetInstanceId,
    });
  }

  function declareBlock(blockerInstanceId: string) {
    socket.emit("action:declare_block", { gameId, blockerInstanceId });
  }

  function skipBlock() {
    socket.emit("action:skip_block", { gameId });
  }

  function passChain() {
    socket.emit("action:pass_chain", { gameId });
  }

  return {
    endTurn,
    drawPhase,
    farmAction,
    moveMonsterToBattle,
    declareAttack,
    declareBlock,
    passChain,
    skipBlock,
  };
}
