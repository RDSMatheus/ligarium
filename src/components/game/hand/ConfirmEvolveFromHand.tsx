import { Dialog } from "@/components/ui/dialog";
import { useEvolveMonster } from "@/hooks/useEvolveMonster";
import { cardTemplates } from "@/data/cardDatabase";
import SelectPreEvoFromBattleOrMain from "./confirmEvoContent/SelectPreEvoFromBattleOrMain";
import ExhaustCard from "./confirmEvoContent/ExhaustCard";

const ConfirmEvolveFromHand = () => {
  const {
    selectedEvoCard,

    setSelectedEvoCard,

    selectedPreEvo,
  } = useEvolveMonster();

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
