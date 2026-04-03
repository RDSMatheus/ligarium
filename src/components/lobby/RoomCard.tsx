import type { RoomT } from "@/store/gameStore";
import { useState } from "react";
import { Button } from "../ui/button";
import socket from "@/socket";
import { EVENTS } from "@/protocol";

function RoomCard({
  room,
  enterRoom,
}: {
  room: RoomT;
  enterRoom(gameId: string): void;
}) {
  const [hov, setHov] = useState(false);
  const STATUS = {
    waiting: { color: "#5FD44A", label: "Aguardando", icon: "scroll" },
    in_game: { color: "#E8A030", label: "Em batalha", icon: "sword" },
    full: { color: "#D05050", label: "Sala cheia", icon: "shield" },
  };
  const s = STATUS[room.state] || STATUS.waiting;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 14px",
        borderRadius: 4,
        border: `1px solid ${hov ? "rgba(200,144,10,0.38)" : "rgba(200,144,10,0.16)"}`,
        background: hov
          ? "linear-gradient(to right,rgba(80,38,8,0.55),rgba(48,20,4,0.55))"
          : "linear-gradient(to right,rgba(36,14,3,0.5),rgba(22,8,1,0.5))",
        transition: "all 0.18s",
        boxShadow: hov ? "inset 0 1px 0 rgba(255,180,60,0.06)" : "none",
      }}
    >
      {/* Ícone da sala — círculo medalha */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          flexShrink: 0,
          background: `radial-gradient(circle at 35% 30%,${"#7A4018"},${"#3D1F08"})`,
          border: `1px solid rgba(200,144,10,0.28)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.55)",
        }}
      >
        {/* <Icon name={room.icon || "scroll"} size={17} color="gold" /> */}
      </div>

      {/* Info da sala */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Cinzel',Georgia,serif",
            fontSize: 12,
            fontWeight: 600,
            color: "#FFF3D8",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {room.roomName}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 3,
          }}
        >
          {/* Badge de status */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "1px 7px",
              borderRadius: 2,
              background: `${s.color}18`,
              border: `1px solid ${s.color}40`,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontFamily: "'Cinzel',Georgia,serif",
                letterSpacing: "0.1em",
                color: s.color,
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </span>
          </div>
          <span
            style={{
              fontSize: 10,
              color: "#8B6040",
              fontFamily: "'IM Fell English',Georgia,serif",
            }}
          >
            {room.players.length}/2 guardiões
          </span>
        </div>
      </div>

      {/* Botão Entrar */}
      <Button
        onClick={() => {
          if (room.players.length === 2) return;
          if (enterRoom) {
            enterRoom(room.id);
            return;
          }
          // fallback: emit directly
          socket.emit(EVENTS.JOIN_ROOM, { gameId: room.id }, (res: any) => {});
        }}
        disabled={room.players.length === 2}
      >
        {room.players.length === 2 ? "Cheia" : "Entrar"}
      </Button>
    </div>
  );
}

export default RoomCard;
