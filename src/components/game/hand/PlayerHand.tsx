// PlayerHand.tsx
// Mão do jogador local — cartas visíveis em leque interativo.
// A carta selecionada sobe e fica em destaque.

import React from "react";
import type { CardInstance } from "@/types";
import { Play, PlayCircle, Tornado, Users } from "lucide-react";
import { ZoneLabel } from "../board/ZoneLabel";
import { GameCard } from "../card/GameCard";
import { cardTemplates } from "@/data/cardDatabase";
import { useGameStore } from "@/store/gameStore";
import { useEffect, useState } from "react";
import { usePlayMonster } from "@/hooks/usePlayMonster";
import { useGamePhases } from "@/hooks/useGamePhase";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEvolveMonster } from "@/hooks/useEvolveMonster";

interface PlayerHandProps {
  cards: CardInstance[];
  onFarmAction: (id: string) => void;
}

export function PlayerHand({ cards, onFarmAction }: PlayerHandProps) {
  const gameState = useGameStore((s) => s.gameState);
  const playerId = useGameStore((s) => s.playerId);
  const isPlayerFarmPhase =
    gameState?.currentPhase === "farm" &&
    gameState.currentPlayerId === playerId;
  const isFarm = isPlayerFarmPhase;

  const mid = Math.floor(cards.length / 2);

  const { setSelectedHandCard } = usePlayMonster(gameState?.id || "");
  const { canEvolveById, setSelectedEvoCard, setEvolvingInfo } =
    useEvolveMonster();

  const isMainPhase =
    gameState?.currentPhase === "main" &&
    gameState.currentPlayerId === playerId;
  const isFarmPhase =
    gameState?.currentPhase === "farm" &&
    gameState.currentPlayerId === playerId;

  // isFarm is derived from gameState; no local effect needed

  return (
    <div className="flex flex-col items-center gap-1">
      <ZoneLabel Icon={Users} text={`Hand (${cards.length})`} />

      <div
        className="flex items-end"
        style={{
          paddingBottom: 6,
          filter: `${isFarm ? 'drop-shadow( "0 0 10px yellow")' : ""}`,
          position: `${isFarm ? "fixed" : "initial"}`,
          bottom: `${isFarm ? "100px" : "initial"}`,
          transform: `${isFarm ? "scale(2)" : "initial"}`,
        }}
      >
        {cards.map((card, i) => {
          const offset = i - mid;
          return (
            <React.Fragment key={card.instanceId}>
              <ContextMenu>
                <ContextMenuTrigger>
                  {" "}
                  <div
                    onClick={() => {
                      if (isFarmPhase) return onFarmAction(card.instanceId);
                    }}
                    key={card.instanceId}
                    className="transition-all duration-200 relative"
                    style={{
                      marginLeft: i === 0 ? 0 : -24,
                      // zIndex: selectedId === card.instanceId ? 50 : i,
                      transform: `rotate(${offset * 4}deg) translateY(${Math.abs(offset) * 5}px)`,
                      transformOrigin: "bottom center",
                    }}
                  >
                    <GameCard
                      key={card?.instanceId ?? i}
                      card={card}
                      cardTemplate={
                        cardTemplates.filter((c) => card.templateId === c.id)[0]
                      }
                      // selected={sel === card?.instanceId}
                      //   onClick={card ? () => toggle(card.id) : undefined}
                    />
                  </div>
                </ContextMenuTrigger>
                {isMainPhase && (
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => setSelectedHandCard(card)}>
                      <Tornado /> Jogar Monstro
                    </ContextMenuItem>
                    {canEvolveById[card.instanceId].evolve && (
                      <ContextMenuItem
                        onClick={() => {
                          setSelectedEvoCard(card);
                          setEvolvingInfo(canEvolveById[card.instanceId]);
                        }}
                      >
                        {" "}
                        <Tornado /> Evoluir Monstro
                      </ContextMenuItem>
                    )}
                  </ContextMenuContent>
                )}
              </ContextMenu>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
