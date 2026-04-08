import { Layers } from "lucide-react";
import React from "react";
import { GameCard } from "../card/GameCard";
import { cardTemplates } from "@/data/cardDatabase";
import EmptyCardSlot from "../board/EmptyCardSlot";
import { useGameStore } from "@/store/gameStore";

const OpponentTerrain = () => {
  const W = 66;
  const H = 92;
  const gameState = useGameStore((s) => s.gameState);
  const playerId = useGameStore((s) => s.playerId);

  if (!gameState) return null;
  const oppState = useGameStore((s) =>
    s.gameState?.playerStates.find((p) => p.playerId !== s.playerId),
  );

  if (!oppState) return null;

  const terrainSlots = [
    ...oppState.terrainsZone,
    ...Array(Math.max(0, 4 - oppState.terrainsZone.length)),
  ];

  const terrainDeck = gameState.playerStates.filter(
    (p) => p.playerId !== playerId,
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
      <div className="flex">
        {terrainSlots.map((card, i) =>
          card ? (
            <div
              key={card.instanceId}
              className={`transition-all duration-200
        
       
      `}
            >
              <GameCard
                isCardOn="terrain"
                card={card}
                cardTemplate={cardTemplates.find(
                  (c) => c.id === card.templateId,
                )}
              />
            </div>
          ) : (
            <EmptyCardSlot key={i} />
          ),
        )}
      </div>
      {/* Pilha com efeito de profundidade */}
    </div>
  );
};

export default OpponentTerrain;
