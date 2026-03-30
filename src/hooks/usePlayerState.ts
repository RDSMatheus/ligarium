import { useGameStore, type Player } from "@/store/gameStore";
import type { GameState, PlayerState } from "@/types";

const usePlayerState = (): {
  opp: Player;
  oppState: PlayerState;
  me: Player;
  meState: PlayerState;
} | null => {
  const playerId = useGameStore((s) => s.playerId);
  const gameState = useGameStore((s) => s.gameState);

  const opp = gameState?.players.filter((o) => o.playerId !== playerId)[0];
  const oppState = gameState?.playerStates.filter(
    (o) => o.playerId !== playerId,
  )[0];
  const me = gameState?.players.filter((o) => o.playerId === playerId)[0];
  const meState = gameState?.playerStates.filter(
    (o) => o.playerId === playerId,
  )[0];

  if (!opp || !oppState || !me || !meState) return null;

  return {
    opp,
    oppState,
    me,
    meState,
  };
};

export default usePlayerState;
