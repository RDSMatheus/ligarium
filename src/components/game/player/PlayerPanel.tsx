import { Button } from "@/components/ui/button";
import { usePermission } from "@/hooks/usePermissions";
import { useGameStore, type Player } from "@/store/gameStore";
import type { PlayerState } from "@/types";
import { ForwardIcon, Zap } from "lucide-react";

export function PlayerPanel({
  playerInfo,
  isOpponent = false,
  endTurn,
}: {
  playerInfo: Player;
  playerField: PlayerState;
  isOpponent: boolean;
  isCurrentTurn?: boolean;
  endTurn?: () => void;
}) {
  const gameState = useGameStore((s) => s.gameState);
  if (!gameState) return;
  const { canEndTurn } = usePermission(gameState);

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl shrink-0"
      style={{
        background: "rgba(18,8,2,0.88)",
        border: "1px solid rgba(200,144,10,0.28)",
        boxShadow:
          "inset 0 1px 0 rgba(255,180,60,0.06), 0 4px 20px rgba(0,0,0,0.55)",
        minWidth: 192,
      }}
    >
      {/* ── Avatar tribal ── */}
      <div
        className="flex items-center justify-center w-11 h-11 rounded-full shrink-0"
        style={{
          background: isOpponent
            ? "radial-gradient(circle at 35% 30%,#2A1A08,#1A0E04)"
            : "radial-gradient(circle at 35% 30%,#1A2A4A,#0E1A30)",
          border: `2.5px solid ${isOpponent ? "#C87A30" : "#4A90D9"}`,
          boxShadow: `0 0 12px ${
            isOpponent ? "rgba(200,122,48,0.4)" : "rgba(74,144,217,0.4)"
          }`,
        }}
      ></div>

      {/* ── Informações ── */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {/* Nome + tribo */}
        <div>
          <p
            className="font-semibold text-[11px] tracking-[0.06em] text-[#FFF3D8] leading-none"
            style={{ fontFamily: "Cinzel,Georgia,serif" }}
          >
            {playerInfo.name}
          </p>
          <p
            className="text-[8px] tracking-[0.15em] uppercase leading-none mt-0.75"
            style={{
              fontFamily: "Cinzel,Georgia,serif",
              color: isOpponent ? "#C87A30" : "#4A90D9",
            }}
          >
            {isOpponent ? "Tribo Terrones" : "Tribo Tengu"}
          </p>
        </div>
        {canEndTurn() && endTurn && (
          <div>
            <Button
              onClick={() => endTurn()}
              className="bg-yellow-400 text-amber-900"
            >
              End Turn <ForwardIcon />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
