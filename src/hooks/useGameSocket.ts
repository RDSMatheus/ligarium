import { useGameStore } from "@/store/gameStore";
import { useEffect } from "react";
import socket from "@/socket";
import type { PendingOptionalEffect } from "@/types";
import { usePendingEffectStore } from "@/store/pendingEffectStore";
import { useFastWindowStore } from "@/store/fastWindowStore";
import type { FastTimingWindow } from "@/data/cardDatabase";
import { battleStore } from "@/store/battleStore";

export function useGameSocket() {
  const setPendingOptionalEffect = usePendingEffectStore(
    (s) => s.setPendingOptionalEffect,
  );
  const setRequiresTarget = usePendingEffectStore((s) => s.setRequiresTarget);
  const setTargetZone = usePendingEffectStore((s) => s.setTargetZone);
  const gameState = useGameStore((s) => s.gameState);
  const gameId = gameState ? gameState.id : "";
  const setActiveTrigger = useFastWindowStore((s) => s.setActiveTrigger);
  const setAttackedPrompt = battleStore((s) => s.setAttackedPrompt);

  useEffect(() => {
    function handlePending(payload: { effect: PendingOptionalEffect }) {
      const { effect } = payload;
      console.log("efeito:", effect);
      const { requiresTarget, targetZone } = effect;
      setPendingOptionalEffect(effect);
      setRequiresTarget(requiresTarget);
      setTargetZone(targetZone ?? null);
    }

    // function handleError(payload: { message: string }) {
    //   console.log(payload);
    // }

    function handleAttackedPrompt(payload: {
      gameId: string;
      attackerInstanceId: string;
      targetInstanceId: string;
    }) {
      setAttackedPrompt(true);
    }

    function handleFastWindow(payload: { trigger: FastTimingWindow }) {
      console.log("fast window:", payload.trigger);
      setActiveTrigger(payload.trigger);
    }

    socket.on("game:pending_optional_effect", handlePending);
    // socket.on("error", handleError);
    socket.on("game:prompt_attacked", handleAttackedPrompt);
    socket.on("game:fast_window", handleFastWindow);
    return () => {
      socket.off("game:pending_optional_effect", handlePending);
      socket.off("game:fast_window", handleFastWindow);
      // socket.on("error", handleError);
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

  function skipFarm() {
    socket.emit("action:skip_farm", { gameId });
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

  function handleAttacked() {
    socket.emit("action:resolve_attacked", {
      gameId,
    });
  }

  function handleSkipAttacked() {
    socket.emit("action:skip_attacked", {
      gameId,
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

  function activateFast(instanceId: string) {
    socket.emit("action:activate_fast", { gameId, instanceId });
    setActiveTrigger(null);
  }

  function passFast() {
    socket.emit("action:pass_fast", { gameId });
    setActiveTrigger(null);
  }

  return {
    endTurn,
    drawPhase,
    farmAction,
    moveMonsterToBattle,
    declareAttack,
    declareBlock,
    passChain,
    activateFast,
    passFast,
    skipBlock,
    handleAttacked,
    handleSkipAttacked,
    skipFarm,
  };
}
