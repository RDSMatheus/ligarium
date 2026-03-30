import CarvedFrame from "@/components/CarvedFrame";
import { Button } from "@/components/ui/button";
import WoodBg from "@/components/WoodBg";
import socket from "@/socket";
import { useGameStore, type RoomType } from "@/store/gameStore";
import { useEffect } from "react";
import PlayerSlot from "./PlayerSlot";
import EmptySlot from "./EmptySlot";
import VsDivider from "./VsDivider";
import RoomInfoBar from "./RoomInfoBar";
import CountDown from "./CountDown";

const Room = () => {
  const room = useGameStore((s) => s.room);
  const gameState = useGameStore((s) => s.gameState);
  const screen = useGameStore((s) => s.screen);
  const playerId = useGameStore((s) => s.playerId);
  const me = room && room.players.find((p) => p.playerId === playerId);
  const opp = room && room.players.find((p) => p.playerId !== playerId);

  useEffect(() => {
    function handleRoomUpdate(res: RoomType) {
      console.log("room_update:", res);
      useGameStore.getState().setRoom(res);
      useGameStore.getState().setScreen("room");
    }

    socket.on("room_update", handleRoomUpdate);

    return () => {
      socket.off("room_update", handleRoomUpdate);
    };
  }, []);

  useEffect(() => {
    function handleGameStart(res: any) {
      console.log("Jogo atualizado: ", res);
      useGameStore.getState().setGameState(res.gameState);
      useGameStore.getState().setScreen("game");
      setTimeout(() => {
        console.log(
          "screen após game_started:",
          useGameStore.getState().screen,
        );
      }, 0);
    }
    socket.on("game_started", handleGameStart);
    return () => {
      socket.off("game_started", handleGameStart);
    };
  }, []);

  function startGame() {
    console.log("room no momento do clique:", screen);
    if (!room) return;
    console.log("room: ", room);
    socket.emit("start_game", { gameId: room.gameId }, (res: any) => {
      console.log("Jogo iniciado: ", res);
    });
  }

  function handleReady() {
    socket.emit(
      "player_ready",
      { playerId, roomId: room?.gameId },
      (res: any) => {
        console.log(res);
      },
    );
  }

  console.log(room);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-cinzel">
      <WoodBg />
      <CarvedFrame />
      <div className="relative z-10 w-full max-w-[820px] px-5 pt-6 pb-9 flex flex-col items-center">
        {/* TÍTULO */}
        <div className="text-center mb-[22px] select-none">
          <p className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-[rgba(200,144,10,0.65)] mb-1.5">
            ✦ &nbsp; Vale das Montanhas Krakrish &nbsp; ✦
          </p>
          <h1
            className="m-0 font-display font-bold text-[clamp(26px,4vw,40px)] text-[#FFF3D8] tracking-[0.05em] leading-[1.1]"
            style={{
              textShadow:
                "0 0 20px rgba(200,144,10,0.85), 0 0 50px rgba(200,144,10,0.4), 0 3px 8px rgba(0,0,0,0.95)",
            }}
          >
            Ligarium Monsters
          </h1>
          <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-[3px] rounded-sm border border-[rgba(200,144,10,0.2)] bg-[rgba(24,10,2,0.6)] font-cinzel text-[9px] tracking-[0.2em] uppercase text-[#C4956A]">
            {/* <Icon name="hourglass" size="xs" color="dim" /> */}
            Sala de Preparação
          </div>
        </div>

        {/* BARRA DA SALA */}
        {room && (
          <RoomInfoBar roomName={room.roomName} roomCode={room.gameId} />
        )}

        {/* ARENA */}
        <div
          className="flex items-stretch w-full rounded-[10px] p-5 backdrop-blur-sm border border-[rgba(200,144,10,0.18)] bg-[rgba(12,5,1,0.5)]"
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,0.6), 0 12px 40px rgba(0,0,0,0.7)",
          }}
        >
          {me ? (
            <PlayerSlot player={me} isMe={true} handleReady={handleReady} />
          ) : (
            <EmptySlot side="tengu" />
          )}

          <VsDivider bothReady={me?.isReady && opp?.isReady} />

          {opp ? (
            <PlayerSlot player={opp} isMe={false} handleReady={handleReady} />
          ) : (
            <EmptySlot side="terrones" />
          )}
        </div>

        {me && opp && (
          <CountDown
            bothReady={me?.isReady && opp?.isReady}
            onStart={startGame}
          />
        )}
      </div>
    </div>
  );
};

export default Room;
