import { useGameStore } from "@/store/gameStore";
import React from "react";
import { ZoneLabel } from "../board/ZoneLabel";
import { Pickaxe } from "lucide-react";
import { GameCard } from "../card/GameCard";
import { cardTemplates } from "@/data/cardDatabase";
import EmptyCardSlot from "../board/EmptyCardSlot";
import type { CardInstance } from "@/types";

const OpponentFarm = () => {
  const oppState = useGameStore((s) =>
    s.gameState?.playerStates.find((p) => p.playerId !== s.playerId),
  );

  if (!oppState) return null;

  const farmSlots: CardInstance[] = [
    ...oppState.farm,
    ...Array(Math.max(0, 4 - oppState.farm.length)),
  ];

  return (
    <div className="col-start-2 col-span-2 ">
      <ZoneLabel Icon={Pickaxe} text="Farm" />
      <div className="flex justify bg-amber-200/5 rounded-2xl px-3 py-3 w-fit gap-1.5 rotate-180">
        {farmSlots.map((card, i) =>
          card ? (
            <div
              key={card.instanceId}
              className={`transition-all duration-200
        ${card.exhausted ? " rotate-12" : ""}
       
      `}
            >
              <GameCard
                isCardOn="field"
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
    </div>
  );
};

export default OpponentFarm;
