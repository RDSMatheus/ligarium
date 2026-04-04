// PlayerHand.tsx
// Mão do jogador local — cartas visíveis em leque interativo.
// A carta selecionada sobe e fica em destaque.

import React from "react";
import type { CardInstance, PlayerState } from "@/types";
import { Eye, EyeOff, Tornado, Users } from "lucide-react";
import { ZoneLabel } from "../board/ZoneLabel";
import { GameCard } from "../card/GameCard";
import { cardTemplates } from "@/data/cardDatabase";
import { useGameStore } from "@/store/gameStore";
import { useState } from "react";
import { usePlayMonster } from "@/hooks/usePlayMonster";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useEvolveMonster } from "@/hooks/useEvolveMonster";

interface PlayerHandProps {
  cards: CardInstance[];
}

export function PlayerHand({ cards }: PlayerHandProps) {
  const gameState = useGameStore((s) => s.gameState);
  const playerId = useGameStore((s) => s.playerId);

  const [showHand, setShowHand] = useState(true);
  const mid = Math.floor(cards.length / 2);

  const { setSelectedHandCard } = usePlayMonster(gameState?.id || "");
  const { canEvolveById, setSelectedEvoCard, setEvolvingInfo } =
    useEvolveMonster();

  const isMainPhase =
    gameState?.currentPhase === "main" &&
    gameState.currentPlayerId === playerId;

  return (
    <div className="flex flex-col items-center gap-1 relative z-40">
      <ZoneLabel Icon={Users} text={`Hand (${cards.length})`} />

      <div className="flex items-end pb-1.5 fixed bottom-5 xl:bottom-10 scale-50 lg:scale-75 xl:scale-120 2xl:scale-150 3xl:scale-200">
        {/* Cards — fade + slide down when hidden */}
        <div
          className={`flex items-end transition-all duration-300 ${
            showHand
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-6 pointer-events-none"
          }`}
        >
          {cards.map((card, i) => {
            const offset = i - mid;
            return (
              <React.Fragment key={card.instanceId}>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div
                      className="transition-all duration-200 relative"
                      style={{
                        marginLeft: i === 0 ? 0 : -24,
                        transform: `rotate(${offset * 4}deg) translateY(${Math.abs(offset) * 5}px)`,
                        transformOrigin: "bottom center",
                      }}
                    >
                      <GameCard
                        card={card}
                        cardTemplate={
                          cardTemplates.filter(
                            (c) => card.templateId === c.id,
                          )[0]
                        }
                      />
                    </div>
                  </ContextMenuTrigger>
                  {isMainPhase && (
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => setSelectedHandCard(card)}
                      >
                        <Tornado /> Jogar Monstro
                      </ContextMenuItem>
                      {canEvolveById[card.instanceId].evolve && (
                        <ContextMenuItem
                          onClick={() => {
                            setSelectedEvoCard(card);
                            setEvolvingInfo(canEvolveById[card.instanceId]);
                          }}
                        >
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

        {/* Toggle button */}
        <button
          onClick={() => setShowHand(!showHand)}
          className={`
            ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded
            font-['Cinzel'] text-[9px] tracking-[0.15em] uppercase font-bold
            border transition-all duration-200
            ${
              showHand
                ? "bg-[#f0d090] text-[#1a0802] border-[#c8860a] shadow-[0_0_10px_rgba(240,208,144,0.4)] hover:bg-[#d4b570]"
                : "bg-[rgba(10,4,1,0.85)] text-[#f0d090] border-[#5a3408] hover:border-[#c8860a] hover:text-[#f4c430]"
            }
          `}
        >
          {showHand ? (
            <>
              <EyeOff className="size-3" />
            </>
          ) : (
            <>
              <Eye className="size-3" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
