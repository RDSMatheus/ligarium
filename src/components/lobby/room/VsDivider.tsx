import React from "react";

function VsDivider({ bothReady }: { bothReady?: boolean }) {
  const lineColor = bothReady ? "#5FD44A" : "#C8900A";
  const medalShadow = bothReady
    ? "0 0 0 4px rgba(24,10,2,0.9), 0 0 20px rgba(95,212,74,0.4), 0 4px 12px rgba(0,0,0,0.6)"
    : "0 0 0 4px rgba(24,10,2,0.9), 0 0 0 5px rgba(200,144,10,0.12), 0 4px 12px rgba(0,0,0,0.6)";

  return (
    <div className="flex flex-col items-center justify-center gap-3 shrink-0 w-17.5 px-1">
      {/* Linha superior */}
      <div
        className="flex-1 w-0.5 min-h-10 transition-all duration-400"
        style={{
          background: `linear-gradient(to top, ${lineColor}88, transparent)`,
          boxShadow: bothReady ? "0 0 6px rgba(95,212,74,0.4)" : "none",
        }}
      />

      {/* Medalhão VS */}
      <div
        className="flex items-center justify-center w-13 h-13 rounded-full transition-all duration-400"
        style={{
          background: "radial-gradient(circle at 35% 30%, #7A4018, #3D1F08)",
          border: `2.5px solid ${lineColor}`,
          boxShadow: medalShadow,
          animation: bothReady
            ? "medalGlow 1.5s ease-in-out infinite alternate"
            : "none",
        }}
      >
        <span
          className="font-display font-bold text-sm tracking-[0.05em] transition-all duration-400"
          style={{
            color: bothReady ? "#5FD44A" : "#F0B830",
            textShadow: bothReady
              ? "0 0 12px rgba(95,212,74,0.9)"
              : "0 0 10px rgba(200,144,10,0.8)",
          }}
        >
          VS
        </span>
      </div>

      {/* Linha inferior */}
      <div
        className="flex-1 w-0.5 min-h-10 transition-all duration-400"
        style={{
          background: `linear-gradient(to bottom, ${lineColor}88, transparent)`,
          boxShadow: bothReady ? "0 0 6px rgba(95,212,74,0.4)" : "none",
        }}
      />
    </div>
  );
}

export default VsDivider;
