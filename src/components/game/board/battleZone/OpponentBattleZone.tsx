import React from "react";
import { GameCard } from "../../card/GameCard";
import { getTemplate } from "@/data/cardDatabase";
import type { CardInstance, PlayerState } from "@/types";
import EmptyCardSlot from "../EmptyCardSlot";

const OpponentBattleZone = ({ oppState }: { oppState: PlayerState }) => {
  const battleSlots: CardInstance[] = [
    ...oppState.battleZone,
    ...Array(Math.max(0, 4 - oppState.battleZone.length)),
  ];

  return (
    <div className="rotate-180 flex gap-2">
      {battleSlots.map((card, i) =>
        card ? (
          <GameCard
            key={card?.instanceId ?? i}
            card={card}
            cardTemplate={getTemplate(card.templateId)}
          />
        ) : (
          <EmptyCardSlot />
        ),
      )}
    </div>
  );
};

export default OpponentBattleZone;
