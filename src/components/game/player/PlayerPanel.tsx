import { Button } from "@/components/ui/button";
import type { Player } from "@/store/gameStore";
import type { PlayerState } from "@/types";
import { ForwardIcon, Zap } from "lucide-react";

export function PlayerPanel({
  playerField,
  playerInfo,
  isOpponent = false,
  isCurrentTurn,
  endTurn,
}: {
  playerInfo: Player;
  playerField: PlayerState;
  isOpponent: boolean;
  isCurrentTurn?: boolean;
  endTurn?: () => void;
}) {
  // const hpColor = pct > 60 ? "#5FD44A" : pct > 30 ? "#F0B830" : "#E05858";

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
        {!isOpponent && isCurrentTurn && endTurn && (
          <div>
            <Button
              onClick={() => endTurn()}
              className="bg-yellow-400 text-amber-900"
            >
              End Turn <ForwardIcon />
            </Button>
          </div>
        )}

        {/* HP bar */}
        {/* <div className="flex items-center gap-1.5">
          <div
            className="flex-1 h-1.25 rounded-full overflow-hidden bg-black/45"
            style={{ border: "1px solid rgba(0,0,0,0.35)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: hpColor,
                boxShadow: `0 0 5px ${hpColor}88`,
              }}
            />
          </div>
          <span
            className="font-bold text-[9px] leading-none shrink-0"
            style={{ fontFamily: "Cinzel,Georgia,serif", color: hpColor }}
          >
            {hp}
          </span>
        </div> */}

        {/* Mana orbs */}
        {/* <div className="flex items-center gap-1">
          <Zap size={9} color="#4A90D9" />
          <div className="flex gap-0.5">
            {Array.from({ length: maxMana }).map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  background:
                    i < mana
                      ? "radial-gradient(circle at 35% 30%,#7BB8F0,#1A2A4A)"
                      : "rgba(0,0,0,0.35)",
                  border: `1px solid ${i < mana ? "#4A90D9" : "rgba(200,144,10,0.15)"}`,
                  boxShadow: i < mana ? "0 0 5px rgba(74,144,217,0.6)" : "none",
                }}
              />
            ))}
          </div>
          <span
            className="text-[8px] text-[rgba(200,144,10,0.45)]"
            style={{ fontFamily: "Cinzel,Georgia,serif" }}
          >
            {mana}/{maxMana}
          </span>
        </div> */}
      </div>
    </div>
  );
}
