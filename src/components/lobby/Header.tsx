import { Badge } from "@/components/ui/badge";
import React from "react";

function Header() {
  return (
    <div className="text-center mb-8 select-none">
      {/* Medalha circular */}
      <div
        className="inline-flex items-center justify-center w-22 h-22 rounded-full mb-4.5"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #7A4018, #3D1F08 65%)",
          border: "3px solid #C8900A",
          boxShadow: `
            0 0 0 2px rgba(200,144,10,0.18),
            0 0 0 6px rgba(28,10,2,0.85),
            0 0 0 7px rgba(200,144,10,0.12),
            0 6px 28px rgba(0,0,0,0.75),
            inset 0 1px 0 rgba(255,200,80,0.18)
          `,
          animation: "medalGlow 4s ease-in-out infinite alternate",
        }}
      ></div>

      {/* Linha ornamental */}
      <div className="flex items-center justify-center gap-2.5 mb-2.5">
        <div className="w-17.5 h-px bg-linear-to-r from-transparent to-[rgba(200,144,10,0.4)]" />
        <span className="text-[rgba(200,144,10,0.47)] text-base leading-none">
          ✦
        </span>
        <div className="w-17.5 h-px bg-linear-to-l from-transparent to-[rgba(200,144,10,0.4)]" />
      </div>

      {/* Nome principal */}
      <h1
        className="m-0 text-[clamp(28px,5vw,48px)] font-display text-[#FFF3D8] tracking-[0.06em] leading-none"
        style={{
          textShadow: `
            0 0 20px rgba(200,144,10,0.9),
            0 0 50px rgba(200,144,10,0.45),
            0 3px 0 rgba(0,0,0,0.85),
            0 4px 14px rgba(0,0,0,0.95)
          `,
          animation: "titlePulse 5s ease-in-out infinite alternate",
        }}
      >
        Ligarium
      </h1>

      <p
        className="mt-1 text-[clamp(11px,1.8vw,16px)] text-[#F0B830] tracking-[0.45em] uppercase font-['Cinzel',Georgia,serif]"
        style={{ textShadow: "0 0 14px rgba(200,144,10,0.7)" }}
      >
        Monsters
      </p>

      {/* Tag da expansão — Badge do shadcn com override */}
      <Badge
        variant="outline"
        className="mt-3.5 gap-1.5 px-4 py-1 rounded-sm text-[9px] tracking-[0.2em] uppercase text-[#C4956A] border-[rgba(200,144,10,0.22)] bg-[rgba(28,10,2,0.65)] font-['Cinzel',Georgia,serif]"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,180,60,0.05), 0 2px 8px rgba(0,0,0,0.55)",
        }}
      ></Badge>
    </div>
  );
}

export default Header;
