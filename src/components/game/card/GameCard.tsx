// GameCard.tsx
// Carta de jogo com layout fiel à referência física:
//   [custo]          [ícone tipo]
//   [hexágono com arte da criatura]
//   [⚔ atk | nome / subtipo | def ♥]
//   [texto de habilidade em itálico]
//
// Monstro: roxo/lilás | Terreno: verde
// Todas as cores são literais — sem variáveis.

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cardTemplates } from "@/data/cardDatabase";
import type { CardTemplate } from "@/data/cardDatabase";
import type { CardInstance } from "@/types";
import { Swords, Heart, Mountain, Rabbit } from "lucide-react";
// import { CardData } from "./types";

// Temas por tipo — cores literais
const MONSTER_THEME = {
  bg: "#EDE0EE",
  hex: "#4E2060",
  hexB: "#7A3D8A",
  stat: "#C9A8D4",
  abil: "#DCC8E0",
  border: "#9B6AAE",
  ink: "#2A0D40",
} as const;

const TERRAIN_THEME = {
  bg: "#DCE8CE",
  hex: "#1E4A14",
  hexB: "#3A7A2A",
  stat: "#88B876",
  abil: "#C5DDB2",
  border: "#4A7A3A",
  ink: "#0E2010",
} as const;

interface GameCardProps {
  card: CardInstance | null;
  selected?: boolean;
  cardTemplate?: CardTemplate;
  onClick?: () => void;
  back?: boolean; // renderiza o verso da carta
  small?: boolean; // tamanho reduzido para utilidades
}

export function GameCard({
  card,
  cardTemplate,
  selected = false,
  onClick,
  back = false,
  small = false,
}: GameCardProps) {
  const W = small ? 74 : 86;
  const H = small ? 104 : 122;

  // ── Stack de evolução (cartas abaixo, estilo Digimon) ─────
  const stack = card?.attached ?? [];
  const PEEK = small ? 14 : 18; // px visíveis de cada carta abaixo

  // ── Slot vazio ────────────────────────────────────────────
  if (!card && !back) {
    return (
      <div
        className="shrink-0 rounded-[5px] flex items-center justify-center border border-dashed border-[rgba(200,144,10,0.14)] bg-black/10"
        style={{ width: W, height: H }}
      >
        <div className="w-4 h-4 rounded-full border border-[rgba(200,144,10,0.18)]" />
      </div>
    );
  }

  // ── Verso da carta ────────────────────────────────────────
  if (back || !card) {
    return (
      <div
        onClick={onClick}
        className={`shrink-0 rounded-[5px] overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 ${
          selected ? "ring-2 ring-[#F0B830] -translate-y-2" : ""
        }`}
        style={{
          width: W,
          height: H,
          background:
            "repeating-linear-gradient(135deg,#3D1F08 0,#3D1F08 5px,#4A2510 5px,#4A2510 10px)",
          border: `1.5px solid ${selected ? "#F0B830" : "rgba(200,144,10,0.32)"}`,
          boxShadow: selected
            ? "0 0 18px rgba(200,144,10,0.7),0 6px 16px rgba(0,0,0,0.7)"
            : "0 4px 12px rgba(0,0,0,0.65)",
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg,rgba(200,144,10,0.07),transparent)",
          }}
        ></div>
      </div>
    );
  }
  if (!cardTemplate) return null;
  // ── Carta normal ──────────────────────────────────────────
  const TH = cardTemplate.type === "monster" ? MONSTER_THEME : TERRAIN_THEME;
  const hexH = small ? 50 : 60;
  const hexW = small ? 56 : 66;

  return (
    // ── Wrapper de pilha de evolução (estilo Digimon) ─────────
    <div style={{ position: "relative", width: W, display: "inline-block" }}>
      {/* Strips das cartas base, do mais antigo (baixo) ao mais recente (cima) */}
      {stack.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: -stack.length * PEEK,
            left: 0,
            width: W,
            display: "flex",
            flexDirection: "column-reverse",
            gap: 0,
          }}
        >
          {stack.map((attached, i) => {
            const t = cardTemplates.find((c) => c.id === attached.templateId);
            const STH = t?.type === "terrain" ? TERRAIN_THEME : MONSTER_THEME;
            return (
              <div
                key={attached.instanceId}
                style={{
                  width: W,
                  height: PEEK,
                  background: STH.stat,
                  border: `1.5px solid ${STH.border}`,
                  borderTop: `1.5px solid ${STH.border}`,
                  borderRadius: "5px 5px 0 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingInline: 5,
                  marginTop: i === 0 ? 0 : -2,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                  zIndex: stack.length - i,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontFamily: "Cinzel,Georgia,serif",
                    fontSize: 7,
                    fontWeight: "bold",
                    color: STH.ink,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {t?.name ?? "?"}
                </span>
                {t?.ap !== undefined && (
                  <span
                    style={{
                      fontFamily: "Cinzel,Georgia,serif",
                      fontSize: 7,
                      color: STH.ink,
                      opacity: 0.7,
                      marginLeft: 3,
                      flexShrink: 0,
                    }}
                  >
                    {t.ap}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* Carta principal */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={onClick}
              className={`shrink-0 cursor-pointer rounded-[5px] overflow-hidden flex flex-col transition-all duration-200
              ${card.exhausted ? "rotate-12 origin-bottom" : "hover:-translate-y-1.5"}
              ${selected ? "ring-2 ring-[#F0B830] -translate-y-2 hover:-translate-y-2" : ""}`}
              style={{
                width: W,
                background: TH.bg,
                border: `1.5px solid ${selected ? "#F0B830" : TH.border}`,
                boxShadow: selected
                  ? "0 0 22px rgba(200,144,10,0.8),0 8px 20px rgba(0,0,0,0.7)"
                  : "0 4px 14px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              {/* ── Custo + ícone de tipo ── */}
              <div className="flex items-center justify-between px-1.5 pt-1 pb-0.5">
                <span
                  className="font-bold leading-none"
                  style={{
                    fontFamily: "Cinzel,Georgia,serif",
                    fontSize: small ? 12 : 14,
                    color: TH.ink,
                  }}
                >
                  {cardTemplate.playCost ?? ""}
                </span>
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: 15,
                    height: 15,
                    background: TH.hex,
                    border: `1px solid ${TH.hexB}`,
                  }}
                >
                  {cardTemplate.type === "monster" ? (
                    <Rabbit size={7} color="rgba(255,255,255,0.85)" />
                  ) : (
                    <Mountain size={7} color="rgba(255,255,255,0.85)" />
                  )}
                </div>
              </div>

              {/* ── Arte hexagonal ── */}
              <div
                className="flex items-center justify-center mx-1 mb-0.5"
                style={{ height: hexH + 4 }}
              >
                <div
                  className="flex items-center justify-center overflow-hidden"
                  style={{
                    width: hexW,
                    height: hexH,
                    background: TH.hex,
                    border: `2.5px solid ${TH.hexB}`,
                    clipPath:
                      "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                  }}
                >
                  {cardTemplate.image && (
                    <img
                      src={`/cards/${cardTemplate.image}`}
                      alt={cardTemplate.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* ── Barra de stats: ⚔ atk | nome/subtipo | def ♥ ── */}
              <div
                className="flex items-center px-1 py-0.5 gap-0.5"
                style={{ background: TH.stat }}
              >
                {/* ATK */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <Swords size={7} color={TH.ink} />
                  <span
                    className="font-bold leading-none"
                    style={{
                      fontFamily: "Cinzel,Georgia,serif",
                      fontSize: 11,
                      color: TH.ink,
                    }}
                  >
                    {cardTemplate.ap ?? "—"}
                  </span>
                </div>

                {/* Nome + subtipo */}
                <div className="flex-1 text-center overflow-hidden px-0.5">
                  <p
                    className="font-bold leading-none"
                    style={{
                      fontFamily: "Cinzel,Georgia,serif",
                      fontSize: 7,
                      color: TH.ink,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cardTemplate.name}
                  </p>
                </div>

                {/* DEF */}
                {cardTemplate.hp && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    <span
                      className={`font-bold leading-none ${cardTemplate.hp > card.currentHp ? "text-red-800" : ""}`}
                      style={{
                        fontFamily: "Cinzel,Georgia,serif",
                        fontSize: 11,
                      }}
                    >
                      {card.currentHp ?? "—"}
                    </span>
                    <Heart size={7} color={TH.ink} />
                  </div>
                )}
              </div>
            </div>
          </TooltipTrigger>

          {/* ── Tooltip ── */}
          <TooltipContent
            className="bg-[rgba(14,5,1,0.97)] border border-[rgba(200,144,10,0.3)] text-[#FFF3D8] max-w-45 p-2"
            style={{ fontFamily: "Cinzel,Georgia,serif" }}
          >
            {cardTemplate.image && (
              <img
                src={`/cards/${cardTemplate.image}`}
                alt={cardTemplate.name}
                className="w-full rounded mb-1"
              />
            )}
            <p className="font-bold text-[10px]">
              {cardTemplate.name}
              {/* {card.subtype ? ` · ${card.subtype}` : ""} */}
            </p>
            {cardTemplate.ap !== undefined && (
              <p className="text-[9px] text-[#C4956A] mt-0.5">
                AP {cardTemplate.ap} / HP {cardTemplate.hp}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
