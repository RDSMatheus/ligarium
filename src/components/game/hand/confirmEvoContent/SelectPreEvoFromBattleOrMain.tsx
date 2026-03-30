import { DialogContent } from "@/components/ui/dialog";
import { cardTemplates } from "@/data/cardDatabase";
import { useEvolveMonster } from "@/hooks/useEvolveMonster";
import React from "react";

const SelectPreEvoFromBattleOrMain = () => {
  const { isEvolvingMonsterInfo, setEvolvingInfo, setSelectedPreEvo } =
    useEvolveMonster();
  if (!isEvolvingMonsterInfo?.evolve) return null;
  const { materials } = isEvolvingMonsterInfo;

  return (
    <DialogContent
      className="
         z-50 flex items-center justify-center
        bg-[rgba(0,0,0,0.6)]
      "
    >
      <div
        className="
 
          bg-[rgba(18,8,2,0.97)]
          border border-[#7a4a10]
          shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(120,60,10,0.4),inset_0_0_30px_rgba(0,0,0,0.5)]
          rounded-md
          w-full max-w-md
          p-0
          overflow-hidden
          [background-image:repeating-linear-gradient(180deg,rgba(0,0,0,0.25)_0px,transparent_1px,transparent_22px,rgba(0,0,0,0.15)_23px)]
        "
      >
        {/* Header */}
        <div
          className="
            px-6 pt-5 pb-4
            border-b border-[#5a3408]
            bg-[rgba(10,4,1,0.6)]
          "
        >
          <p
            className="
              font-['Cinzel'] text-[#f0d090] tracking-[0.15em] text-base font-bold uppercase
              drop-shadow-[0_0_8px_rgba(210,140,20,0.5)]
              flex items-center gap-3
            "
          >
            <span className="text-[#c8860a] text-lg">⚔</span>
            Escolha o monstro base
          </p>
          <p
            className="
              font-['Cinzel'] text-[#7a5020] text-xs tracking-widest uppercase mt-1
            "
          >
            Selecione qual instância irá evoluir
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-3">
          {materials &&
            materials.map((card) => {
              const template = cardTemplates.find(
                (c) => c.id === card.templateId,
              );
              return (
                <button
                  onClick={() => setSelectedPreEvo(card.instanceId)}
                  key={card.instanceId}
                  className="
                    flex items-center justify-between
                    font-['Cinzel'] text-[10px] tracking-[0.1em] uppercase
                    text-[#f0d090]
                    border border-[#5a3408]
                    bg-[rgba(10,4,1,0.8)]
                    px-4 py-3 rounded
                    hover:border-[#c8860a] hover:text-[#f4c430]
                    hover:shadow-[0_0_10px_rgba(200,134,10,0.3)]
                    transition-all duration-150
                  "
                >
                  <span>{template?.name ?? card.instanceId}</span>
                  <span
                    className="
                      text-[#c8860a]
                      border border-[#5a3408]
                      rounded px-2 py-0.5
                      text-[9px]
                    "
                  >
                    {card.zone === "mainZone" ? "Campo" : "Batalha"}
                  </span>
                </button>
              );
            })}
        </div>

        {/* Footer */}
        <div
          className="
            flex justify-end px-6 pb-5
            border-t border-[#3a1e06] pt-3
          "
        >
          <button
            onClick={() => setEvolvingInfo({ evolve: false })}
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
        </div>

        {/* Corner accents */}
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
      </div>
    </DialogContent>
  );
};

export default SelectPreEvoFromBattleOrMain;
