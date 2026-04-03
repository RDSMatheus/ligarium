import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { useEffect } from "react";
import socket from "@/socket";
import { useGameStore } from "@/store/gameStore";
import SelectTarget from "./SelectTarget";
import { usePendingEffect } from "@/hooks/usePendingEffect";

export default function PendingOptionalEffectDialog() {
  const effect = usePendingEffect();
  const gameId = useGameStore((s) => s.roomId);

  console.log(effect);

  if (!effect) return null;
  const {
    pending,
    setPending,
    requiresTarget,
    target,
    effectTarget,
    hasLegalTarget,
  } = effect;

  console.log("precisa de alvo? ", requiresTarget);
  console.log("zone de alvo? ", target);

  console.log("tem alvo legal: ", hasLegalTarget);

  function acceptWithTarget() {
    socket.emit("action:resolve_optional_effect", {
      gameId,
      accept: true,
      targetInstanceId: effectTarget?.instanceId,
    });
    setPending(null);
  }

  function acceptWithoutTarget() {
    socket.emit("action:resolve_optional_effect", {
      gameId,
      accept: true,
    });
    setPending(null);
  }

  function reject() {
    console.log("Chamou reject.");
    socket.emit("action:resolve_optional_effect", { gameId, accept: false });
    setPending(null);
  }

  useEffect(() => {
    if (pending && !hasLegalTarget) {
      reject();
    }
  }, [pending, hasLegalTarget]);
  if (!pending) return null;

  return (
    <Dialog open={true} onOpenChange={() => setPending(null)}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-[#5a3408] bg-[rgba(10,4,1,0.6)]">
          <DialogTitle className="font-['Cinzel'] text-[#f0d090] tracking-[0.15em] text-base font-bold uppercase">
            Efeito opcional
          </DialogTitle>
          <DialogDescription className="font-['Cinzel'] text-[#7a5020] text-xs tracking-widest uppercase mt-1">
            {pending?.action ??
              pending?.trigger ??
              "Você pode executar um efeito."}
          </DialogDescription>
        </DialogHeader>
        {requiresTarget && <SelectTarget />}
        <div className="px-6 py-5 flex flex-col gap-5">
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={reject}>
              Recusar
            </Button>

            <Button
              disabled={requiresTarget && !effectTarget}
              onClick={() => {
                if (requiresTarget) {
                  acceptWithTarget();
                } else {
                  acceptWithoutTarget();
                }
              }}
            >
              {requiresTarget && !effectTarget ? "Escolha o alvo" : "Aceitar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
