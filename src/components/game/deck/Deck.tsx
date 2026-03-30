import socket from "@/socket";
import { useGameStore } from "@/store/gameStore";
import { Layers } from "lucide-react";
import { useEffect, useRef } from "react";

const W = 66;
const H = 92;

const Deck = ({ isOpponent = false }: { isOpponent: boolean }) => {
  const deck = useGameStore(
    (s) =>
      s.gameState?.playerStates.find((p) => p.playerId === s.playerId)?.deck ??
      [],
  );

  const oppDeck = useGameStore(
    (s) =>
      s.gameState?.playerStates.find((p) => p.playerId !== s.playerId)?.deck ??
      [],
  );

  const count = isOpponent ? oppDeck.length : deck.length;

  if (!deck) return null;

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      {/* Label */}
      <span
        className="text-[8px] tracking-[0.18em] uppercase text-[rgba(200,144,10,0.42)] whitespace-nowrap leading-none"
        style={{ fontFamily: "Cinzel,Georgia,serif" }}
      >
        Deck
      </span>

      {/* Pilha com efeito de profundidade */}
      <div className="relative" style={{ width: W, height: H }}>
        {/* Sombra traseira 2 */}
        {count > 2 && (
          <div
            className="absolute rounded-[5px]"
            style={{
              top: -3,
              left: -3,
              width: W,
              height: H,
              background: "#3A1C06",
              border: "1px solid rgba(200,144,10,0.12)",
            }}
          />
        )}

        {/* Sombra traseira 1 */}
        {count > 1 && (
          <div
            className="absolute rounded-[5px]"
            style={{
              top: -1.5,
              left: -1.5,
              width: W,
              height: H,
              background: "#471F08",
              border: "1px solid rgba(200,144,10,0.18)",
            }}
          />
        )}

        {/* Carta do topo — clicável para comprar */}
        <div
          className="relative flex flex-col items-center justify-center gap-1.5 rounded-[5px] cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-transform duration-200"
          style={{
            width: W,
            height: H,
            background:
              "repeating-linear-gradient(135deg,#3D1F08 0,#3D1F08 5px,#4A2510 5px,#4A2510 10px)",
            border: "1.5px solid rgba(200,144,10,0.38)",
            boxShadow:
              "0 4px 14px rgba(0,0,0,0.65),inset 0 1px 0 rgba(255,180,60,0.07)",
          }}
        >
          <Layers size={17} color="rgba(200,144,10,0.55)" />
          <span
            className="font-bold text-[11px] text-[rgba(200,144,10,0.7)] leading-none"
            style={{ fontFamily: "Cinzel,Georgia,serif" }}
          >
            {count}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Deck;
