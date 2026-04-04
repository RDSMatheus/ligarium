// GameCard.tsx
// Carta de jogo com layout fiel à referência física:
//   [custo]          [ícone atributo]
//   [hexágono com arte da criatura]
//   [⚔ atk | nome / subtipo | def ♥]
//   [barra de cor inferior]
//
// Paleta baseada no MonsterType (subtype) para monstros
// e no Attribute para terrenos. Tudo em Tailwind.

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cardTemplates } from "@/data/cardDatabase";
import type { CardTemplate } from "@/data/cardDatabase";
import { useCardInfoStore } from "@/store/infoCardStore";
import type { CardInstance } from "@/types";
import { Swords, Heart, Mountain, Rabbit } from "lucide-react";

/* ═══════════════════════════════════════════════════════
   PALETA POR MONSTER TYPE — classes Tailwind literais
   ═══════════════════════════════════════════════════════ */
interface CardTheme {
  cardBg: string; // fundo geral da carta
  hexBg: string; // fundo do hexágono da arte
  hexBorder: string; // borda do hexágono
  statBg: string; // barra de stats (nome + atk/def)
  stripBg: string; // faixa inferior decorativa
  ink: string; // cor do texto
  iconBg: string; // badge do atributo (fundo)
  iconBorder: string; // badge do atributo (borda)
}

export const monsterThemes: Record<MonsterType, CardTheme> = {
  Aquan: {
    cardBg: "bg-teal-100",
    hexBg: "bg-teal-800",
    hexBorder: "border-teal-600",
    statBg: "bg-teal-200/80",
    stripBg: "bg-teal-300/70",
    ink: "text-teal-950",
    iconBg: "bg-teal-800",
    iconBorder: "border-teal-600",
  },
  Insect: {
    cardBg: "bg-stone-200",
    hexBg: "bg-stone-700",
    hexBorder: "border-stone-500",
    statBg: "bg-stone-300/80",
    stripBg: "bg-stone-400/70",
    ink: "text-stone-900",
    iconBg: "bg-stone-700",
    iconBorder: "border-stone-500",
  },
  Plant: {
    cardBg: "bg-green-100",
    hexBg: "bg-green-900",
    hexBorder: "border-green-700",
    statBg: "bg-green-200/80",
    stripBg: "bg-green-300/70",
    ink: "text-green-950",
    iconBg: "bg-green-900",
    iconBorder: "border-green-700",
  },
  Dragon: {
    cardBg: "bg-orange-100",
    hexBg: "bg-red-900",
    hexBorder: "border-red-700",
    statBg: "bg-orange-200/80",
    stripBg: "bg-orange-300/70",
    ink: "text-red-950",
    iconBg: "bg-red-900",
    iconBorder: "border-red-700",
  },
  Machine: {
    cardBg: "bg-zinc-200",
    hexBg: "bg-zinc-800",
    hexBorder: "border-zinc-600",
    statBg: "bg-zinc-300/80",
    stripBg: "bg-zinc-400/70",
    ink: "text-zinc-950",
    iconBg: "bg-zinc-800",
    iconBorder: "border-zinc-600",
  },
  Bird: {
    cardBg: "bg-amber-100",
    hexBg: "bg-amber-900",
    hexBorder: "border-amber-700",
    statBg: "bg-amber-200/80",
    stripBg: "bg-amber-300/70",
    ink: "text-amber-950",
    iconBg: "bg-amber-900",
    iconBorder: "border-amber-700",
  },
  Fairy: {
    cardBg: "bg-fuchsia-100",
    hexBg: "bg-fuchsia-900",
    hexBorder: "border-fuchsia-700",
    statBg: "bg-fuchsia-200/80",
    stripBg: "bg-pink-300/70",
    ink: "text-fuchsia-950",
    iconBg: "bg-fuchsia-900",
    iconBorder: "border-fuchsia-700",
  },
  Beast: {
    cardBg: "bg-amber-100",
    hexBg: "bg-stone-700",
    hexBorder: "border-stone-500",
    statBg: "bg-amber-200/80",
    stripBg: "bg-amber-400/70",
    ink: "text-stone-900",
    iconBg: "bg-stone-700",
    iconBorder: "border-stone-500",
  },
  Reptile: {
    cardBg: "bg-lime-100",
    hexBg: "bg-emerald-900",
    hexBorder: "border-emerald-700",
    statBg: "bg-lime-200/80",
    stripBg: "bg-lime-300/70",
    ink: "text-emerald-950",
    iconBg: "bg-emerald-900",
    iconBorder: "border-emerald-700",
  },
  Demon: {
    cardBg: "bg-violet-200",
    hexBg: "bg-violet-900",
    hexBorder: "border-violet-700",
    statBg: "bg-violet-300/80",
    stripBg: "bg-pink-200/70",
    ink: "text-violet-950",
    iconBg: "bg-violet-900",
    iconBorder: "border-violet-700",
  },
  Fish: {
    cardBg: "bg-blue-100",
    hexBg: "bg-blue-900",
    hexBorder: "border-blue-700",
    statBg: "bg-blue-200/80",
    stripBg: "bg-blue-300/70",
    ink: "text-blue-950",
    iconBg: "bg-blue-900",
    iconBorder: "border-blue-700",
  },
};

/* ═════════════════════════════════════════════════════════
   PALETA POR ATRIBUTO — usada por Terrenos
   ═════════════════════════════════════════════════════════ */
const attributeThemes: Record<Attribute, CardTheme> = {
  Fire: {
    cardBg: "bg-red-100",
    hexBg: "bg-red-900",
    hexBorder: "border-red-700",
    statBg: "bg-red-200/80",
    stripBg: "bg-red-300/70",
    ink: "text-red-950",
    iconBg: "bg-red-800",
    iconBorder: "border-red-600",
  },
  Electric: {
    cardBg: "bg-yellow-100",
    hexBg: "bg-yellow-700",
    hexBorder: "border-yellow-500",
    statBg: "bg-yellow-200/80",
    stripBg: "bg-yellow-300/70",
    ink: "text-yellow-950",
    iconBg: "bg-yellow-600",
    iconBorder: "border-yellow-400",
  },
  Air: {
    cardBg: "bg-cyan-100",
    hexBg: "bg-cyan-800",
    hexBorder: "border-cyan-600",
    statBg: "bg-cyan-200/80",
    stripBg: "bg-cyan-300/70",
    ink: "text-cyan-950",
    iconBg: "bg-cyan-700",
    iconBorder: "border-cyan-500",
  },
  Water: {
    cardBg: "bg-sky-100",
    hexBg: "bg-sky-800",
    hexBorder: "border-sky-600",
    statBg: "bg-sky-200/80",
    stripBg: "bg-sky-300/70",
    ink: "text-sky-950",
    iconBg: "bg-sky-700",
    iconBorder: "border-sky-500",
  },
  Nature: {
    cardBg: "bg-emerald-100",
    hexBg: "bg-emerald-900",
    hexBorder: "border-emerald-700",
    statBg: "bg-emerald-200/80",
    stripBg: "bg-emerald-300/70",
    ink: "text-emerald-950",
    iconBg: "bg-emerald-800",
    iconBorder: "border-emerald-600",
  },
  Earth: {
    cardBg: "bg-stone-200",
    hexBg: "bg-stone-800",
    hexBorder: "border-stone-600",
    statBg: "bg-stone-300/80",
    stripBg: "bg-stone-400/70",
    ink: "text-stone-950",
    iconBg: "bg-stone-700",
    iconBorder: "border-stone-500",
  },
  Steel: {
    cardBg: "bg-zinc-200",
    hexBg: "bg-zinc-800",
    hexBorder: "border-zinc-600",
    statBg: "bg-zinc-300/80",
    stripBg: "bg-zinc-400/70",
    ink: "text-zinc-950",
    iconBg: "bg-zinc-700",
    iconBorder: "border-zinc-500",
  },
  Ice: {
    cardBg: "bg-sky-100",
    hexBg: "bg-sky-900",
    hexBorder: "border-sky-700",
    statBg: "bg-sky-200/80",
    stripBg: "bg-sky-300/70",
    ink: "text-sky-950",
    iconBg: "bg-sky-800",
    iconBorder: "border-sky-600",
  },
  Light: {
    cardBg: "bg-amber-50",
    hexBg: "bg-amber-700",
    hexBorder: "border-amber-500",
    statBg: "bg-amber-200/80",
    stripBg: "bg-amber-300/70",
    ink: "text-amber-950",
    iconBg: "bg-amber-600",
    iconBorder: "border-amber-400",
  },
};

/** Resolve a paleta certa para qualquer CardTemplate */
function getTheme(tpl: CardTemplate): CardTheme {
  if (tpl.type === "monster" && tpl.subtype) {
    return monsterThemes[tpl.subtype];
  }
  return attributeThemes[tpl.attribute] ?? attributeThemes.Nature;
}

interface GameCardProps {
  card: CardInstance | null;
  selected?: boolean;
  cardTemplate?: CardTemplate;
  onClick?: () => void;
  back?: boolean;
  small?: boolean;
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

  const setCardInfo = useCardInfoStore((s) => s.setCard);

  // ── Stack de evolução (cartas abaixo, estilo Digimon) ─────
  const stack = card?.attached ?? [];
  const PEEK = small ? 14 : 18;

  // ── Slot vazio ────────────────────────────────────────────
  if (!card && !back) {
    return (
      <div
        className="shrink-0 rounded-[5px] flex items-center justify-center border border-dashed border-gold/15 bg-black/10"
        style={{ width: W, height: H }}
      >
        <div className="w-4 h-4 rounded-full border border-gold/20" />
      </div>
    );
  }

  // ── Verso da carta ────────────────────────────────────────
  if (back || !card) {
    return (
      <div
        onClick={onClick}
        className={`shrink-0 rounded-[5px] overflow-hidden cursor-pointer transition-all duration-200
          hover:-translate-y-1 border-[1.5px]
          ${selected ? "ring-2 ring-gold-bright -translate-y-2 border-gold-bright shadow-[0_0_18px_rgba(200,144,10,0.7),0_6px_16px_rgba(0,0,0,0.7)]" : "border-gold/30 shadow-[0_4px_12px_rgba(0,0,0,0.65)]"}`}
        style={{
          width: W,
          height: H,
          background:
            "repeating-linear-gradient(135deg,#3D1F08 0,#3D1F08 5px,#4A2510 5px,#4A2510 10px)",
        }}
      >
        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gold/5 to-transparent" />
      </div>
    );
  }

  if (!cardTemplate) return null;

  // ── Tema por tipo ─────────────────────────────────────────
  const TH = getTheme(cardTemplate);
  const hexH = small ? 50 : 60;
  const hexW = small ? 56 : 66;

  return (
    <div className="relative inline-block" style={{ width: W }}>
      {/* ── Strips de evolução ── */}
      {stack.length > 0 && (
        <div
          className="absolute left-0 flex flex-col-reverse"
          style={{ bottom: -stack.length * PEEK, width: W }}
        >
          {stack.map((attached, i) => {
            const t = cardTemplates.find((c) => c.id === attached.templateId);
            const sth = t ? getTheme(t) : TH;
            return (
              <div
                key={attached.instanceId}
                className={`flex items-center justify-between rounded-t-[5px] px-1.25 shadow-[0_2px_6px_rgba(0,0,0,0.5)] ${sth.statBg} border-[1.5px] ${sth.hexBorder}`}
                style={{
                  width: W,
                  height: PEEK,
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
              onClick={() => {
                if (onClick) onClick();
                setCardInfo(card);
              }}
              className={`shrink-0  cursor-pointer rounded-[5px] overflow-hidden flex flex-col transition-all duration-200
              ${card.exhausted ? "rotate-12 origin-bottom" : "hover:-translate-y-1.5"}
              ${selected ? "ring-2 ring-[#F0B830] -translate-y-2 hover:-translate-y-2" : ""}`}
              style={{
                width: W,
                background: TH.bg,
                border: `1.5px solid ${selected ? "#F0B830" : card.lockedUntilEndOfTurn ? "blue" : ""}`,
                boxShadow: selected
                  ? "0 0 22px rgba(200,144,10,0.8),0 8px 20px rgba(0,0,0,0.7)"
                  : "0 4px 14px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              {/* ── Custo + badge atributo ── */}
              <div className="flex items-center justify-between px-1.5 pt-1 pb-0.5">
                <span
                  className={`font-cinzel font-bold leading-none ${TH.ink} ${small ? "text-xs" : "text-sm"}`}
                >
                  {cardTemplate.playCost ?? ""}
                </span>
                <div
                  className={`w-3.75 h-3.75 rounded-full flex items-center justify-center border ${TH.iconBg} ${TH.iconBorder}`}
                >
                  {cardTemplate.type === "monster" ? (
                    <AttributeIcon attribute={cardTemplate.attribute} />
                  ) : (
                    <Mountain size={7} className="text-white/85" />
                  )}
                </div>
              </div>

              {/* ── Arte hexagonal ── */}
              <div
                className="flex items-center justify-center mx-1 mb-0.5"
                style={{ height: hexH + 4 }}
              >
                <div
                  className={`flex items-center justify-center overflow-hidden ${TH.hexBg} border-[2.5px] ${TH.hexBorder}`}
                  style={{
                    width: hexW,
                    height: hexH,
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

              {/* ── Barra de stats ── */}
              <div
                className={`flex items-center px-1 py-0.5 gap-0.5 ${TH.statBg}`}
              >
                {/* ATK */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <Swords size={7} className={TH.ink} />
                  <span
                    className={`font-cinzel font-bold leading-none text-[11px] ${TH.ink}`}
                  >
                    {cardTemplate.ap ?? "—"}
                  </span>
                </div>

                {/* Nome + subtipo */}
                <div className="flex-1 text-center overflow-hidden px-0.5">
                  <p
                    className={`font-cinzel font-bold leading-none text-[7px] truncate ${TH.ink}`}
                  >
                    {cardTemplate.name}
                  </p>
                  {cardTemplate.subtype && (
                    <p
                      className={`font-cinzel leading-none text-[5px] truncate opacity-70 ${TH.ink}`}
                    >
                      {cardTemplate.subtype}
                    </p>
                  )}
                </div>

                {/* DEF */}
                {cardTemplate.hp != null && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    <span
                      className={`font-cinzel font-bold leading-none text-[11px] ${
                        cardTemplate.hp > card.currentHp
                          ? "text-red-600"
                          : TH.ink
                      }`}
                    >
                      {card.currentHp ?? "—"}
                    </span>
                    <Heart size={7} className={TH.ink} />
                  </div>
                )}
              </div>

              {/* ── Faixa inferior decorativa ── */}
              <div className={`h-1.5 ${TH.stripBg}`} />
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
}
