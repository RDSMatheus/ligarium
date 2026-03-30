// HiddenHand.tsx
// Mão oculta do oponente — cartas de costas dispostas em leque.
// Cores literais, sem variáveis.

interface HiddenHandProps {
  count?: number;
}

export function HiddenHand({ count = 5 }: HiddenHandProps) {
  return (
    <div className="flex items-end shrink-0" style={{ paddingBottom: 4 }}>
      {Array.from({ length: count }).map((_, i) => {
        const mid = Math.floor(count / 2);
        const offset = i - mid;
        return (
          <div
            key={i}
            className="shrink-0 rounded-[5px] overflow-hidden"
            style={{
              width: 62,
              height: 88,
              marginLeft: i === 0 ? 0 : -22,
              zIndex: i,
              background:
                "repeating-linear-gradient(135deg,#3D1F08 0,#3D1F08 5px,#4A2510 5px,#4A2510 10px)",
              border: "1.5px solid rgba(200,144,10,0.28)",
              boxShadow: "0 3px 8px rgba(0,0,0,0.55)",
              transform: `rotate(${offset * 4}deg) translateY(${Math.abs(offset) * 4}px)`,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg,rgba(200,144,10,0.06),transparent)",
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
