import type { GameState } from "@/types";
import { useEffect, useRef } from "react";

interface UseGamePhasesProps {
  gameState: GameState | null;
  player: string | null;
  drawPhase: () => void;
  refreshPhase: () => void; // socket.emit("action:refresh", ...)
}

export function useGamePhases({
  gameState,
  player,
  drawPhase,
  refreshPhase,
}: UseGamePhasesProps) {
  const autoDraw = useRef(false);
  const autoRefresh = useRef(false);
  const isMainPhase =
    gameState?.currentPhase === "main" && gameState.currentPlayerId === player;
  const isFarmPhase =
    gameState?.currentPhase === "farm" && gameState.currentPlayerId === player;

  // ── Auto-refresh ──────────────────────────────────────────
  useEffect(() => {
    if (!gameState) return;

    if (gameState.currentPhase !== "refresh") {
      autoRefresh.current = false;
      return;
    }

    if (autoRefresh.current) return;
    if (gameState.currentPlayerId !== player) return;

    autoRefresh.current = true;
    refreshPhase();
  }, [
    gameState?.currentPhase,
    gameState?.currentPlayerId,
    gameState?.turnNumber,
  ]);

  // ── Auto-draw ─────────────────────────────────────────────
  useEffect(() => {
    if (!gameState) return;

    if (gameState.currentPhase !== "draw") {
      autoDraw.current = false;
      return;
    }

    if (autoDraw.current) return;
    if (gameState.currentPlayerId !== player) return;

    autoDraw.current = true;
    drawPhase();
  }, [
    gameState?.currentPhase,
    gameState?.currentPlayerId,
    gameState?.turnNumber,
  ]);

  return { isFarmPhase, isMainPhase };
}
