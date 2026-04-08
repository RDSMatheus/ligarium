import { type LucideIcon } from "lucide-react";
import { ZoneLabel } from "./ZoneLabel";

interface MainZoneProps {
  label: string;
  Icon: LucideIcon;
  children: React.ReactNode;
}

export function MainZone({ label, Icon, children }: MainZoneProps) {
  return (
    <div className="my-4">
      <ZoneLabel Icon={Icon} text={label} />
      <div
        className="flex gap-2 h-28 3xl:h-36 px-4 py-1 rounded-xl"
        style={{
          background: "rgba(14,6,1,0.55)",
          border: "1px solid rgba(200,144,10,0.16)",
          boxShadow: "inset 0 1px 0 rgba(255,180,60,0.05)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
