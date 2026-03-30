// BoardBackground.tsx
// Moldura tripla entalhada + ornamentos nos cantos.
// Usa `absolute` (não `fixed`) para funcionar dentro de qualquer container React.
// Zero dependências de ícones — ornamentos feitos com SVG inline puro.
// Cores literais, sem variáveis.

// ── Ornamento de canto: losango + hastes + mini losangos nas pontas ──
function CornerOrnament({
  position,
  rotation,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  rotation: number;
}) {
  const posClass = {
    "top-left": "top-[4px] left-[4px]",
    "top-right": "top-[4px] right-[4px]",
    "bottom-left": "bottom-[4px] left-[4px]",
    "bottom-right": "bottom-[4px] right-[4px]",
  }[position];

  return (
    <div
      className={`absolute ${posClass} z-30 pointer-events-none w-8 h-8 flex items-center justify-center`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Losango central */}
        <polygon
          points="14,6 20,14 14,22 8,14"
          fill="none"
          stroke="rgba(200,144,10,0.5)"
          strokeWidth="1.2"
        />
        {/* Ponto central */}
        <circle cx="14" cy="14" r="1.5" fill="rgba(200,144,10,0.6)" />
        {/* Hastes */}
        <line
          x1="14"
          y1="1"
          x2="14"
          y2="5"
          stroke="rgba(200,144,10,0.35)"
          strokeWidth="1"
        />
        <line
          x1="14"
          y1="23"
          x2="14"
          y2="27"
          stroke="rgba(200,144,10,0.35)"
          strokeWidth="1"
        />
        <line
          x1="1"
          y1="14"
          x2="7"
          y2="14"
          stroke="rgba(200,144,10,0.35)"
          strokeWidth="1"
        />
        <line
          x1="21"
          y1="14"
          x2="27"
          y2="14"
          stroke="rgba(200,144,10,0.35)"
          strokeWidth="1"
        />
        {/* Mini losangos nas pontas */}
        <polygon
          points="14,0 15.4,2 14,4 12.6,2"
          fill="rgba(200,144,10,0.45)"
        />
        <polygon
          points="14,24 15.4,26 14,28 12.6,26"
          fill="rgba(200,144,10,0.45)"
        />
        <polygon
          points="0,14 2,12.6 4,14 2,15.4"
          fill="rgba(200,144,10,0.45)"
        />
        <polygon
          points="24,14 26,12.6 28,14 26,15.4"
          fill="rgba(200,144,10,0.45)"
        />
      </svg>
    </div>
  );
}

export function BoardBackground() {
  return (
    <>
      {/* Ornamentos nos 4 cantos */}
      <CornerOrnament position="top-left" rotation={0} />
      <CornerOrnament position="top-right" rotation={90} />
      <CornerOrnament position="bottom-right" rotation={180} />
      <CornerOrnament position="bottom-left" rotation={270} />

      {/* Borda externa escura com fresta dourada interna */}
      <div
        className="absolute inset-0 z-20 pointer-events-none border-[5px] border-[rgba(22,9,2,0.92)]"
        style={{ boxShadow: "inset 0 0 0 1px rgba(200,144,10,0.14)" }}
      />
      {/* Borda dourada */}
      <div className="absolute inset-2.25 z-20 pointer-events-none border border-[rgba(200,144,10,0.35)]" />
      {/* Borda sutil interna */}
      <div className="absolute inset-3.75 z-20 pointer-events-none border border-[rgba(200,144,10,0.12)]" />
    </>
  );
}
