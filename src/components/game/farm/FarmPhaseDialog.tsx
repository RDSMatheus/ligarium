import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pickaxe } from "lucide-react";
import usePlayerState from "@/hooks/usePlayerState";
import { GameCard } from "../card/GameCard";
import { cardTemplates } from "@/data/cardDatabase";
import type { CardInstance } from "@/types";
import { useGameSocket } from "@/hooks/useGameSocket";
import { useGameStore } from "@/store/gameStore";

export default function FarmPhaseDialog() {
  const ps = usePlayerState();
  const { farmAction, skipFarm } = useGameSocket();
  const gameState = useGameStore((s) => s.gameState);
  const storePlayerId = useGameStore((s) => s.playerId);
  const effectivePlayerId = storePlayerId || ps?.me?.playerId || null;
  const isPlayerFarmPhase =
    gameState?.currentPhase === "farm" &&
    gameState?.currentPlayerId === effectivePlayerId;
  const isFarm = isPlayerFarmPhase;
  const [selected, setSelected] = useState<CardInstance | null>(null);

  if (!ps) return null;

  const hand = ps.meState.hand;

  console.log({
    isFarm,
    effectivePlayerId,
    currentPlayerId: gameState?.currentPlayerId,
  });

  function confirm() {
    if (!selected) return;
    farmAction(selected.instanceId);
    setSelected(null);
  }

  function reject() {
    if (!isFarm) return;
    skipFarm();
    setSelected(null);
  }

  return (
    <Dialog
      open={isFarm}
      onOpenChange={(v) => {
        if (!v) setSelected(null);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl bg-[rgba(18,8,2,0.97)] border border-[#7a4a10] shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(120,60,10,0.4),inset_0_0_30px_rgba(0,0,0,0.5)] rounded-md w-full p-0 overflow-hidden"
      >
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-[#5a3408] bg-[rgba(10,4,1,0.6)]">
          <div className="flex items-center gap-3">
            <span className="text-[#c8860a]">
              <Pickaxe className="size-5" />
            </span>
            <DialogTitle className="font-['Cinzel'] text-[#f0d090] tracking-[0.12em] text-base font-bold uppercase drop-shadow-[0_0_8px_rgba(210,140,20,0.5)]">
              Jogar na Farm
            </DialogTitle>
          </div>
          <DialogDescription className="font-['Cinzel'] text-[#7a5020] text-xs tracking-widest uppercase mt-1">
            Selecione uma carta da sua mão para colocar na Farm
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 justify-center">
            {hand.map((card) => {
              const tpl = cardTemplates.find((c) => c.id === card.templateId);
              return (
                <div key={card.instanceId} className="relative">
                  <div
                    onClick={() => setSelected(card)}
                    className={`cursor-pointer transform transition-all duration-150 rounded-lg ${
                      selected?.instanceId === card.instanceId
                        ? "-translate-y-1 scale-105 ring-4 ring-[#f0d090] rounded overflow-hidden shadow-[0_8px_24px_rgba(240,208,144,0.12)]"
                        : " shadow-amber-200 shadow-[0_0_4px_2px]"
                    }`}
                  >
                    <GameCard
                      isCardOn={"hand"}
                      card={card}
                      cardTemplate={tpl}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#3a1e06]">
            <Button
              variant="outline"
              onClick={() => {
                reject();
              }}
              className="font-['Cinzel'] text-[10px] tracking-[0.15em] uppercase text-[#7a5020] border border-[#4a2808] bg-[rgba(10,4,1,0.8)] px-4 py-2 rounded hover:text-[#c8860a] hover:border-[#7a4a10]"
            >
              Cancelar
            </Button>

            <Button
              onClick={confirm}
              disabled={!selected}
              className="font-['Cinzel'] text-[10px] tracking-[0.15em] uppercase font-bold text-[#1a0802] bg-gradient-to-br from-[#d49010] to-[#b07008] px-5 py-2 rounded shadow-[0_0_12px_rgba(200,134,10,0.45)] hover:from-[#f4c430] hover:to-[#e8a020] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Jogar na Farm ⚒
            </Button>
          </div>
        </div>

        {[
          "top-0 left-0",
          "top-0 right-0",
          "bottom-0 left-0",
          "bottom-0 right-0",
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-3 h-3 border-[#c8860a] opacity-60 ${
              i === 0
                ? "border-t border-l"
                : i === 1
                  ? "border-t border-r"
                  : i === 2
                    ? "border-b border-l"
                    : "border-b border-r"
            }`}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
}
