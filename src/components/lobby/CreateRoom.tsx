import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { useGameStore } from "@/store/gameStore";
import socket from "@/socket";

const CreateRoom = () => {
  function createRoom() {
    socket.emit("create_room", (res: any) => {
      useGameStore.getState().setRoomId(res.roomId);
    });
  }

  return (
    <Card
      className="
      bg-panel backdrop-blur-sm
      border border-gold/25
      shadow-[0_0_0_1px_rgba(0,0,0,0.65),0_8px_40px_rgba(0,0,0,0.78),inset_0_1px_0_rgba(255,180,60,0.06)]
      rounded-md relative overflow-hidden
    "
    >
      {/* Linha dourada no topo — pseudo-elemento via div */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[1.5px] bg-[linear-gradient(to_right,transparent,rgba(200,144,10,0.8),transparent)]" />

      <CardHeader className="pb-0">
        <div className="flex items-center gap-2 text-text-dim text-[10px] tracking-[0.28em] uppercase font-cinzel">
          <i className="ra ra-scroll text-sm" />
          Identificação do Guardião
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {/* Input com override de CSS vars do shadcn */}
        <div className="space-y-1.5">
          <label className="text-[10px] tracking-[0.18em] uppercase font-cinzel text-text-muted">
            Seu nome
          </label>
          <Input
            onChange={(e) =>
              useGameStore.getState().setUserName(e.target.value)
            }
            placeholder="Como te chamam no Vale?"
            className="
              bg-[rgba(18,7,1,0.65)] border-gold/22
              text-text-light font-[--font-cinzel]
              placeholder:text-text-dim placeholder:italic
              focus:border-gold/70 focus:ring-gold/15
              focus:bg-[rgba(200,144,10,0.05)]
            "
          />
        </div>

        <Button
          className="
          w-full font-cinzel font-bold tracking-widest
          bg-linear-to-br from-gold-bright to-gold
          text-wood-dark border border-gold
          hover:from-[#FFD060] hover:to-gold-bright
          hover:shadow-[0_0_22px_rgba(200,144,10,0.75)]
          transition-all duration-200
        "
          onClick={() => createRoom()}
        >
          <i className="ra ra-scroll mr-2" />
          Criar Nova Sala
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateRoom;
