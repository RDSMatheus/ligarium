import socket from "@/socket";
import { useGameStore } from "@/store/gameStore";
import { Layers } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { GameCard } from "../card/GameCard";
import { cardTemplates } from "@/data/cardDatabase";
import EmptyCardSlot from "../board/EmptyCardSlot";
import MyTerrainZone from "./MyTerrainZone";
import type { CardInstance } from "@/types";

export type TerrainProps = {
  selectedHandCard: CardInstance | null;
  toggleExhaust: (id: string) => void;
  exhaustingIds: string[];
};

const TerrainDeck = ({
  exhaustingIds,
  selectedHandCard,
  toggleExhaust,
}: TerrainProps) => {
  const W = 66;
  const H = 92;
  const gameState = useGameStore((s) => s.gameState);
  const playerId = useGameStore((s) => s.playerId);

  if (!gameState) return null;
  const meState = useGameStore((s) =>
    s.gameState?.playerStates.find((p) => p.playerId === s.playerId),
  );

  if (!meState) return null;

  const terrainDeck = gameState.playerStates.filter(
    (p) => p.playerId === playerId,
  )[0].terrainsDeck;

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      {/* Label */}
      <span
        className="text-[8px] tracking-[0.18em] uppercase text-[rgba(200,144,10,0.42)] whitespace-nowrap leading-none"
        style={{ fontFamily: "Cinzel,Georgia,serif" }}
      >
        Deck terreno
      </span>
      <MyTerrainZone
        exhaustingIds={exhaustingIds}
        selectedHandCard={selectedHandCard}
        toggleExhaust={toggleExhaust}
      />
    </div>
  );
};

export default TerrainDeck;
