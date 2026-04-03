import { getTemplate } from "@/data/cardDatabase";
import usePlayerState from "./usePlayerState";
import type { Player } from "@/store/gameStore";
import type { PlayerState } from "@/types";

export function usePassive() {
  const ps = usePlayerState();

  const hasTaunt = ps && hasTauntHelper(ps);

  return {
    hasTaunt,
  };
}
const hasTauntHelper = (ps: {
  opp: Player;
  oppState: PlayerState;
  me: Player;
  meState: PlayerState;
}) => {
  if (!ps) return null;
  return ps.oppState.battleZone.filter((c) =>
    getTemplate(c.templateId)?.effects?.some(
      (effect) => c.exhausted && effect.action === "taunt_while_exhausted",
    ),
  );
};
