import { useFastWindowStore } from "@/store/fastWindowStore";
import { useGameStore } from "@/store/gameStore";
import usePlayerState from "@/hooks/usePlayerState";
import { useGameSocket } from "@/hooks/useGameSocket";
import { GameCard } from "../card/GameCard";
import { cardTemplates } from "@/data/cardDatabase";
import { Button } from "@/components/ui/button";

export default function FastWindowDialog() {
  const activeTrigger = useFastWindowStore((s) => s.activeTrigger);
  const ps = usePlayerState();
  const { activateFast, passFast } = useGameSocket();

  if (!activeTrigger || !ps) return null;

  const availableCards = ps.meState.hand.filter((card) => {
    const template = cardTemplates.find((t) => t.id === card.templateId);
    return template?.effects?.some(
      (e) => e.speed === "fast" && e.fastTiming?.includes(activeTrigger),
    );
  });

  return (
    <div className="absolute z-50 bottom-40 left-1/2 -translate-x-1/2 bg-[#1a0a00] border border-[#f0d090] rounded p-4 flex flex-col gap-3 min-w-[200px]">
      <p className="font-['Cinzel'] text-[#f0d090] text-sm text-center">
        Janela de efeito rápido
      </p>

      <div className="flex gap-3 justify-center flex-wrap">
        {availableCards.map((card) => (
          <div
            key={card.instanceId}
            className="cursor-pointer hover:-translate-y-1 transition-transform"
            onClick={() => activateFast(card.instanceId)}
          >
            <GameCard
              card={card}
              cardTemplate={cardTemplates.find((c) => c.id === card.templateId)}
            />
          </div>
        ))}

        {availableCards.length === 0 && (
          <p className="text-xs text-[#7a5020] text-center">
            Sem efeitos disponíveis
          </p>
        )}
      </div>

      <Button variant="outline" onClick={passFast}>
        Passar
      </Button>
    </div>
  );
}
