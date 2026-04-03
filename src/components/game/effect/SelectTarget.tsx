import { usePendingEffect } from "@/hooks/usePendingEffect";
import { GameCard } from "../card/GameCard";
import { cardTemplates } from "@/data/cardDatabase";

const SelectTarget = () => {
  const effect = usePendingEffect();
  if (!effect) return null;
  const { effectTarget, setEffectTarget, selectableCards } = effect;
  return (
    <div className="bg-amber-800">
      <div className="mb-2 font-bold">Alvos</div>
      <div className="flex gap-3 flex-wrap">
        {selectableCards.map(({ card, zoneLabel }) => (
          <div
            key={card.instanceId}
            className={`cursor-pointer ${effectTarget?.instanceId === card.instanceId ? "ring-2 ring-[#4A90D9] -translate-y-1" : ""}`}
            onClick={() => setEffectTarget(card)}
          >
            <div className="text-xs text-yellow-200">{zoneLabel}</div>
            <GameCard
              card={card}
              cardTemplate={cardTemplates.find((c) => c.id === card.templateId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectTarget;
