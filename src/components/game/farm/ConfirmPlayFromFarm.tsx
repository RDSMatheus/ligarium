import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { GameCard } from "../card/GameCard";
import Farm from "./Farm";
import MyTerrainZone from "../terrain/MyTerrainZone";
import { playMonsterStore } from "@/store/playMonsterStore";
import { usePlayMonster } from "@/hooks/usePlayMonster";

const ConfirmPlayFromFarm = ({ gameId }: { gameId: string }) => {
  const {
    exhaustingIds,
    resetExhaustingIds,
    selectedFarmCard,
    setExhaustingIds,
    setSelectedFarmCard,
    toggleExhaustingId,
  } = playMonsterStore();
  const { selectedFromFarmCard, toggleExhaust, cancelPlay, confirmFarmPlay } =
    usePlayMonster(gameId);

  return (
    <Dialog
      open={selectedFarmCard ? true : false}
      onOpenChange={(open) => {
        if (!open) setSelectedFarmCard(null);
      }}
    >
      <DialogContent
        className="
  bg-[rgba(18,8,2,0.97)]
  border border-[#7a4a10]
  shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(120,60,10,0.4),inset_0_0_30px_rgba(0,0,0,0.5)]
  rounded-md
  max-w-2xl! w-full
  p-0
  overflow-hidden
  [background-image:repeating-linear-gradient(180deg,rgba(0,0,0,0.25)_0px,transparent_1px,transparent_22px,rgba(0,0,0,0.15)_23px)]
"
      >
        {/* Header bar */}
        <DialogHeader
          className="
    px-6 pt-5 pb-4
    border-b border-[#5a3408]
    bg-[rgba(10,4,1,0.6)]
  "
        >
          <DialogTitle
            className="
      font-['Cinzel'] text-[#f0d090] tracking-[0.15em] text-base font-bold uppercase
      drop-shadow-[0_0_8px_rgba(210,140,20,0.5)]
      flex items-center gap-3
    "
          >
            {/* rune icon */}
            <span className="text-[#c8860a] text-lg">⚔</span>
            Exaure{" "}
            <span
              className="
        text-[#f4c430]
        bg-[rgba(30,15,2,0.8)]
        border border-[#c8860a]
        rounded-full w-6 h-6 inline-flex items-center justify-center
        text-sm
        shadow-[0_0_8px_rgba(200,134,10,0.6)]
      "
            >
              {selectedFromFarmCard?.playCost}
            </span>{" "}
            cartas para jogar esse monstro
          </DialogTitle>

          <DialogDescription
            className="
      font-['Cinzel'] text-[#7a5020] text-xs tracking-widest uppercase mt-1
    "
          >
            Selecione terrenos para exaurir
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Card preview + label */}
          <div className="flex items-start gap-5">
            <div className="flex flex-col items-center gap-2">
              <span className="font-['Cinzel'] text-[8px] text-[#c8860a] tracking-[0.2em] uppercase">
                Carta
              </span>
              <div
                className="
          rounded
          shadow-[0_0_16px_rgba(78,32,96,0.6),0_0_4px_rgba(78,32,96,0.4)]
          border border-[#5a2878]
        "
              >
                <GameCard
                  isCardOn="field"
                  card={selectedFarmCard}
                  cardTemplate={selectedFromFarmCard}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="w-px self-stretch bg-gradient-to-b from-transparent via-[#5a3408] to-transparent" />

            {/* Terrain zones */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-['Cinzel'] text-[8px] text-[#5aaa30] tracking-[0.2em] uppercase flex items-center gap-1">
                  <span className="text-[#1E6010]">✕</span> Farm
                </span>
                <div
                  className="
            bg-[rgba(8,14,5,0.7)]
            border border-[rgba(30,74,20,0.4)]
            rounded p-2
          "
                >
                  <Farm
                    exhaustingIds={exhaustingIds}
                    selectedHandCard={selectedFarmCard}
                    toggleExhaust={toggleExhaust}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-['Cinzel'] text-[8px] text-[#c8860a] tracking-[0.2em] uppercase flex items-center gap-1">
                  <span className="text-[#6a3c0c]">✕</span> Terrenos em Campo
                </span>
                <div
                  className="
            bg-[rgba(15,7,2,0.85)]
            border border-[rgba(80,40,8,0.45)]
            rounded p-2
          "
                >
                  <MyTerrainZone
                    exhaustingIds={exhaustingIds}
                    selectedHandCard={selectedFarmCard}
                    toggleExhaust={toggleExhaust}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div
            className="
      flex justify-end gap-3 pt-3
      border-t border-[#3a1e06]
    "
          >
            <DialogClose asChild>
              <button
                onClick={cancelPlay}
                className="
          font-['Cinzel'] text-[10px] tracking-[0.15em] uppercase
          text-[#7a5020] border border-[#4a2808]
          bg-[rgba(10,4,1,0.8)]
          px-4 py-2 rounded
          hover:text-[#c8860a] hover:border-[#7a4a10]
          transition-all duration-150
        "
              >
                Cancelar
              </button>
            </DialogClose>

            <button
              className="
          font-['Cinzel'] text-[10px] tracking-[0.15em] uppercase font-bold
          text-[#1a0802]
          bg-gradient-to-br from-[#d49010] to-[#b07008]
          px-5 py-2 rounded
          shadow-[0_0_12px_rgba(200,134,10,0.45)]
          hover:from-[#f4c430] hover:to-[#e8a020]
          hover:shadow-[0_0_20px_rgba(244,196,48,0.8)]
          transition-all duration-150
          disabled:opacity-40 disabled:cursor-not-allowed
        "
              onClick={confirmFarmPlay}
              disabled={
                exhaustingIds.length < (selectedFromFarmCard?.playCost ?? 0)
              }
            >
              Jogar Monstro ⚔
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPlayFromFarm;
