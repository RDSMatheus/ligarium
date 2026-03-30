import type { Player } from "@/store/gameStore";
import React from "react";

function PlayerAvatar({ player, isMe }: { player: Player; isMe: boolean }) {
  return (
    <div className="relative flex items-center justify-center shrink-0">
      {/* Círculo principal */}
      <div
        className="flex items-center justify-center w-20 h-20 rounded-full transition-all duration-500"
        style={{
          background: isMe
            ? "radial-gradient(circle at 35% 30%, #1A2A4A, #0E1A30)"
            : "radial-gradient(circle at 35% 30%, #2A1A08, #1A0E04)",
          border: `3px solid ${player.isReady ? "#5FD44A" : isMe ? "#4A90D9" : "#C87A30"}`,
          boxShadow: player.isReady
            ? "0 0 0 2px rgba(95,212,74,0.18), 0 0 0 5px rgba(24,10,2,0.85), 0 0 20px rgba(95,212,74,0.3)"
            : "0 0 0 2px rgba(0,0,0,0.15), 0 0 0 5px rgba(24,10,2,0.85), 0 4px 16px rgba(0,0,0,0.7)",
        }}
      >
        <i
          className={`ra ${isMe ? "ra-bird-claw" : "ra-mining"} text-3xl leading-none transition-all duration-500`}
          style={{
            color: player.isReady ? "#5FD44A" : isMe ? "#7BB8F0" : "#E8A860",
            textShadow: player.isReady
              ? "0 0 12px rgba(95,212,74,0.8)"
              : "none",
          }}
        />
      </div>

      {/* Badge ✓ quando pronto */}
      {player.isReady && (
        <div
          className="absolute -bottom-1 -right-1 flex items-center justify-center w-[22px] h-[22px] rounded-full bg-[#1A3A18] border-2 border-[#5FD44A] animate-[popIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ boxShadow: "0 0 8px rgba(95,212,74,0.5)" }}
        >
          <span className="text-[10px] font-bold text-[#5FD44A] leading-none">
            ✓
          </span>
        </div>
      )}
    </div>
  );
}

export default PlayerAvatar;
