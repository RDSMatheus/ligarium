import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { PlayerState } from "@/types";
import { GameCard } from "../../card/GameCard";
import { SwordsIcon } from "lucide-react";
import { getTemplate } from "@/data/cardDatabase";
import { useBattle } from "@/hooks/useBattle";

const MyBattleZone = ({ meState }: { meState: PlayerState }) => {
  const { showBlockPrompt, selectAttacker } = useBattle();
  return (
    <div className="flex gap-2">
      {meState.battleZone.map((card, i) => (
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              key={card.instanceId}
              className={`transition-all duration-200
    ${
      showBlockPrompt && !card.exhausted
        ? "cursor-pointer ring-2 ring-[#4A90D9] hover:-translate-y-1"
        : ""
    }
    ${card.exhausted ? "opacity-50" : ""}
  `}
            >
              <GameCard
                key={card?.instanceId ?? i}
                card={card}
                cardTemplate={getTemplate(card.templateId)}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => selectAttacker(card)}>
              <SwordsIcon />
              Atacar
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  );
};

export default MyBattleZone;
