import type { CardInstance } from "@/types";
import React from "react";
import { getTheme, type CardProps } from "./GameCard";
import { cardTemplates, type CardTemplate } from "@/data/cardDatabase";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AttributeIcon from "./AttributeIcon";
import { Heart, Sword } from "lucide-react";

const FieldCard = ({ card, cardTemplate }: CardProps) => {
  const stack = card?.attached ?? [];

  const TH = getTheme(cardTemplate);
  return (
    <div className="relative inline-block">
      {/* ── Strips de evolução ── */}
      {stack.length > 0 && (
        <div
          className="absolute left-0  flex flex-col-reverse"
          style={{ bottom: -stack.length, width: "100%" }}
        >
          {stack.map((attached, i) => {
            const t = cardTemplates.find((c) => c.id === attached.templateId);
            const sth = t ? getTheme(t) : TH;
            return (
              <div
                key={attached.instanceId}
                className={`flex items-center justify-between rounded-t-[5px] px-1.25 shadow-[0_2px_6px_rgba(0,0,0,0.5)] ${sth.statBg} border-[1.5px] ${sth.hexBorder}`}
                style={{
                  marginTop: i === 0 ? 0 : -2,
                  zIndex: stack.length - i,
                  position: "relative",
                }}
              >
                <span
                  className={`font-cinzel text-[7px] font-bold truncate flex-1 ${sth.ink}`}
                >
                  {t?.name ?? "?"}
                </span>
                {t?.ap !== undefined && (
                  <span
                    className={`font-cinzel text-[7px] opacity-70 ml-0.75 shrink-0 ${sth.ink}`}
                  >
                    {t.ap}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Carta principal ── */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`${TH.cardBg} relative w-card-xs py-1 px-1 h-card-xs rounded-sm`}
            >
              <div className="flex absolute top-0 left-1 right-1 justify-between items-center">
                <span className={`text-xs font-cinzel font-bold ${TH.ink}`}>
                  {cardTemplate.playCost}
                </span>
                <span className={`${TH.iconBg} rounded-2xl w-2 h-2`}>
                  <AttributeIcon attribute={cardTemplate.attribute} />
                </span>
              </div>

              <div className="flex items-center justify-center mx-1 mt-0.5 mb-0.5">
                <div
                  className={`flex items-center justify-center h-10 w-10 overflow-hidden ${TH.hexBg} border-[2.5px] ${TH.hexBorder}`}
                  style={{
                    clipPath:
                      "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                  }}
                >
                  {cardTemplate.image && (
                    <img
                      src={`${cardTemplate.image}`}
                      alt={cardTemplate.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              <div
                className={`absolute ${TH.stripBg} flex justify-between left-0 h-5 w-full ${TH.hexBorder} border`}
              >
                <div className="flex">
                  <Sword size={8} />
                  <span className="text-xs">{cardTemplate.ap}</span>
                </div>
                <div className="flex">
                  <span className="text-xs">{cardTemplate.hp}</span>
                  <Heart size={8} />
                </div>
              </div>
            </div>
          </TooltipTrigger>

          {/* ── Tooltip ── */}
          <TooltipContent className="bg-panel border border-gold/30 text-text-light max-w-45 p-2 font-cinzel">
            {cardTemplate.image && (
              <img
                src={`${cardTemplate.image}`}
                alt={cardTemplate.name}
                className="w-full rounded mb-1"
              />
            )}
            <p className="font-bold text-[10px]">{cardTemplate.name}</p>
            {cardTemplate.ap !== undefined && (
              <p className="text-[9px] text-text-muted mt-0.5">
                AP {cardTemplate.ap} / HP {cardTemplate.hp}
              </p>
            )}
            {cardTemplate.description && (
              <p className="text-[8px] text-text-muted/80 mt-1 italic">
                {cardTemplate.description}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FieldCard;
