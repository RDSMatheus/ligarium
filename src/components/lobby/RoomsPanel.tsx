import React from "react";
import RoomCard from "./RoomCard";
import { Button } from "../ui/button";
import { useGameStore } from "@/store/gameStore";
import socket from "@/socket";
import { EVENTS } from "@/protocol";

function RoomsPanel() {
  const rooms = useGameStore().rooms;

  function enterRoom(gameId: string) {
    socket.emit(
      EVENTS.JOIN_ROOM,
      { gameId },
      (res: {
        ok: boolean;
        gameId: string;
        player: { playerId: string; name: string };
      }) => {
        console.log("entrou: ", res);
        if (res?.ok) {
          useGameStore.getState().setRoomId(res.gameId);
          useGameStore.getState().setPlayerId(res.player.playerId);
          useGameStore.getState().setScreen("room");
        } else {
          console.error("Falha ao entrar na sala:", res);
        }
      },
    );
  }

  if (!rooms) return null;
  return (
    <div
      style={{
        background: "rgba(28,11,2,0.85)",
        border: `1px solid rgba(200,144,10,0.26)`,
        borderRadius: 6,
        padding: "20px 22px",
        boxShadow: `
        0 0 0 1px rgba(0,0,0,0.65),
        0 8px 40px rgba(0,0,0,0.78),
        inset 0 1px 0 rgba(255,180,60,0.06)
      `,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Cabeçalho */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'Cinzel',Georgia,serif",
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#8B6040",
          }}
        >
          {/* <Icon name="sword" size={13} color="dim" /> */}
          Salas Abertas
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "rgba(200,144,10,0.12)",
              border: "1px solid rgba(200,144,10,0.28)",
              fontSize: 9,
              color: "#F0B830",
              fontFamily: "monospace",
            }}
          >
            {rooms.length}
          </span>
        </div>
        <Button variant="ghost">Atualizar</Button>
      </div>

      {/* Lista */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxHeight: 280,
          overflowY: "auto",
        }}
      >
        {/* {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "28px 0",
              color: "#8B6040",
              fontFamily: "'IM Fell English',Georgia,serif",
              fontSize: 13,
              fontStyle: "italic",
            }}
          > */}
        {/* <Icon
              name="crystal"
              size={28}
              color="dim"
              style={{
                display: "block",
                margin: "0 auto 8px",
                animation: "iconSpin 4s linear infinite",
              }}
            /> 
            Consultando o oráculo...
          </div>
        ) :*/}{" "}
        {rooms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            {/* <Icon
              name="eye"
              size={32}
              color="dim"
              style={{ display: "block", margin: "0 auto 10px", opacity: 0.4 }}
            /> */}
            <div
              style={{
                color: "#8B6040",
                fontFamily: "'IM Fell English',Georgia,serif",
                fontSize: 13,
                fontStyle: "italic",
              }}
            >
              Nenhuma sala encontrada no Vale...
            </div>
          </div>
        ) : (
          rooms.map((r) => (
            <RoomCard key={r.id} room={r} enterRoom={enterRoom} />
          ))
        )}
      </div>
    </div>
  );
}

export default RoomsPanel;
