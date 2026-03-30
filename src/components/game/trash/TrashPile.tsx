import { useGameStore } from "@/store/gameStore";
import type { CardInstance } from "@/types";

import { Flame } from "lucide-react";

interface TrashPileProps {
  trash: CardInstance[];
  small?: boolean;
}

export function TrashPile({ trash, small = false }: TrashPileProps) {
  const gameState = useGameStore((s) => s.gameState);

  const W = small ? 58 : 66;
  const H = small ? 82 : 92;

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <span
        className="text-[8px] tracking-[0.18em] uppercase text-[rgba(200,144,10,0.42)] leading-none"
        style={{ fontFamily: "Cinzel,Georgia,serif" }}
      >
        Trash
      </span>
      <div
        className="flex flex-col items-center justify-center gap-1.5 rounded-[5px]"
        style={{
          width: W,
          height: H,
          background: "rgba(50,12,12,0.45)",
          border: "1.5px dashed rgba(224,88,88,0.3)",
        }}
      >
        <Flame size={small ? 14 : 17} color="rgba(224,88,88,0.38)" />
        <span
          className="text-[10px] leading-none text-[rgba(224,88,88,0.42)]"
          style={{ fontFamily: "Cinzel,Georgia,serif" }}
        >
          {trash.length}
        </span>
      </div>
    </div>
  );
}
