// BattleZone.tsx
// Strip âmbar full-width que abriga os monstros de ambos os lados.
// O divisor central (medalha de espadas) separa oponente e jogador.
// Cores literais — sem variáveis.

import usePlayerState from "@/hooks/usePlayerState";
import { Swords } from "lucide-react";
import OpponentBattleZone from "./battleZone/OpponentBattleZone";
import MyBattleZone from "./battleZone/MyBattleZone";

export function BattleZone() {
  const ps = usePlayerState();

  if (!ps) return null;

  const { meState, oppState } = ps;

  return (
    <div className="">
      {/* Labels acima, alinhados às laterais */}
      <div className="flex justify-between mb-1 px-1">
        <div className="flex items-center gap-1.5">
          <Swords size={10} color="rgba(200,144,10,0.45)" />
          <span
            className="text-[8px] tracking-[0.22em] uppercase text-[rgba(200,144,10,0.42)] leading-none"
            style={{ fontFamily: "Cinzel,Georgia,serif" }}
          >
            Battle Zone — Oponente
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[8px] tracking-[0.22em] uppercase text-[rgba(200,144,10,0.42)] leading-none"
            style={{ fontFamily: "Cinzel,Georgia,serif" }}
          >
            Battle Zone — Você
          </span>
          <Swords size={10} color="rgba(200,144,10,0.45)" />
        </div>
      </div>

      {/* Strip âmbar */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
        style={{
          background:
            "linear-gradient(to bottom,rgba(192,112,48,0.3),rgba(145,75,18,0.2))",
          border: "1px solid rgba(200,144,10,0.42)",
          boxShadow:
            "inset 0 1px 0 rgba(255,180,60,0.14),inset 0 -1px 0 rgba(0,0,0,0.28),0 2px 12px rgba(0,0,0,0.4)",
          minHeight: 112,
        }}
      >
        {/* Monstros do oponente */}
        <div className="flex items-center gap-2 flex-1">
          <OpponentBattleZone oppState={oppState} />
        </div>

        {/* Divisor central — medalha de espadas */}
        <div className="flex flex-col items-center justify-center gap-1.5 shrink-0 self-stretch px-1">
          <div
            className="flex-1 w-px"
            style={{
              background:
                "linear-gradient(to top,rgba(200,144,10,0.5),transparent)",
            }}
          />
          <div
            className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
            style={{
              background: "radial-gradient(circle at 35% 30%,#7A4018,#3D1F08)",
              border: "2px solid rgba(200,144,10,0.55)",
              boxShadow:
                "0 0 0 3px rgba(12,5,1,0.92),0 0 14px rgba(200,144,10,0.3)",
            }}
          ></div>
          <div
            className="flex-1 w-px"
            style={{
              background:
                "linear-gradient(to bottom,rgba(200,144,10,0.5),transparent)",
            }}
          />
        </div>

        {/* Monstros do jogador */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <MyBattleZone meState={meState} />
        </div>
      </div>
    </div>
  );
}
