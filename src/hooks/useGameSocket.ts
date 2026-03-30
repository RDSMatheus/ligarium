import { useGameStore } from "@/store/gameStore";
import { useEffect } from "react";
import socket from "@/socket";

export function useGameSocket(gameId: string | undefined) {
  const setPendingOptionalEffect = useGameStore(
    (s) => s.setPendingOptionalEffect,
  );

  useEffect(() => {
    function handlePending(payload: any) {
      setPendingOptionalEffect(payload?.effect ?? null);
    }

    socket.on("game:pending_optional_effect", handlePending);
    return () => {
      socket.off("game:pending_optional_effect", handlePending);
    };
  }, [setPendingOptionalEffect]);

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
