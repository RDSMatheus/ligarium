import React from "react";

function EmptySlot({ side }: { side: "tengu" | "terrones" }) {
  const label = side === "tengu" ? "Tribo Tengu" : "Tribo Terrones";
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-lg border border-dashed border-[rgba(200,144,10,0.15)] bg-[rgba(14,6,1,0.4)]">
      <p className="font-cinzel text-[10px] tracking-[0.2em] uppercase text-[#8B6040]">
        {label}
      </p>
      <p className="font-['IM_Fell_English',Georgia,serif] italic text-[13px] text-[#8B6040]">
        Aguardando guardião...
      </p>
    </div>
  );
}

export default EmptySlot;
