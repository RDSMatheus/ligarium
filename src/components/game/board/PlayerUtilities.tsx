// PlayerUtilities.tsx
// Linha de utilidades do jogador: Deck, Trash, Terrain Deck, Revealed, Farm.
// Usada tanto para o jogador local quanto para o oponente (espelhado via CSS).
// Cores literais — sem variáveis.

import type { CardInstance } from "@/types";
import { Layers, Mountain, Eye, Pickaxe } from "lucide-react";
import Deck from "../deck/Deck";
import { TrashPile } from "../trash/TrashPile";
import VSep from "./Vsep";
import TerrainDeck from "../terrain/TerrainDeck";
import { ZoneLabel } from "./ZoneLabel";
import { GameCard } from "../card/GameCard";
import { cardTemplates } from "@/data/cardDatabase";
import { usePlayMonster } from "@/hooks/usePlayMonster";

interface PlayerUtilitiesProps {
  deckCount: number;
  trashCount: CardInstance[];
  terrainDeckCount: number;
  revealedCards: (CardInstance | undefined)[];
  farmCards: (CardInstance | undefined)[];
  gameId: string;
}

export function PlayerUtilities({
  gameId,
  trashCount,

  revealedCards,
  farmCards,
}: PlayerUtilitiesProps) {
  const { selectedHandCard, toggleExhaust, exhaustingIds } =
    usePlayMonster(gameId);

  return (
    <div className="flex items-end gap-3 shrink-0">
      {/* Deck + Trash */}
      <div className="flex flex-col gap-2">
        <Deck isOpponent={false} />
        <TrashPile trash={trashCount} small />
      </div>

      <VSep />

      {/* Terrain Deck + Revealed */}
      <div className="flex items-end gap-2.5 bg-red-500!">
        <TerrainDeck
          exhaustingIds={exhaustingIds}
          selectedHandCard={selectedHandCard}
          toggleExhaust={toggleExhaust}
        />
        <div>
          <ZoneLabel Icon={Eye} text="Revealed" />
          <div className="flex gap-1.5">
            {revealedCards.map((card, i) => (
              <GameCard
                key={card?.instanceId ?? i}
                card={card ?? null}
                cardTemplate={
                  cardTemplates.filter((c) => card?.templateId === c.id)[0]
                }
                // selected={sel === card?.instanceId}
                //   onClick={card ? () => toggle(card.id) : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      <VSep />

      {/* Farm */}
      <div>
        <ZoneLabel Icon={Pickaxe} text="Farm" />
        <div className="flex gap-1.5">
          {farmCards.map((card, i) => (
            <GameCard
              key={card?.instanceId ?? i}
              card={card ?? null}
              cardTemplate={
                cardTemplates.filter((c) => card?.templateId === c.id)[0]
              }
              //   selected={sel === card?.instanceId}
              //   onClick={card ? () => toggle(card.id) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
