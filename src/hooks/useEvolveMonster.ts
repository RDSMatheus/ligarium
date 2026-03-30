import { cardTemplates } from "@/data/cardDatabase";
import socket from "@/socket";
import { useGameStore } from "@/store/gameStore";
import type { PlayerState } from "@/types";
import { evoMonsterStore } from "@/store/evoMonsterStore";
import type { CardInstance } from "@/types";
import { playMonsterStore } from "@/store/playMonsterStore";

export function useEvolveMonster() {
  const {
    selectedEvoCard,
    setSelectedEvoCard,
    setIsEvolvingMonsterInfo,
    isEvolvingMonsterInfo,
    selectedPreEvo,
    setSelectedPreEvo,
  } = evoMonsterStore();
  const { exhaustingIds, resetExhaustingIds, toggleExhaustingId } =
    playMonsterStore();
  const gameState = useGameStore((s) => s.gameState);
  const player = useGameStore((s) =>
    gameState?.playerStates.find((p) => s.playerId === p.playerId),
  );

  const canEvolveById: Record<
    string,
    {
      evolve: boolean;
      zone?: "mainZone" | "battleZone";
      materials?: {
        instanceId: string;
        templateId: string;
        zone: "mainZone" | "battleZone";
      }[];
    }
  > = {};
  if (player)
    player.hand.forEach(
      (c) => (canEvolveById[c.instanceId] = findEvolvingMaterial(c, player)),
    );

  function setEvolvingInfo(info: {
    evolve: boolean;
    zone?: "mainZone" | "battleZone";
    materials?: {
      instanceId: string;
      templateId: string;
      zone: "mainZone" | "battleZone";
    }[];
  }) {
    setIsEvolvingMonsterInfo(info);
  }

  function evolveMonsterFromHand({
    evoInstanceId,
    exaustedIds,
    gameId,
    preEvoInstanceId,
  }: {
    gameId: string;
    evoInstanceId: string;
    preEvoInstanceId: string;
    exaustedIds: string[];
  }) {
    socket.emit("action:evolve_monster", {
      evoInstanceId,
      exaustedIds,
      gameId,
      preEvoInstanceId,
    });
  }

  function toggleExhaust(cardInstanceId: string) {
    if (exhaustingIds.includes(cardInstanceId)) {
      toggleExhaustingId(cardInstanceId);
      return;
    }
    const cost =
      cardTemplates.find(
        (template) => template.id === selectedEvoCard?.templateId,
      )?.evoCost ?? 0;
    if (exhaustingIds.length >= cost) {
      return;
    }

    toggleExhaustingId(cardInstanceId);
  }

  function confirmEvolve() {
    if (!selectedEvoCard || !selectedPreEvo || !gameState) return;
    evolveMonsterFromHand({
      evoInstanceId: selectedEvoCard.instanceId,
      exaustedIds: exhaustingIds,
      gameId: gameState.id,
      preEvoInstanceId: selectedPreEvo,
    });
  }

  return {
    canEvolveById,
    selectedEvoCard,
    exhaustingIds,
    resetExhaustingIds,
    setSelectedEvoCard,
    toggleExhaust,
    setEvolvingInfo,
    isEvolvingMonsterInfo,
    selectedPreEvo,
    setSelectedPreEvo,
    confirmEvolve,
  };
}

function findEvolvingMaterial(
  card: CardInstance | null,
  player: PlayerState | undefined,
): {
  evolve: boolean;
  zone?: "mainZone" | "battleZone";
  materials?: {
    instanceId: string;
    templateId: string;
    zone: "mainZone" | "battleZone";
  }[];
} {
  if (!card) return { evolve: false };
  if (!player) return { evolve: false };

  const evoCardTemplate = cardTemplates.find(
    (template) => template.id === card.templateId,
  );

  const evolvesFrom = evoCardTemplate?.evolvesFrom;
  if (!evolvesFrom) return { evolve: false };

  const isOnMain = player.mainZone
    .filter((c) => c.templateId === evolvesFrom)
    .map(
      (
        c,
      ): {
        instanceId: string;
        zone: "mainZone" | "battleZone";
        templateId: string;
      } => ({
        instanceId: c.instanceId,
        templateId: c.templateId,
        zone: "mainZone",
      }),
    );
  const isOnBattle = player.battleZone
    .filter((c) => c.templateId === evolvesFrom)
    .map(
      (
        c,
      ): {
        instanceId: string;
        zone: "mainZone" | "battleZone";
        templateId: string;
      } => ({
        instanceId: c.instanceId,
        templateId: c.templateId,
        zone: "battleZone",
      }),
    );

  const materials = [...isOnMain, ...isOnBattle];

  const zone = isOnMain.length > 0 ? "mainZone" : "battleZone";

  if (materials.length === 0) return { evolve: false };

  return { evolve: true, zone, materials };
}
