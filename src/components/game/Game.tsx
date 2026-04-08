import { useGameStore } from "@/store/gameStore";
import type { GameState } from "@/types";
import { useEffect } from "react";
import Deck from "./deck/Deck";
import Farm from "./farm/Farm";
import socket from "@/socket";
import { BoardBackground } from "./board/BoardBackground";
import { PlayerPanel } from "./player/PlayerPanel";
import { TrashPile } from "./trash/TrashPile";
import { Eye, Mountain, Users } from "lucide-react";
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
} from "../ui/dialog";
import MyTerrainZone from "./terrain/MyTerrainZone";
// context-menu imports removed (unused)
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
import InfoCard from "./board/InfoCard";
import UiLayer from "./layout/UiLayer";
import { BASE_HEIGHT, BASE_WIDTH, useGameScale } from "@/hooks/useGameScale";

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
  const scale = useGameScale();

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

  const { drawPhase, moveMonsterToBattle } = useGameSocket();
  const {
    exhaustingIds,
    selectedFromHandCard,
    selectedHandCard,
    toggleExhaust,
    setSelectedHandCard,
  } = usePlayMonster(gameState?.id ?? "");

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

  const playerState = usePlayerState();
  if (!playerState || !gameState) return null;

  const { meState, oppState } = playerState;

  return (
    <div
      className="relative  w-full min-h-dvh overflow-visible"
      style={{
        fontFamily: "Cinzel,Georgia,serif",
        background: `
          radial-gradient(ellipse 90% 90% at 50% 50%, rgba(0,0,0,0.18) 30%, rgba(6,2,0,0.72) 100%),
          repeating-linear-gradient(176deg, transparent 0px, transparent 90px, rgba(0,0,0,0.04) 90px, rgba(0,0,0,0.04) 91px),
          repeating-linear-gradient(90.8deg, transparent 0px, transparent 28px, rgba(0,0,0,0.06) 28px, rgba(0,0,0,0.06) 29px),
          linear-gradient(162deg, #8B4A1A 0%, #A35C22 8%, #7A3C10 18%, #C07030 28%, #8B4A1A 38%, #A35C22 48%, #7A3C10 58%, #B06828 68%, #8B4A1A 78%, #9A5220 88%, #7A3C10 100%)
        `,
      }}
    >
      {/* Moldura tripla + ornamentos nos cantos */}
      <BoardBackground />
      {/*
        Layout split into two layers:
        - Board Layer (3D): only the central board components are rendered here
        - UI Layer (2D overlay): InfoCard, PlayerPanel, dialogs, and other UI remain flat
      */}
      <div>
        <div className="relative bg-red-400 z-10  h-dvh px-5 py-3 gap-2">
          {/* Board layer: centered and with perspective */}
          {/*
          O que faz a "board" virar (efeito 3D):
          - O contêiner externo aplica `perspective` (a distância virtual da câmera),
            isto define como as transformações 3D dos filhos serão projetadas.
          - O filho interno usa `transform: rotateX(12deg)` para inclinar a cena;
            combinado com `transformStyle: 'preserve-3d'` faz com que os elementos
            filhos sejam renderizados em 3D (não achatados).
          - `perspectiveOrigin: '50% 100%'` ajusta o ponto de fuga (olhar do jogador).
        */}
          <div
            className="h-1/5 mt-70"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                perspective: "1400px",
                perspectiveOrigin: "50% 150%",
                position: "relative",
                zIndex: 10,
              }}
            >
              {/* container inclinação: aplica a rotação 3D à cena do tabuleiro */}
              <div
                style={{
                  transform: "rotateX(12deg)",
                  transformStyle: "preserve-3d",
                  transformOrigin: "50% 100%",
                }}
              >
                {/* Top area: opponent farm + opponent terrain */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-end justify-between gap-4">
                  <div className="col-start-2 flex justify-center gap-2">
                    <OpponentFarm />
                    <OpponentTerrain />
                  </div>
                </div>

                {/* Central board grid (tilted) */}
                <div className="grid grid-cols-[1fr_auto_1fr] grid-rows-3">
                  <div className="col-start-2 row-start-1">
                    <MainZone label="Main Zone — Oponente" Icon={Mountain}>
                      {oppState.mainZone.map((card, i) => (
                        <GameCard
                          isCardOn="field"
                          key={card?.instanceId ?? i}
                          card={card}
                          cardTemplate={
                            cardTemplates.filter(
                              (c) => card.templateId === c.id,
                            )[0]
                          }
                        />
                      ))}
                    </MainZone>
                  </div>

                  <div className="col-start-2 row-start-2">
                    <BattleZone />
                  </div>

                  <div className="col-start-2 row-start-3">
                    <MainZone label="Main Zone" Icon={Mountain}>
                      {meState.mainZone.map((card, i) => (
                        <div
                          onClick={() => {
                            if (isMainPhase)
                              moveMonsterToBattle(card.instanceId);
                          }}
                          key={card?.instanceId ?? i}
                        >
                          <GameCard
                            isCardOn="field"
                            card={card}
                            cardTemplate={
                              cardTemplates.filter(
                                (c) => c.id === card.templateId,
                              )[0]
                            }
                          />
                        </div>
                      ))}
                    </MainZone>
                  </div>
                  <div className="col-start-2 flex gap-2 relative z-50 col-span-2">
                    <TerrainDeck
                      exhaustingIds={exhaustingIds}
                      selectedHandCard={selectedHandCard}
                      toggleExhaust={toggleExhaust}
                    />
                    <Farm
                      exhaustingIds={exhaustingIds}
                      selectedHandCard={selectedHandCard}
                      toggleExhaust={toggleExhaust}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* UI layer: absolute overlay, pointer-events none by default */}
          {/*
          O que faz o UI "flutuar" (permanecer plano sobre o tabuleiro):
          - Este wrapper é `position: absolute; inset: 0` e fica acima do board
            via `z-30`, por isso tudo dentro dele é renderizado em tela (2D).
          - `pointer-events: none` no wrapper evita que a camada capture eventos
            enquanto permite que elementos marcados com `pointer-events-auto`
            continuem interativos (botões, inputs, etc.).
          - Como este overlay está fora do contexto com `perspective/rotateX`,
            seus filhos permanecem planos e legíveis (não são inclinados).
        */}
          <UiLayer
            gameState={gameState}
            isMainPhase={isMainPhase}
            playerState={playerState}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
