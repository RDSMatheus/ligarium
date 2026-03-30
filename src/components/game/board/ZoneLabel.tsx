// ZoneLabel.tsx
// Label pequeno usado acima de cada zona do board.
// Ícone via lucide-react.

import { type LucideIcon } from "lucide-react";

interface ZoneLabelProps {
  Icon: LucideIcon;
  text: string;
}

export function ZoneLabel({ Icon, text }: ZoneLabelProps) {
  return (
    <div className="flex items-center gap-1.5 mb-1">
      <Icon size={10} color="rgba(200,144,10,0.45)" className="shrink-0" />
      <span
        className="text-[8px] tracking-[0.22em] uppercase text-[rgba(200,144,10,0.42)] leading-none"
        style={{ fontFamily: "Cinzel,Georgia,serif" }}
      >
        {text}
      </span>
    </div>
  );
}
