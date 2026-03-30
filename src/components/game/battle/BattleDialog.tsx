import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cardTemplates } from "@/data/cardDatabase";
import { useBattle } from "@/hooks/useBattle";
import { useGameSocket } from "@/hooks/useGameSocket";
import usePlayerState from "@/hooks/usePlayerState";
import { useGameStore } from "@/store/gameStore";
import { GameCard } from "../card/GameCard";
import { Button } from "@/components/ui/button";

const BattleDialog = () => {
  const { gameState } = useGameStore();
  const { declareAttack } = useGameSocket(gameState?.id);
  const playerState = usePlayerState();
  const {
    isDeclaringAttack,
    reset,
    selectTarget,
    targetId,
    clearTarget,
    confirmAttack,
    attacker,
  } = useBattle({
    declareAttack,
  });

  console.log(isDeclaringAttack);

  if (!playerState) return null;

  return (
    <Dialog
      open={isDeclaringAttack}
      onOpenChange={(open) => {
        if (!open) reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecione o alvo de ataque</DialogTitle>
          <DialogDescription>
            <div className="flex gap-2 my-5">
              {playerState.oppState.battleZone.map((card, i) => (
                <div
                  style={{
                    boxShadow: ` ${targetId === card.instanceId ? "0 0 0 2px red" : ""} `,
                  }}
                >
                  <GameCard
                    key={card?.instanceId ?? i}
                    card={card}
                    cardTemplate={cardTemplates.find(
                      (c) => c.id === card.templateId,
                    )}
                    onClick={
                      isDeclaringAttack
                        ? () => selectTarget(card.instanceId)
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
            <Button disabled={!targetId} onClick={() => confirmAttack()}>
              Atacar monstro
            </Button>
            <Button disabled={!!targetId} onClick={() => confirmAttack()}>
              Ataque direto
            </Button>
            <Button onClick={() => clearTarget()}>Limpar seleção</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BattleDialog;
