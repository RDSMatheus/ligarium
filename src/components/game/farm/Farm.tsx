import { cardTemplateMap, cardTemplates } from "@/data/cardDatabase";
import { useGameStore } from "@/store/gameStore";
import type { CardInstance } from "@/types";
import React from "react";
import EmptyCardSlot from "../board/EmptyCardSlot";
import { GameCard } from "../card/GameCard";
import { ZoneLabel } from "../board/ZoneLabel";
import { Pickaxe, SwordsIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { playMonsterStore } from "@/store/playMonsterStore";

type FarmProps = {
  selectedHandCard: CardInstance | null;
  toggleExhaust: (id: string) => void;
  exhaustingIds: string[];
};

const Farm = ({
  selectedHandCard,
  toggleExhaust,
  exhaustingIds,
}: FarmProps) => {
  const meState = useGameStore((s) =>
    s.gameState?.playerStates.find((p) => p.playerId === s.playerId),
  );
  const { setSelectedFarmCard, selectedFarmCard } = playMonsterStore();

  if (!meState) return null;

  const farmSlots: CardInstance[] = [
    ...meState.farm,
    ...Array(Math.max(0, 4 - meState.farm.length)),
  ];

  return (
    <div className="col-start-2 col-span-2 relative z-30">
      <ZoneLabel Icon={Pickaxe} text="Farm" />
      <div className="flex justify bg-amber-200/5 rounded-2xl px-3 py-3 w-fit gap-1.5">
        {farmSlots.map((card, i) =>
          card ? (
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  key={card.instanceId}
                  onClick={() => {
                    if (selectedHandCard && !card.exhausted)
                      toggleExhaust(card.instanceId);
                    if (selectedFarmCard && !card.exhausted)
                      toggleExhaust(card.instanceId);
                  }}
                  className={`transition-all duration-200
        ${
          exhaustingIds && exhaustingIds.includes(card.instanceId)
            ? "ring-2 ring-red-400 opacity-60 rotate-12"
            : ""
        }
            ${!card.exhausted ? "" : "opacity-20"} 
        ${selectedHandCard || selectedFarmCard ? "cursor-pointer hover:-translate-y-1" : ""}
      `}
                >
                  <GameCard
                    card={card}
                    cardTemplate={cardTemplates.find(
                      (c) => c.id === card.templateId,
                    )}
                    selected={exhaustingIds.includes(card.instanceId)}
                  />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => setSelectedFarmCard(card)}>
                  <SwordsIcon />
                  Jogar
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ) : (
            <EmptyCardSlot key={i} />
          ),
        )}
      </div>
    </div>
  );
};

export default Farm;
