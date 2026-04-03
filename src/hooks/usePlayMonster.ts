import { cardTemplates } from "@/data/cardDatabase";
import socket from "@/socket";
import { playMonsterStore } from "@/store/playMonsterStore";
import { useState } from "react";

export function usePlayMonster(gameId: string) {
  const {
    exhaustingIds,
    resetExhaustingIds,
    selectedHandCard,
    setExhaustingIds,
    setSelectedHandCard,
    toggleExhaustingId,
    selectedFarmCard,
    setSelectedFarmCard,
  } = playMonsterStore();

  const selectedFromHandCard = cardTemplates.find(
    (c) => c.id === selectedHandCard?.templateId,
  );

  const selectedFromFarmCard = cardTemplates.find(
    (c) => c.id === selectedFarmCard?.templateId,
  );

  function toggleExhaust(cardInstanceId: string) {
    if (exhaustingIds.includes(cardInstanceId)) {
      toggleExhaustingId(cardInstanceId);
      return;
    }
    const cost =
      selectedFromHandCard?.playCost ?? selectedFromFarmCard?.playCost ?? 0;
    if (exhaustingIds.length >= cost) {
      return;
    }

    toggleExhaustingId(cardInstanceId);
  }

  function playMonsterFromHand(cardInstanceId: string, exaustedIds: string[]) {
    socket.emit("action:play_monster_from_hand", {
      gameId,
      cardInstanceId,
      exaustedIds,
    });
  }

  function playMonsterFromFarm(cardInstanceId: string, exaustedIds: string[]) {
    socket.emit("action:play_monster_from_farm", {
      gameId,
      cardInstanceId,
      exaustedIds,
    });
  }

  function confirmFarmPlay() {
    if (!selectedFarmCard) return;
    playMonsterFromFarm(selectedFarmCard.instanceId, exhaustingIds);
    reset();
  }

  function confirmPlay() {
    if (!selectedHandCard) return;
    playMonsterFromHand(selectedHandCard.instanceId, exhaustingIds);
    reset();
  }

  function cancelPlay() {
    reset();
  }

  function reset() {
    setSelectedHandCard(null);
    setSelectedFarmCard(null);
    resetExhaustingIds();
  }

  const canConfirm =
    exhaustingIds.length >= (selectedFromHandCard?.playCost ?? 0);

  return {
    selectedHandCard,
    setSelectedHandCard,
    selectedFromHandCard,
    exhaustingIds,
    toggleExhaust,
    confirmPlay,
    cancelPlay,
    canConfirm,
    playMonsterFromHand,
    confirmFarmPlay,
    selectedFromFarmCard,
  };
}
