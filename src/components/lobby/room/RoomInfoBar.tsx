import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const RoomInfoBar = ({
  roomName,
  roomCode,
}: {
  roomName: string;
  roomCode: string;
}) => {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(roomCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="flex items-center justify-between flex-wrap gap-2.5 w-full px-4 py-2.5 rounded-lg mb-4 border border-[rgba(200,144,10,0.22)] bg-[rgba(18,8,2,0.75)]"
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,180,60,0.05), 0 4px 16px rgba(0,0,0,0.5)",
      }}
    >
      {/* Nome da sala */}
      <div className="flex items-center gap-2.5">
        <i
          className="ra ra-tower text-sm text-[#F0B830]"
          style={{ textShadow: "0 0 10px rgba(200,144,10,0.7)" }}
        />
        <div>
          <p className="font-cinzel text-[9px] tracking-[0.25em] uppercase leading-none text-[#8B6040]">
            Sala de Batalha
          </p>
          <p className="font-cinzel font-semibold text-sm tracking-[0.04em] leading-[1.4] text-[#FFF3D8]">
            {roomName}
          </p>
        </div>
      </div>

      {/* Código + botão copiar */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-[rgba(200,144,10,0.25)] bg-[rgba(200,144,10,0.08)]">
          <span className="font-mono text-xs tracking-[0.2em] font-bold text-[#F0B830]">
            {roomCode}
          </span>
        </div>

        <button
          onClick={handleCopy}
          title="Copiar código da sala"
          className="flex items-center justify-center w-8 h-8 rounded border transition-all duration-200"
          style={{
            background: copied
              ? "rgba(95,212,74,0.15)"
              : "rgba(200,144,10,0.08)",
            border: `1px solid ${copied ? "rgba(95,212,74,0.4)" : "rgba(200,144,10,0.25)"}`,
          }}
        >
          {copied ? (
            <span className="text-[#5FD44A] text-sm leading-none">✓</span>
          ) : (
            <i className="ra ra-scroll text-[10px] text-[#C8900A]" />
          )}
        </button>
      </div>

      {/* Botão sair */}
      {/* <Button
        onClick={onLeave}
        variant="ghost"
        size="sm"
        className="font-cinzel text-[10px] tracking-[0.1em] text-[#E05858] border border-[rgba(224,88,88,0.25)] bg-[rgba(224,88,88,0.07)] hover:bg-[rgba(224,88,88,0.14)] hover:text-[#E05858]"
      >
        <i className="ra ra-door-exit mr-1.5 text-[#E05858]" />
        Sair
      </Button> */}
    </div>
  );
};

export default RoomInfoBar;
