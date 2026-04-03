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
import { GameCard } from "../card/GameCard";
import { Button } from "@/components/ui/button";
import { usePassive } from "@/hooks/usePassive";

const BattleDialog = () => {
  const playerState = usePlayerState();
  const { hasTaunt } = usePassive();
  const {
    isDeclaringAttack,
    reset,
    selectTarget,
    targetId,
    clearTarget,
    confirmAttack,
    attacker,
  } = useBattle();

  if (!playerState) return null;

  console.log(hasTaunt);

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
              {hasTaunt?.length ? (
                <>
                  <h3>Você deve atacar o monstros com [Taunt]</h3>
                  <div>
                    {hasTaunt.map((card, i) => (
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
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
            <Button disabled={!targetId} onClick={() => confirmAttack()}>
              Atacar monstro
            </Button>
            {!hasTaunt?.length && (
              <Button disabled={!!targetId} onClick={() => confirmAttack()}>
                Ataque direto
              </Button>
            )}
            <Button onClick={() => clearTarget()}>Limpar seleção</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BattleDialog;
