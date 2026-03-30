import React, { useEffect } from "react";
import { Button } from "../ui/button";
import socket from "@/socket";
import { useGameStore, type RoomT, type RoomType } from "@/store/gameStore";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Room from "./room/Room";
import WoodBg from "../WoodBg";
import CarvedFrame from "../CarvedFrame";
import CreateRoom from "./CreateRoom";
import RoomsPanel from "./RoomsPanel";
import Header from "./Header";

const Lobby = () => {
  const roomId = useGameStore((s) => s.roomId);
  const screen = useGameStore().screen;
  const name = useGameStore((s) => s.userName);
  const rooms = useGameStore((s) => s.rooms);

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
    socket.on(
      "rooms_updated",
      (res: { ok: boolean; rooms?: RoomT[]; error?: string }) => {
        console.log(res);
        if (res.ok && res.rooms) {
          console.log("Salas disponíveis:", res.rooms);
          useGameStore.getState().setRooms(res.rooms);
        } else {
          console.error("Erro:", res.error);
        }
      },
    );

    return () => {
      socket.off("rooms_updated");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <WoodBg />
      <CarvedFrame />

      <div className="relative z-10 w-full max-w-4xl px-5 py-7 flex flex-col items-center">
        <Header />
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.65fr)] gap-5 w-full items-start">
          <CreateRoom />
          <RoomsPanel />
        </div>
        {/* <ul>
          {rooms &&
            rooms.map((r) => (
              <li>
                {r.id} {r.state} {r.players.length}
                <Button
                  className="bg-yellow-400"
                  onClick={() => enterRoom(r.id)}
                >
                  Enter
                </Button>
              </li>
            ))}
        </ul> */}
      </div>
    </div>
  );
};

export default Lobby;
