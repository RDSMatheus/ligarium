import { useGameStore } from "@/store/gameStore";
import type { GameState } from "@/types";
import { useEffect } from "react";
import Deck from "./deck/Deck";
import Farm from "./farm/Farm";
import socket from "@/socket";
import { BoardBackground } from "./board/BoardBackground";
import { PlayerPanel } from "./player/PlayerPanel";
import { TrashPile } from "./trash/TrashPile";
import { Eye, Mountain, SwordsIcon, Users } from "lucide-react";
import { ZoneLabel } from "./board/ZoneLabel";
import { GameCard } from "./card/GameCard";
import { cardTemplates } from "@/data/cardDatabase";
import { HiddenHand } from "./hand/HiddenHand";
import { MainZone } from "./board/MainZone";
import { BattleZone } from "./board/BattleZone";
import { PhaseBar } from "./board/PhaseBar";
import { PlayerHand } from "./hand/PlayerHand";
import TerrainDeck from "./terrain/TerrainDeck";
import OpponentFarm from "./farm/OpponentFarm";
import OpponentTerrain from "./terrain/OpponentTerrain";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import MyTerrainZone from "./terrain/MyTerrainZone";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useGameSocket } from "@/hooks/useGameSocket";
import { useGamePhases } from "@/hooks/useGamePhase";
import { usePlayMonster } from "@/hooks/usePlayMonster";
import { useBattle } from "@/hooks/useBattle";
import usePlayerState from "@/hooks/usePlayerState";
import ConfirmPlayFromHand from "./hand/ConfirmPlayFromHand";
import BattleDialog from "./battle/BattleDialog";
import BlockerDialog from "./battle/BlockerDialog";
import PendingOptionalEffectDialog from "./effect/PendingOptionalEffectDialog";
import FastWindowDialog from "./effect/FastWindowDialog";
import ConfirmPlayFromFarm from "./farm/ConfirmPlayFromFarm";
import ConfirmEvolveFromHand from "./hand/ConfirmEvolveFromHand";
import AttackedDialog from "./battle/AttackedDialog";
import FarmPhaseDialog from "./farm/FarmPhaseDialog";

// ------------------------------------------------------------
// Notas de organização do componente `Game`
// - Estrutura sugerida (para leitura):
//   1) Imports
//   2) Estado local / refs
//   3) useEffect (efeitos reativos)
//   4) Handlers / actions (funções que emitem via socket)
//   5) Listeners (socket.on)
//   6) Render (JSX)
// - Observação: nenhuma linha de código existente foi alterada,
//   apenas adicionei comentários e cabeçalhos para organizar.
// ------------------------------------------------------------

const Game = () => {
  const player = useGameStore((s) => s.playerId);
  const gameState = useGameStore((s) => s.gameState);

  useEffect(() => {
    function handleUpdate(res: GameState) {
      if (!res) {
        console.log("gameState veio undefined");
        return;
      }

      const myPlayerId = useGameStore.getState().playerId;

      const iAmAttacker = res.battle?.attackerPlayerId === myPlayerId;

      if (res.battle?.step === "damage" && iAmAttacker) {
        socket.emit("action:resolve_battle", { gameId: res.id });
      }

      if (res.battle?.step === "cleanup" && iAmAttacker) {
        socket.emit("action:cleanup", { gameId: res.id });
      }

      useGameStore.getState().setGameState(res);
    }
    socket.on("game:update", handleUpdate);
    return () => {
      socket.off("game:update", handleUpdate);
    };
  }, []);

  const {
    exhaustingIds,
    selectedFromHandCard,
    selectedHandCard,
    toggleExhaust,
    setSelectedHandCard,
  } = usePlayMonster(gameState?.id ?? "");

  const {
    endTurn,
    drawPhase,
    farmAction,
    moveMonsterToBattle,
    declareAttack,
    declareBlock,
  } = useGameSocket();

  const { isMainPhase } = useGamePhases({
    gameState,
    player,
    drawPhase,
    refreshPhase: () =>
      socket.emit("action:refresh", { gameId: gameState?.id }),
  });

  useEffect(() => {
    const handlePrompt = (res: any) => {
      console.log("game:prompt_attacked:", res);
    };
    socket.on("game:prompt_attacked", handlePrompt);
    console.log("gameState atualizado:", gameState);
    return () => {
      socket.off("game:prompt_attacked", handlePrompt);
    };
  }, [gameState]);

  const { isDeclaringAttack, showBlockPrompt, selectAttacker } = useBattle();

  const playerState = usePlayerState();
  if (!playerState || !gameState) return null;

  const { me, meState, opp, oppState } = playerState;

  return (
    <div
      className="relative w-full h-dvh overflow-hidden"
      style={{
        fontFamily: "Cinzel,Georgia,serif",
        // Fundo de madeira — 4 camadas inline, funciona em qualquer container
        background: `
          radial-gradient(ellipse 90% 90% at 50% 50%, rgba(0,0,0,0.18) 30%, rgba(6,2,0,0.72) 100%),
          repeating-linear-gradient(176deg, transparent 0px, transparent 90px, rgba(0,0,0,0.04) 90px, rgba(0,0,0,0.04) 91px),
          repeating-linear-gradient(90.8deg, transparent 0px, transparent 28px, rgba(0,0,0,0.06) 28px, rgba(0,0,0,0.06) 29px),
          linear-gradient(162deg, #8B4A1A 0%, #A35C22 8%, #7A3C10 18%, #C07030 28%, #8B4A1A 38%, #A35C22 48%, #7A3C10 58%, #B06828 68%, #8B4A1A 78%, #9A5220 88%, #7A3C10 100%)
        `,
      }}
    >
      {/* Importa fontes + RPG Awesome */}
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/rpg-awesome@0.2.0/css/rpg-awesome.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&display=swap');
      `}</style>

      {/* Moldura tripla + ornamentos nos cantos */}
      <BoardBackground />

      {/* ════════════════════════════════════════════════════
          GRID PRINCIPAL
      ════════════════════════════════════════════════════ */}
      <div className="relative z-10 h-screen px-5 py-3 gap-2 overflow-hidden">
        {/* ── LINHA 1: Oponente — info + utilidades ─────────── */}
        <div className="grid grid-cols-[1fr_3fr_1fr] items-end justify-between gap-4 shrink-0">
          {/* Player panel do oponente */}
          <div className="grid gap-4">
            <PlayerPanel playerField={oppState} playerInfo={opp} isOpponent />
            <div className="flex flex-col gap-2">
              <Deck isOpponent />
              <TrashPile trash={oppState.trash} small />
            </div>
          </div>
          {/* Utilidades: Deck + Trash */}
          <div className="grid  justify-center h-full grid-cols-3 grid-rows-[auto_1fr]">
            <div className=" col-span-full justify-center flex">
              <HiddenHand count={oppState.hand.length} />
              <ZoneLabel Icon={Users} text={`Hand ${oppState.hand.length}`} />
            </div>
            <div className=" col-span-2">
              <OpponentFarm />
            </div>
          </div>
          <div>
            {/* Terrain + Revealed */}
            <div className="flex items-end gap-2.5">
              <OpponentTerrain />
            </div>
          </div>

          {/* Farm */}
        </div>
        {/* ── LINHA 2: Main Zone — Oponente ─────────────────── */}
        <MainZone label="Main Zone — Oponente" Icon={Mountain}>
          {oppState.mainZone.map((card, i) => (
            <GameCard
              key={card?.instanceId ?? i}
              card={card}
              cardTemplate={
                cardTemplates.filter((c) => card.templateId === c.id)[0]
              }
              //   onClick={card ? () => toggle(card.id) : undefined}
            />
          ))}
        </MainZone>

        {/* ── LINHA 3: Battle Zone — full-width ─────────────── */}
        <BattleZone
          opponentSlots={oppState.battleZone.map((card, i) => (
            <GameCard
              key={card?.instanceId ?? i}
              card={card}
              cardTemplate={cardTemplates.find((c) => c.id === card.templateId)}
            />
          ))}
          playerSlots={meState.battleZone.map((card, i) => (
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  key={card.instanceId}
                  className={`transition-all duration-200
    ${
      showBlockPrompt && !card.exhausted
        ? "cursor-pointer ring-2 ring-[#4A90D9] hover:-translate-y-1"
        : ""
    }
    ${card.exhausted ? "opacity-50" : ""}
  `}
                >
                  <GameCard
                    key={card?.instanceId ?? i}
                    card={card}
                    cardTemplate={cardTemplates.find(
                      (c) => c.id === card.templateId,
                    )}
                  />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => selectAttacker(card)}>
                  <SwordsIcon />
                  Atacar
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        />
        {/* ── LINHA 4: Main Zone — Jogador ──────────────────── */}
        <MainZone label="Main Zone" Icon={Mountain}>
          {meState.mainZone.map((card, i) => (
            <div
              onClick={() => {
                if (isMainPhase) moveMonsterToBattle(card.instanceId);
              }}
            >
              <GameCard
                key={card?.instanceId ?? i}
                card={card}
                cardTemplate={
                  cardTemplates.filter((c) => c.id === card.templateId)[0]
                }
              />
            </div>
          ))}
        </MainZone>
        {/* ── LINHA 5: PhaseBar ─────────────────────────────── */}
        <PhaseBar phase={gameState.currentPhase} turn={gameState.turnNumber} />
        {/* ── LINHA 6: Utilidades do jogador ────────────────── */}
        <div className="grid grid-cols-[1fr_3fr_1fr] items-end justify-between gap-4 shrink-0">
          {/* Player panel do oponente */}
          <div>
            {/* Terrain + Revealed */}
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
          {/* Utilidades: Deck + Trash */}
          <div className="grid  justify-center h-full grid-cols-3 grid-rows-[auto_1fr]">
            <div className="row-2 col-span-full justify-center flex">
              {meState.hand && (
                <>
                  <PlayerHand cards={meState.hand} state={meState} />
                  <ZoneLabel
                    Icon={Users}
                    text={`Hand ${meState.hand.length}`}
                  />
                </>
              )}
            </div>
            <div className="col-start-2 col-span-2">
              <Farm
                exhaustingIds={exhaustingIds}
                selectedHandCard={selectedHandCard}
                toggleExhaust={toggleExhaust}
              />
            </div>
          </div>

          <div className="grid gap-4">
            <PlayerPanel
              isOpponent={false}
              playerField={meState}
              playerInfo={me}
              isCurrentTurn={gameState.currentPlayerId === player}
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

          <BattleDialog />
          {isDeclaringAttack && (
            <Dialog
              open={selectedHandCard ? true : false}
              onOpenChange={(open) => {
                if (!open) setSelectedHandCard(null);
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
                      {selectedFromHandCard?.playCost}
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
                          card={selectedHandCard}
                          cardTemplate={selectedFromHandCard}
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
                            selectedHandCard={selectedHandCard}
                            toggleExhaust={toggleExhaust}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="font-['Cinzel'] text-[8px] text-[#c8860a] tracking-[0.2em] uppercase flex items-center gap-1">
                          <span className="text-[#6a3c0c]">✕</span> Terrenos em
                          Campo
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
                            selectedHandCard={selectedHandCard}
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
                        // onClick={cancelPlay}
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
                      // onClick={confirmPlayMonster}
                      disabled={
                        exhaustingIds.length <
                        (selectedFromHandCard?.playCost ?? 0)
                      }
                    >
                      Jogar Monstro ⚔
                    </button>
                  </div>
                </div>

                {/* amber corner accents */}
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
          )}

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
    </div>
  );
};

export default Game;
