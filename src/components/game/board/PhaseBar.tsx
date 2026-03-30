// PhaseBar.tsx
// Barra central que mostra a fase atual e o número do turno.
// Design idêntico ao VsDivider do WaitingRoom.
// Cores literais — sem variáveis.

import type { Phase } from "@/types";
import { ScrollText, Gem, Swords, Hourglass, Crown } from "lucide-react";
import { type LucideIcon } from "lucide-react";

const PHASES: Record<
  Phase,
  { label: string; color: string; Icon: LucideIcon }
> = {
  refresh: { label: "Refresh", color: "#4A90D9", Icon: ScrollText },
  farm: { label: "Farm", color: "#4A90D9", Icon: ScrollText },
  draw: { label: "Compra", color: "#4A90D9", Icon: ScrollText },
  main: { label: "Principal", color: "#F0B830", Icon: Gem },
  battle: { label: "Batalha", color: "#E05858", Icon: Swords },
  end: { label: "Fim", color: "#8B6040", Icon: Hourglass },
};

interface PhaseBarProps {
  phase: Phase;
  turn: number;
}

export function PhaseBar({ phase, turn }: PhaseBarProps) {
  const { label, color, Icon } = PHASES[phase];

  return (
    <div className="flex items-center gap-3 shrink-0 py-0.5">
      {/* Linha esquerda */}
      <div
        className="flex-1 h-px"
        style={{
          background:
            "linear-gradient(to right,transparent,rgba(200,144,10,0.38),transparent)",
        }}
      />

      {/* Pill de fase */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          background: "rgba(18,8,2,0.88)",
          border: `1px solid ${color}44`,
          boxShadow: `0 0 14px ${color}18`,
        }}
      >
        <Icon
          size={13}
          color={color}
          style={{ filter: `drop-shadow(0 0 5px ${color}99)` }}
        />
        <span
          className="text-[9px] tracking-[0.22em] uppercase leading-none"
          style={{ fontFamily: "Cinzel,Georgia,serif", color }}
        >
          {label}
        </span>
      </div>

      {/* Pill de turno — medalha com coroas simétricas */}
      <div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full"
        style={{
          background: "rgba(18,8,2,0.88)",
          border: "1px solid rgba(200,144,10,0.28)",
          boxShadow: "0 0 14px rgba(200,144,10,0.1)",
        }}
      >
        <Crown
          size={12}
          color="#F0B830"
          style={{ filter: "drop-shadow(0 0 5px rgba(200,144,10,0.7))" }}
        />
        <span
          className="text-[9px] tracking-[0.3em] uppercase leading-none text-[rgba(200,144,10,0.72)]"
          style={{ fontFamily: "Cinzel,Georgia,serif" }}
        >
          Turno {turn}
        </span>
        <Crown
          size={12}
          color="#F0B830"
          style={{
            transform: "scaleX(-1)",
            filter: "drop-shadow(0 0 5px rgba(200,144,10,0.7))",
          }}
        />
      </div>

      {/* Linha direita */}
      <div
        className="flex-1 h-px"
        style={{
          background:
            "linear-gradient(to left,transparent,rgba(200,144,10,0.38),transparent)",
        }}
      />
    </div>
  );
}
