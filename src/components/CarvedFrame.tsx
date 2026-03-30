import React from "react";

// components/CarvedFrame.tsx
function CarvedFrame() {
  return (
    <>
      {/* Borda 1 — externa escura */}
      <div
        className="
        fixed inset-0 z-20 pointer-events-none
        border-[6px] border-wood-dark/90
        shadow-[inset_0_0_0_1px_rgba(255,180,60,0.12)]
      "
      />

      {/* Borda 2 — linha dourada */}
      <div
        className="
        fixed inset-2.5 z-20 pointer-events-none
        border border-gold/40
        shadow-[inset_0_0_0_1px_rgba(200,144,10,0.1)]
      "
      />

      {/* Borda 3 — linha sutil interna */}
      <div
        className="
        fixed inset-4 z-20 pointer-events-none
        border border-gold/15
      "
      />

      {/* Ícones nos cantos — posição fixed com inset manual */}
      <div className="fixed top-1.5 left-1.5 z-30 pointer-events-none w-11 h-11 flex items-center justify-center">
        <i className="ra ra-feather text-gold-bright/50 text-xl -rotate-15" />
      </div>
      <div className="fixed top-1.5 right-1.5 z-30 pointer-events-none w-11 h-11 flex items-center justify-center">
        <i className="ra ra-feather text-gold-bright/50 text-xl rotate-15" />
      </div>
      <div className="fixed bottom-1.5 left-1.5 z-30 pointer-events-none w-11 h-11 flex items-center justify-center">
        <i className="ra ra-gem text-gold-bright/50 text-xl -rotate-20" />
      </div>
      <div className="fixed bottom-1.5 right-1.5 z-30 pointer-events-none w-11 h-11 flex items-center justify-center">
        <i className="ra ra-gem text-gold-bright/50 text-xl rotate-20" />
      </div>
    </>
  );
}

export default CarvedFrame;
