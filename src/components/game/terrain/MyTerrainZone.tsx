import { useGameStore } from "@/store/gameStore";
import React from "react";
import { GameCard } from "../card/GameCard";
import EmptyCardSlot from "../board/EmptyCardSlot";
import type { TerrainProps } from "./TerrainDeck";
import { cardTemplates } from "@/data/cardDatabase";

const MyTerrainZone = ({
  exhaustingIds,
  selectedHandCard,
  toggleExhaust,
}: TerrainProps) => {
  const gameState = useGameStore((s) => s.gameState);
  const playerId = useGameStore((s) => s.playerId);

  if (!gameState) return null;
  const meState = useGameStore((s) =>
    s.gameState?.playerStates.find((p) => p.playerId === s.playerId),
  );

  if (!meState) return null;
  const terrainSlots = [
    ...meState.terrainsZone,
    ...Array(Math.max(0, 4 - meState.terrainsZone.length)),
  ];
  return (
    <div className="flex">
      {terrainSlots.map((card, i) =>
        card ? (
          <div
            key={card.instanceId}
            onClick={() => selectedHandCard && toggleExhaust(card.instanceId)}
            className={`transition-all duration-200
        
       
      `}
          >
            <GameCard
              card={card}
              cardTemplate={cardTemplates.find((c) => c.id === card.templateId)}
              selected={exhaustingIds.includes(card.instanceId)}
            />
          </div>
        ) : (
          <EmptyCardSlot key={i} />
        ),
      )}
    </div>
  );
};

export default MyTerrainZone;
