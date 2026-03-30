import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEvolveMonster } from "@/hooks/useEvolveMonster";
import { cardTemplates } from "@/data/cardDatabase";
import React from "react";
import { GameCard } from "../card/GameCard";
import Farm from "../farm/Farm";
import MyTerrainZone from "../terrain/MyTerrainZone";
import SelectPreEvoFromBattleOrMain from "./confirmEvoContent/SelectPreEvoFromBattleOrMain";
import ExhaustCard from "./confirmEvoContent/ExhaustCard";

const ConfirmEvolveFromHand = () => {
  const {
    canEvolveById,
    selectedEvoCard,
    exhaustingIds,
    resetExhaustingIds,
    setSelectedEvoCard,
    toggleExhaust,
    selectedPreEvo,
  } = useEvolveMonster();

  const selectedEvoTemplate = cardTemplates.find(
    (c) => c.id === selectedEvoCard?.templateId,
  );

  console.log("carta para evoluir: ", selectedEvoCard);

  if (selectedEvoCard)
    return (
      <Dialog
        open={selectedEvoCard ? true : false}
        onOpenChange={(open) => {
          if (!open) setSelectedEvoCard(null);
        }}
      >
        {selectedPreEvo ? <ExhaustCard /> : <SelectPreEvoFromBattleOrMain />}
      </Dialog>
    );
};

export default ConfirmEvolveFromHand;
