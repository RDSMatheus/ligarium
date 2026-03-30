import { useEffect } from "react";
import socket from "@/socket";
import { useGameStore } from "@/store/gameStore";
import { EVENTS } from "@/protocol";

// Hook que instala listeners globais do socket e atualiza a store central.
export function useSocketBridge() {
  const setRooms = useGameStore((s) => s.setRooms);
  const setRoom = useGameStore((s) => s.setRoom);
  const setRoomId = useGameStore((s) => s.setRoomId);
  const setPlayerId = useGameStore((s) => s.setPlayerId);
  const setGameState = useGameStore((s) => s.setGameState);
  const setPendingOptionalEffect = useGameStore(
    (s) => s.setPendingOptionalEffect,
  );
  const setScreen = useGameStore((s) => s.setScreen);

  useEffect(() => {
    function handleRoomsUpdated(payload: any) {
      if (payload?.ok && payload.rooms) setRooms(payload.rooms);
      else console.warn("rooms_updated payload error:", payload?.error);
    }

    function handleRoomUpdate(payload: any) {
      setRoom(payload);
      if (payload?.gameId) setRoomId(payload.gameId);
      setScreen("room");
    }

    function handleGameStarted(payload: any) {
      setGameState(payload?.gameState ?? null);
      setScreen("game");
    }

    function handleGameUpdate(payload: any) {
      setGameState(payload ?? null);
    }

    function handlePending(payload: any) {
      setPendingOptionalEffect(payload?.effect ?? null);
    }

    socket.on(EVENTS.ROOMS_UPDATED, handleRoomsUpdated);
    socket.on(EVENTS.ROOM_UPDATE, handleRoomUpdate);
    socket.on(EVENTS.GAME_STARTED, handleGameStarted);
    socket.on(EVENTS.GAME_UPDATE, handleGameUpdate);
    socket.on(EVENTS.GAME_PENDING_OPTIONAL_EFFECT, handlePending);

    socket.on("connect_error", (err) => {
      console.error("[socket bridge] connect_error", err);
    });

    socket.on("disconnect", (reason) => {
      console.warn("[socket bridge] disconnected", reason);
    });

    return () => {
      socket.off(EVENTS.ROOMS_UPDATED, handleRoomsUpdated);
      socket.off(EVENTS.ROOM_UPDATE, handleRoomUpdate);
      socket.off(EVENTS.GAME_STARTED, handleGameStarted);
      socket.off(EVENTS.GAME_UPDATE, handleGameUpdate);
      socket.off(EVENTS.GAME_PENDING_OPTIONAL_EFFECT, handlePending);
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, [
    setRooms,
    setRoom,
    setScreen,
    setRoomId,
    setPlayerId,
    setGameState,
    setPendingOptionalEffect,
  ]);
}

export default useSocketBridge;
