import React from "react";
import { GameCard } from "../../card/GameCard";
import { getTemplate } from "@/data/cardDatabase";
import type { PlayerState } from "@/types";

const OpponentBattleZone = ({ oppState }: { oppState: PlayerState }) => {
  return (
    <div className="rotate-180 flex gap-2">
      {oppState.battleZone.map((card, i) => (
        <GameCard
          key={card?.instanceId ?? i}
          card={card}
          cardTemplate={getTemplate(card.templateId)}
        />
      ))}
    </div>
  );
};

export default OpponentBattleZone;
