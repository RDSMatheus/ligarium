import { Button } from "@/components/ui/button";
import type { Player } from "@/store/gameStore";
import PlayerAvatar from "./PlayerAvatar";

const PlayerSlot = ({
  player,
  handleReady,
  isMe,
}: {
  handleReady: () => void;
  isMe: boolean;
  player: Player | null;
}) => {
  const isEmpty = !player;

  return (
    <div
      className="relative flex flex-col items-center gap-4 flex-1 min-w-0 rounded-[10px] px-5 py-6 overflow-hidden transition-all duration-300"
      style={{
        background: isEmpty ? "rgba(14,6,1,0.55)" : "rgba(24,10,2,0.88)",
        border: `1.5px solid ${isEmpty ? "rgba(200,144,10,0.1)" : isMe ? "rgba(200,144,10,0.5)" : "rgba(200,144,10,0.25)"}`,
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,180,60,0.07)",
      }}
    >
      {/* Barra colorida no topo — azul para você, laranja para oponente */}
      <div
        className="absolute top-0 left-0 right-0 h-0.75 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to right, transparent, ${isMe ? "#4A90D9" : "#C87A30"}, transparent)`,
          boxShadow: `0 0 8px ${isMe ? "#4A90D9" : "#C87A30"}66`,
          opacity: isEmpty ? 0.3 : 1,
        }}
      />

      {/* Badge "você" */}
      {isMe && (
        <span className="absolute top-2.5 right-3 font-cinzel text-[8px] tracking-[0.2em] uppercase text-[rgba(200,144,10,0.5)] bg-[rgba(28,10,2,0.7)] px-1.5 py-0.5 rounded border border-[rgba(200,144,10,0.18)]">
          você
        </span>
      )}

      {/* Título da posição */}
      <div className="text-center">
        <p
          className="font-cinzel text-[10px] tracking-[0.25em] uppercase mb-0.5"
          style={{ color: isMe ? "#4A90D9" : "#C87A30" }}
        >
          {isMe ? "Guardião Tengu" : "Guardião Terrones"}
        </p>
        <p className="font-['IM_Fell_English',Georgia,serif] italic text-[10px] text-[#8B6040] opacity-80">
          {isMe ? "Guardiões das Alturas" : "Forjadores das Profundezas"}
        </p>
      </div>

      {/* Avatar */}
      {isEmpty ? (
        <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-[rgba(200,144,10,0.18)] bg-black/20">
          <i className="ra ra-sand-clock text-3xl text-[rgba(139,96,64,0.45)] animate-[spinSlow_6s_linear_infinite]" />
        </div>
      ) : (
        <PlayerAvatar player={player} isMe={isMe} />
      )}

      {/* Nome e status */}
      <div className="text-center">
        {isEmpty ? (
          <p className="font-['IM_Fell_English',Georgia,serif] italic text-[13px] text-[#8B6040]">
            Aguardando guardião...
          </p>
        ) : (
          <>
            <p className="font-cinzel font-semibold text-[15px] tracking-[0.05em] text-[#FFF3D8]">
              {player.name}
            </p>

            {/* Badge de status */}
            <div
              className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded transition-all duration-300"
              style={{
                background: player.isReady
                  ? "rgba(95,212,74,0.15)"
                  : "rgba(200,144,10,0.1)",
                border: `1px solid ${player.isReady ? "rgba(95,212,74,0.35)" : "rgba(200,144,10,0.22)"}`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  background: player.isReady ? "#5FD44A" : "#C8900A",
                  boxShadow: `0 0 6px ${player.isReady ? "#5FD44A" : "#C8900A"}`,
                }}
              />
              <span
                className="font-cinzel text-[9px] tracking-[0.15em] uppercase transition-colors duration-300"
                style={{ color: player.isReady ? "#5FD44A" : "#F0B830" }}
              >
                {player.isReady ? "Pronto!" : "Aguardando..."}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Botão pronto — só para o jogador local que ainda não confirmou */}
      {isMe && player && !player.isReady && (
        <Button
          onClick={handleReady}
          variant="outline"
          className="w-full font-cinzel font-bold tracking-widest text-[13px] text-[#5FD44A] border-[rgba(95,212,74,0.45)] bg-[rgba(95,212,74,0.07)] hover:bg-[rgba(95,212,74,0.14)] hover:border-[#5FD44A] hover:-translate-y-px transition-all duration-200"
          style={{ textShadow: "0 0 10px rgba(95,212,74,0.7)" }}
        >
          <i
            className="ra ra-shield mr-2 text-[#5FD44A]"
            style={{ textShadow: "0 0 8px rgba(95,212,74,0.7)" }}
          />
          Estou Pronto!
        </Button>
      )}
    </div>
  );
};

export default PlayerSlot;
