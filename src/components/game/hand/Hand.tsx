import { cardTemplates } from "@/data/cardDatabase";
import socket from "@/socket";
import { useGameStore } from "@/store/gameStore";
import type { CardInstance } from "@/types";
import React, { useEffect } from "react";

const Hand = () => {
  const gameState = useGameStore((s) => s.gameState);
  const hand = useGameStore(
    (s) =>
      s.gameState?.playerStates.find((p) => p.playerId === s.playerId)?.hand ??
      [],
  );

  function farmAction(cardInstanceId: string) {
    socket.emit("action:farm", { gameId: gameState?.id, cardInstanceId });
  }

  if (!hand) return;

  return (
    <div className="absolute bottom-0 left-[25%]">
      <ul className="flex">
        {hand.map((card) => {
          return (
            <li
              key={card.instanceId}
              className=" bg-amber-300 w-25 h-50 mx-1"
              onClick={() => farmAction(card.instanceId)}
            >
              <div>
                {cardTemplates.find((c) => c.id === card.templateId)?.name}
                <p>
                  Ap: {cardTemplates.find((c) => c.id === card.templateId)?.ap}
                </p>
                <p>
                  Hp: {cardTemplates.find((c) => c.id === card.templateId)?.hp}
                </p>
                <p>
                  {
                    cardTemplates.find((c) => c.id === card.templateId)
                      ?.description
                  }
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Hand;
