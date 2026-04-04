import React from "react";
import { PlayerPanel } from "../player/PlayerPanel";
import Deck from "../deck/Deck";
import { TrashPile } from "../trash/TrashPile";
import { HiddenHand } from "../hand/HiddenHand";
import { ZoneLabel } from "../board/ZoneLabel";
import { Eye, Users } from "lucide-react";
import InfoCard from "../board/InfoCard";
import { PhaseBar } from "../board/PhaseBar";
import TerrainDeck from "../terrain/TerrainDeck";
import { GameCard } from "../card/GameCard";
import { PlayerHand } from "../hand/PlayerHand";
import Farm from "../farm/Farm";
import ConfirmPlayFromHand from "../hand/ConfirmPlayFromHand";
import BattleDialog from "../battle/BattleDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MyTerrainZone from "../terrain/MyTerrainZone";
import ConfirmPlayFromFarm from "../farm/ConfirmPlayFromFarm";
import BlockerDialog from "../battle/BlockerDialog";
import PendingOptionalEffectDialog from "../effect/PendingOptionalEffectDialog";
import FastWindowDialog from "../effect/FastWindowDialog";
import ConfirmEvolveFromHand from "../hand/ConfirmEvolveFromHand";
import AttackedDialog from "../battle/AttackedDialog";
import FarmPhaseDialog from "../farm/FarmPhaseDialog";
import type { GameState, PlayerState } from "@/types";
import { usePlayMonster } from "@/hooks/usePlayMonster";
import { useBattle } from "@/hooks/useBattle";
import type { Player } from "@/store/gameStore";
import { useGameSocket } from "@/hooks/useGameSocket";
import { useGamePhases } from "@/hooks/useGamePhase";
import socket from "@/socket";

const UiLayer = ({
  gameState,
  playerState,
}: {
  gameState: GameState;
  playerState: {
    opp: Player;
    oppState: PlayerState;
    me: Player;
    meState: PlayerState;
  };
}) => {
  const {
    exhaustingIds,
    selectedFromHandCard,
    selectedHandCard,
    toggleExhaust,
    setSelectedHandCard,
  } = usePlayMonster(gameState.id);
  const { isDeclaringAttack } = useBattle();
  const { me, meState, opp, oppState } = playerState;
  const { endTurn, drawPhase } = useGameSocket();
  const { isMainPhase } = useGamePhases({
    gameState,
    player: me.playerId,
    drawPhase,
    refreshPhase: () =>
      socket.emit("action:refresh", { gameId: gameState?.id }),
  });

  return (
    <div className="absolute inset-0 z-30 w-full h-full pointer-events-none">
      <div className="grid grid-cols-[1fr_1fr_1fr] items-end justify-between gap-4 shrink-0">
        <div className="grid gap-4" style={{ transform: "none" }}>
          <PlayerPanel playerField={oppState} playerInfo={opp} isOpponent />
          <div className="flex flex-col gap-2">
            <Deck isOpponent />
            <TrashPile trash={oppState.trash} small />
          </div>
        </div>

        <div className="grid  justify-center h-full grid-cols-3 grid-rows-[auto_1fr]">
          <div className=" col-span-full justify-center flex">
            <HiddenHand count={oppState.hand.length} />
            <ZoneLabel Icon={Users} text={`Hand ${oppState.hand.length}`} />
          </div>
        </div>

        <div>
          <div className="flex items-end gap-2.5">
            {/* right UI column: keep empty or additional UI */}
          </div>
        </div>
      </div>
      <div className="fixed left-10 top-1/6">
        <InfoCard />
      </div>
      {/* InfoCard + dialogs + central UI (flat) */}

      <PhaseBar phase={gameState.currentPhase} turn={gameState.turnNumber} />

      <div className="grid grid-cols-[1fr_3fr_1fr] items-end justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-end gap-2.5">
            <TerrainDeck
              exhaustingIds={exhaustingIds}
              selectedHandCard={selectedHandCard}
              toggleExhaust={toggleExhaust}
            />
            <div>
              <ZoneLabel Icon={Eye} text="Revealed" />
              <div className="flex gap-1.5">
                {meState.terrainsZone.map((card, i) => (
                  <GameCard key={card?.instanceId ?? i} card={card} small />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid  justify-center h-full grid-cols-3 grid-rows-[auto_1fr]">
          <div className="row-2 col-span-full justify-center flex pointer-events-auto">
            {meState.hand && (
              <>
                <PlayerHand cards={meState.hand} />
                <ZoneLabel Icon={Users} text={`Hand ${meState.hand.length}`} />
              </>
            )}
          </div>
        </div>

        <div
          className="grid gap-4 pointer-events-auto"
          style={{ transform: "none" }}
        >
          <PlayerPanel
            isOpponent={false}
            playerField={meState}
            playerInfo={me}
            isCurrentTurn={gameState.currentPlayerId === me.playerId}
            endTurn={endTurn}
          />
          <div className="flex flex-col gap-2">
            <Deck isOpponent={false} />
            <TrashPile trash={meState.trash} small />
          </div>
        </div>
        {selectedHandCard && isMainPhase && (
          <ConfirmPlayFromHand gameId={gameState.id} />
        )}

        {/* dialogs and effect windows (UI) */}
        <BattleDialog />

        {isDeclaringAttack && (
          <div className="flex gap-2 mt-2 absolute">
            <button
              className="font-bold tracking-widest text-[#3D1F08] text-[11px]
        px-4 py-2 rounded-lg border border-[#C8900A]"
              style={{
                fontFamily: "Cinzel,Georgia,serif",
                background: "linear-gradient(135deg,#F0B830,#C8900A)",
                boxShadow: "0 0 14px rgba(200,144,10,0.45)",
              }}
            >
              Atacar
            </button>
          </div>
        )}
        <ConfirmPlayFromFarm gameId={gameState.id} />
        <BlockerDialog />
        <PendingOptionalEffectDialog />
        <FastWindowDialog />
        <ConfirmEvolveFromHand />
        <AttackedDialog />
        <FarmPhaseDialog />
      </div>
    </div>
  );
};

export default UiLayer;
