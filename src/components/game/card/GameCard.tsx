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
import type { Attribute, CardTemplate, MonsterType } from "@/data/cardDatabase";
import { useCardInfoStore } from "@/store/infoCardStore";
import type { CardInstance } from "@/types";
import { Swords, Heart, Mountain, Rabbit } from "lucide-react";
import AttributeIcon from "./AttributeIcon";
import FieldCard from "./FieldCard";
import HandCard from "./HandCard";

/* ═══════════════════════════════════════════════════════
   PALETA POR MONSTER TYPE — classes Tailwind literais
   ═══════════════════════════════════════════════════════ */
export interface CardTheme {
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
    statBg: "bg-teal-200",
    stripBg: "bg-teal-300/70",
    ink: "text-teal-950",
    iconBg: "bg-teal-800",
    iconBorder: "border-teal-600",
  },
  Insect: {
    cardBg: "bg-stone-200",
    hexBg: "bg-stone-700",
    hexBorder: "border-stone-500",
    statBg: "bg-stone-300",
    stripBg: "bg-stone-400/70",
    ink: "text-stone-900",
    iconBg: "bg-stone-700",
    iconBorder: "border-stone-500",
  },
  Plant: {
    cardBg: "bg-green-100",
    hexBg: "bg-green-900",
    hexBorder: "border-green-700",
    statBg: "bg-green-200",
    stripBg: "bg-green-300/70",
    ink: "text-green-950",
    iconBg: "bg-green-900",
    iconBorder: "border-green-700",
  },
  Dragon: {
    cardBg: "bg-orange-100",
    hexBg: "bg-red-900",
    hexBorder: "border-red-700",
    statBg: "bg-orange-200",
    stripBg: "bg-orange-300/70",
    ink: "text-red-950",
    iconBg: "bg-red-900",
    iconBorder: "border-red-700",
  },
  Machine: {
    cardBg: "bg-zinc-200",
    hexBg: "bg-zinc-800",
    hexBorder: "border-zinc-600",
    statBg: "bg-zinc-300",
    stripBg: "bg-zinc-400/70",
    ink: "text-zinc-950",
    iconBg: "bg-zinc-800",
    iconBorder: "border-zinc-600",
  },
  Bird: {
    cardBg: "bg-amber-100",
    hexBg: "bg-amber-900",
    hexBorder: "border-amber-700",
    statBg: "bg-amber-200",
    stripBg: "bg-amber-300/70",
    ink: "text-amber-950",
    iconBg: "bg-amber-900",
    iconBorder: "border-amber-700",
  },
  Fairy: {
    cardBg: "bg-fuchsia-100",
    hexBg: "bg-fuchsia-900",
    hexBorder: "border-fuchsia-700",
    statBg: "bg-fuchsia-200",
    stripBg: "bg-pink-300/70",
    ink: "text-fuchsia-950",
    iconBg: "bg-fuchsia-900",
    iconBorder: "border-fuchsia-700",
  },
  Beast: {
    cardBg: "bg-amber-100",
    hexBg: "bg-stone-700",
    hexBorder: "border-stone-500",
    statBg: "bg-amber-200",
    stripBg: "bg-amber-400/70",
    ink: "text-stone-900",
    iconBg: "bg-stone-700",
    iconBorder: "border-stone-500",
  },
  Reptile: {
    cardBg: "bg-lime-100",
    hexBg: "bg-emerald-900",
    hexBorder: "border-emerald-700",
    statBg: "bg-lime-200",
    stripBg: "bg-lime-300/70",
    ink: "text-emerald-950",
    iconBg: "bg-emerald-900",
    iconBorder: "border-emerald-700",
  },
  Demon: {
    cardBg: "bg-violet-200",
    hexBg: "bg-violet-900",
    hexBorder: "border-violet-700",
    statBg: "bg-violet-300",
    stripBg: "bg-pink-200/70",
    ink: "text-violet-950",
    iconBg: "bg-violet-900",
    iconBorder: "border-violet-700",
  },
  Fish: {
    cardBg: "bg-blue-100",
    hexBg: "bg-blue-900",
    hexBorder: "border-blue-700",
    statBg: "bg-blue-200",
    stripBg: "bg-blue-300/70",
    ink: "text-blue-950",
    iconBg: "bg-blue-900",
    iconBorder: "border-blue-700",
  },
};

/* ═════════════════════════════════════════════════════════
   PALETA POR ATRIBUTO — usada por Terrenos
   ═════════════════════════════════════════════════════════ */
export const attributeThemes: Record<Attribute, CardTheme> = {
  Fire: {
    cardBg: "bg-red-100",
    hexBg: "bg-red-900",
    hexBorder: "border-red-700",
    statBg: "bg-red-200",
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
export function getTheme(tpl: CardTemplate): CardTheme {
  if (tpl.type === "monster" && tpl.subtype) {
    return monsterThemes[tpl.subtype];
  }
  return attributeThemes[tpl.attribute] ?? attributeThemes.Nature;
}

interface GameCardProps {
  card: CardInstance | null;
  selected?: boolean;
  cardTemplate?: CardTemplate;

  back?: boolean;
  isCardOn: "hand" | "field" | "terrain";
}

export interface CardProps {
  card: CardInstance;
  cardTemplate: CardTemplate;
  selected?: boolean;
  setCardInfo: (card: CardInstance | null) => void;
}

export function GameCard({
  card,
  cardTemplate,
  selected = false,
  back = false,
  isCardOn,
}: GameCardProps) {
  const setCardInfo = useCardInfoStore((s) => s.setCard);

  // ── Stack de evolução (cartas abaixo, estilo Digimon) ─────
  const stack = card?.attached ?? [];

  // ── Slot vazio ────────────────────────────────────────────
  if (!card && !back) {
    return (
      <div className="rounded-[5px] flex items-center justify-center border border-dashed border-gold/15 bg-black/10 w-[74px] md:w-[86px] h-[104px] md:h-[122px]">
        <div className="w-4 h-4 rounded-full border border-gold/20" />
      </div>
    );
  }

  // ── Verso da carta ────────────────────────────────────────
  if (back || !card) {
    return (
      <div
        className={`shrink-0 rounded-[5px] overflow-hidden cursor-pointer transition-all duration-200
          hover:-translate-y-1 border-[1.5px]
          ${selected ? "ring-2 ring-gold-bright -translate-y-2 border-gold-bright shadow-[0_0_18px_rgba(200,144,10,0.7),0_6px_16px_rgba(0,0,0,0.7)]" : "border-gold/30 shadow-[0_4px_12px_rgba(0,0,0,0.65)]"} w-[74px] lg:w-[86px] h-[104px] lg:h-[122px]`}
        style={{
          background:
            "repeating-linear-gradient(135deg,#3D1F08 0,#3D1F08 5px,#4A2510 5px,#4A2510 10px)",
        }}
      >
        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gold/5 to-transparent" />
      </div>
    );
  }

  if (!cardTemplate) return null;

  if (isCardOn === "field")
    return (
      <FieldCard
        card={card}
        selected={selected}
        setCardInfo={setCardInfo}
        cardTemplate={cardTemplate}
      />
    );

  if (isCardOn === "hand")
    return (
      <HandCard
        card={card}
        selected={selected}
        cardTemplate={cardTemplate}
        setCardInfo={setCardInfo}
      />
    );
}
