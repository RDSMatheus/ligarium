import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBattle } from "@/hooks/useBattle";
import { useGameSocket } from "@/hooks/useGameSocket";
import usePlayerState from "@/hooks/usePlayerState";
import { GameCard } from "../card/GameCard";
import { cardTemplates } from "@/data/cardDatabase";
import { Button } from "@/components/ui/button";

const BlockerDialog = () => {
  const playerState = usePlayerState();
  const {
    isDeclaringAttack,
    reset,
    selectTarget,
    targetId,
    clearTarget,
    confirmAttack,
    attacker,
    blocker,
    showBlockPrompt,
    confirmBlocker,
    selectBlocker,
    confirmNotBlocking,
  } = useBattle();

  console.log(showBlockPrompt);

  if (!playerState) return null;
  return (
    <Dialog
      open={showBlockPrompt}
      onOpenChange={(open) => {
        if (!open) reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Oponente atacando com
            {targetId
              ? `${cardTemplates.find((c) => c.id === attacker?.templateId)?.name}`
              : ""}
          </DialogTitle>
          <DialogDescription>
            <div className="flex gap-2 my-5">
              {playerState.meState.battleZone.map((card, i) => (
                <div
                  style={{
                    boxShadow: ` ${blocker?.instanceId === card.instanceId ? "0 0 0 2px red" : ""} `,
                  }}
                >
                  <GameCard
                    key={card?.instanceId ?? i}
                    card={card}
                    cardTemplate={cardTemplates.find(
                      (c) => c.id === card.templateId,
                    )}
                    onClick={() =>
                      card.exhausted ? selectBlocker(null) : selectBlocker(card)
                    }
                  />
                </div>
              ))}
            </div>
            <Button disabled={!blocker} onClick={() => confirmBlocker()}>
              Bloquear
            </Button>
            <Button disabled={!!targetId} onClick={() => confirmNotBlocking()}>
              Não Bloquear
            </Button>
            <Button onClick={() => clearTarget()}>Limpar seleção</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BlockerDialog;
