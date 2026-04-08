import React from "react";
import { getTheme, type CardProps } from "./GameCard";
import AttributeIcon from "./AttributeIcon";
import { Heart, Sword, Swords } from "lucide-react";
import { cardTemplates } from "@/data/cardDatabase";

const HandCard = ({ card, cardTemplate, setCardInfo }: CardProps) => {
  const TH = getTheme(cardTemplate);
  return (
    <div
      onClick={() => setCardInfo(card)}
      className={`${TH.cardBg} border-2 pointer-events-auto border-amber-950 relative w-card-2xl py-1 px-1 h-card-2xl rounded-sm`}
    >
      <div className="flex absolute  top-0 z-50 left-1 right-1 justify-between items-center">
        <span
          className={`text-xs relative left-2 ${TH.statBg} w-4 h-4 text-center rounded-2xl ${TH.hexBorder} border top-2 font-cinzel font-bold ${TH.ink}`}
        >
          {cardTemplate.playCost}
        </span>
        <span
          className={`w-4 h-4 relative right-2 top-2  rounded-2xl ${TH.iconBg} border ${TH.iconBorder}`}
        >
          <AttributeIcon attribute={cardTemplate.attribute} />
        </span>
      </div>

      <div className="flex items-center justify-center mx-1 mt-0.5 mb-0.5">
        <div
          className={`flex items-center justify-center z-40 h-20 w-20 ${TH.hexBg} border ${TH.hexBorder}`}
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
      <div className="absolute top-[48%]  grid grid-cols-[20px_1fr_20px] w-full h-8 left-0">
        <div
          className={`${TH.hexBorder} ${TH.statBg} ${TH.ink} flex flex-col gap-0.5 justify-end items-center border`}
        >
          <Sword size={10} />
          <span className="text-xs">{cardTemplate.ap}</span>
        </div>
        <div className={`relative z-50  ${TH.statBg}  mt-2`}>
          <p
            className={`${TH.hexBorder} ${TH.statBg} border-2 text-[8px] grid place-items-center`}
          >
            <span className="p-0.5">{cardTemplate.name}</span>
            <span className={`${TH.stripBg} w-full text-center text-[5px]`}>
              {" "}
              {cardTemplate.subtype}
            </span>
          </p>
        </div>
        <div
          className={`${TH.hexBorder} ${TH.statBg} ${TH.ink} flex flex-col gap-0.5 justify-end items-center border`}
        >
          <Heart size={10} />
          <span className="text-xs">{cardTemplate.hp}</span>
        </div>
      </div>

      <div
        className={`absolute left-0 bottom-0 rounded-b-md flex text-[8px] h-3 w-full ${TH.stripBg}`}
      >
        <span className="mr-2 ml-2">
          {cardTemplates.find((c) => c.id === cardTemplate.evolvesFrom)?.name}
        </span>
        <span>{cardTemplate.evoCost}</span>
      </div>
    </div>
  );
};

export default HandCard;
