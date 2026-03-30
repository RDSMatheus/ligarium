// src/data/cardTemplates.ts
// ─────────────────────────────────────────────────────────
// Usado pelo FRONT-END apenas.
// Contém tipos, templates e helpers de consulta.
// Sem lógica de deck, shuffle ou instâncias.
// ─────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════
//  TIPOS
// ══════════════════════════════════════════════════════════

export type CardType = "monster" | "spell" | "terrain";

export type CardTribe =
  | "Demon"
  | "Dragon"
  | "Beast"
  | "Aquan"
  | "Bird"
  | "Insect"
  | "Fish"
  | "Fairy"
  | "Plant"
  | "Machine"
  | "None";

export type EffectTrigger =
  | "taunt_while_exhausted"
  | "attacked"
  | "attacking"
  | "battling"
  | "played"
  | "end_of_turn"
  | "main_phase"
  | "either_turn"
  | "farm"
  | "continuous"
  | "blocker";

export type EffectAction =
  | "taunt_while_exhausted"
  | "destroy_opponent_farm_exhausted"
  | "exhaust_opponent_farm_card"
  | "return_exhausted_opponent_farm_to_hand"
  | "copy_highest_ap"
  | "lock_opponent_farm_card"
  | "reduce_damage_per_active_farm"
  | "ally_gain_ap"
  | "play_from_hand_as_blocker"
  | "draw_on_healed"
  | "cease_attack"
  | "lock_attacker_until_refresh"
  | "exhaust_draw"
  | "draw_on_monster_played_from_farm"
  | "reduce_play_cost"
  | "allied_monsters_gain_hp"
  | "deal_damage_to_all_battle_zone"
  | "unexhaust_allied_ice_monster" // Snowdrift Stand
  | "deal_damage_to_target_active_monster";
export type EffectSpeed = "trigger" | "fast";

/**
 * Subtipo de efeitos fast:
 * - free     → janelas abertas, sem gatilho específico
 * - response → reação direta a ação/efeito do oponente
 * - timed    → só em situações específicas
 */
export type FastType = "free" | "response" | "timed";

/**
 * Janelas de timing para efeitos fast do tipo "timed".
 */
export type FastTimingWindow =
  | "on_monster_played"
  | "on_monster_destroyed"
  | "on_monster_returned"
  | "on_card_activated"
  | "on_attack_declared"
  | "on_block_declared";

// ── Tipos de alvo para o front-end (onde procurar alvos) ───
export type TargetZone =
  | "opponent_farm"
  | "own_farm"
  | "opponent_battle"
  | "own_battle"
  | "opponent_hand"
  | "own_hand"
  | "opponent_trash"
  | "own_trash"
  | "any";

export type TargetCondition = "exhausted" | "active" | "any";

type EffectCondition =
  | "always" // sem condição
  | "while_exhausted" // só enquanto esta carta está exausta
  | "while_active" // só enquanto esta carta NÃO está exausta
  | "if_farm_has_active" // só se o farm tiver cartas não exaustas
  | "if_opponent_farm_empty" // só se o farm do oponente estiver vazio
  | null;

export interface CardEffect {
  trigger: EffectTrigger;
  action: EffectAction;

  // ── Classificação do efeito ───────────────────
  speed: EffectSpeed; // "trigger" ou "fast"
  fastType?: FastType; // para fast: "free", "response" ou "timed"
  fastTiming?: FastTimingWindow[]; // para timed: em quais janelas funciona
  interaction?: boolean; // pode responder ANTES da resolução

  oncePerTurn?: boolean;
  value?: number;
  description: string;
  optional?: boolean;
  requiresTarget?: boolean;
  condition?: EffectCondition;
  // Informações que o front-end usa para abrir a UI de seleção de alvo
  targetZones?: TargetZone[]; // zonas onde procurar os alvos (ex.: opponent_farm)
  targetFilter?: TargetCondition; // filtra por exausto/ativo/qualquer
  maxTargets?: number; // máximo de alvos que o jogador pode escolher
}

export interface CardTemplate {
  id: string;
  name: string;
  type: CardType;
  tribe?: CardTribe;
  description: string;
  subtype?: string;
  hp?: number;
  ap?: number;
  playCost?: number;
  evoCost?: number;
  image?: string;
  effects?: CardEffect[];
  evolvesFrom?: string;
  fast?: boolean;
}

// ══════════════════════════════════════════════════════════
//  TEMPLATES
// ══════════════════════════════════════════════════════════

export const cardTemplates: CardTemplate[] = [
  // ── Terrenos base ────────────────────────────────────────
  {
    id: "terrain_forest",
    name: "Floresta Ancestral",
    type: "terrain",
    tribe: "None",
    description: "Uma floresta densa cheia de vida.",
  },
  {
    id: "terrain_volcano",
    name: "Vulcão Ardente",
    type: "terrain",
    tribe: "None",
    description: "Lava escorrendo pelas encostas.",
  },
  {
    id: "terrain_ocean",
    name: "Oceano Profundo",
    type: "terrain",
    tribe: "None",
    description: "Águas escuras e misteriosas.",
  },
  {
    id: "terrain_mountain",
    name: "Montanha Sagrada",
    type: "terrain",
    tribe: "None",
    description: "Picos gelados tocando as nuvens.",
  },

  // ── Terrenos especiais ───────────────────────────────────
  {
    id: "terrain_heavens_fountain",
    name: "Heaven's Fountain",
    type: "terrain",
    tribe: "None",
    description: "Allied monsters gain 10 HP.",
    image: "Basic_Pack110.png",
    effects: [
      {
        speed: "trigger",
        trigger: "continuous",
        action: "allied_monsters_gain_hp",
        value: 10,
        description: "[Continuous] Allied monsters gain 10 HP.",
      },
    ],
  },
  {
    id: "terrain_ironspine_plains",
    name: "Ironspine Plains",
    type: "terrain",
    tribe: "None",
    description:
      "When you play a monster from your Farm, you may Exhaust this card, then draw 1 card.",
    image: "Basic_Pack111.png",
    effects: [
      {
        speed: "trigger",
        trigger: "main_phase",
        action: "draw_on_monster_played_from_farm",
        value: 1,
        description:
          "[Main Phase] When you play a monster from your Farm, you may Exhaust this card, then draw 1 card.",
      },
    ],
  },

  // ── Monstros — Basic Pack ────────────────────────────────
  {
    id: "mon_yamigni",
    name: "Yamigni",
    type: "monster",
    subtype: "Demon",
    description: "Demônio imponente que força o oponente a atacá-lo.",
    hp: 50,
    ap: 70,
    playCost: 3,
    effects: [
      {
        trigger: "taunt_while_exhausted",
        action: "taunt_while_exhausted",
        speed: "trigger",
        description:
          "[Taunt] (While Exhausted, this monster has priority as the target for your opponent's attacks.)",
      },
      {
        trigger: "attacked",
        action: "destroy_opponent_farm_exhausted",
        speed: "trigger",
        description:
          "[Attacked] You may destroy 1 Exhausted card in your opponent's Farm.",
      },
    ],
  },
  {
    id: "mon_crossky",
    name: "Crossky",
    type: "monster",
    subtype: "Dragon",
    description: "Copia o poder do monstro inimigo mais forte.",
    hp: 40,
    ap: 10,
    playCost: 2,
    effects: [
      {
        trigger: "played",
        action: "copy_highest_ap",
        speed: "trigger",
        description:
          "[Played] You may make this monster's AP become equal to the AP of 1 enemy monster with the highest AP.",
      },
    ],
  },
  {
    id: "mon_liwigon",
    name: "Liwigon",
    type: "monster",
    subtype: "Beast",
    description: "Tranca um terreno do oponente ao atacar.",
    hp: 40,
    ap: 50,
    playCost: 2,
    effects: [
      {
        trigger: "attacking",
        action: "lock_opponent_farm_card",
        speed: "trigger",
        description:
          "[Attacking] You may make 1 card in your opponent's Farm unable to become Exhausted until the end of their turn.",
      },
    ],
  },
  {
    id: "mon_thundipole",
    name: "Thundipole",
    type: "monster",
    subtype: "Aquan",
    description: "Reduz o dano recebido baseado nos terrenos ativos.",
    hp: 40,
    ap: 30,
    playCost: 1,
    effects: [
      {
        trigger: "battling",
        action: "reduce_damage_per_active_farm",
        speed: "trigger",
        value: 10,
        description:
          "[Battling] Reduce the damage this monster receives by this battle by 10 for each Active card in your Farm.",
      },
    ],
  },
  {
    id: "mon_winduck",
    name: "Winduck",
    type: "monster",
    subtype: "Bird",
    description: "Concede poder extra a um aliado quando entra em campo.",
    hp: 40,
    ap: 30,
    playCost: 1,
    effects: [
      {
        trigger: "played",
        action: "ally_gain_ap",
        speed: "trigger",
        value: 20,
        description:
          "[Played] You may make 1 allied monster gain 20 AP during this turn.",
      },
    ],
  },
  {
    id: "mon_roachit",
    name: "Roachit",
    type: "monster",
    subtype: "Insect",
    description: "Pode ser jogado da mão como bloqueador ao custo normal.",
    hp: 30,
    ap: 30,
    playCost: 1,
    effects: [
      {
        trigger: "blocker",
        action: "play_from_hand_as_blocker",
        speed: "fast",
        fastType: "timed",
        fastTiming: ["on_attack_declared"],
        description:
          "[Blocker] (When an enemy monster attacks, you may play this card from your hand into your Battle Zone by paying its cost, then it blocks that attack.)",
      },
    ],
  },
  {
    id: "mon_karpaura",
    name: "Karpaura",
    type: "monster",
    subtype: "Fish",
    description: "Compra uma carta sempre que for curado.",
    hp: 40,
    ap: 40,
    playCost: 1,
    effects: [
      {
        trigger: "either_turn",
        action: "draw_on_healed",
        speed: "trigger",
        oncePerTurn: true,
        value: 1,
        description:
          "[Either turn] [Once per turn] When this monster is healed, you may draw 1 card.",
      },
    ],
  },
  {
    id: "mon_peacock",
    name: "Peacock",
    type: "monster",
    subtype: "Bird",
    hp: 30,
    description: "",
    ap: 40,
    playCost: 1,
    image:
      "https://drive.google.com/file/d/1BRUEDa_9B-CdMdMnRJcVmfRsInlPFjQ2/view?usp=sharing",
    effects: [
      {
        trigger: "played",
        action: "deal_damage_to_all_battle_zone",
        speed: "trigger",
        optional: true,
        requiresTarget: false,
        condition: "always",
        value: 10,
        description:
          "[Played] Causa 10 de danos à todos os monstros do oponente.",
      },
    ],
  },
  {
    id: "mon_cupetit",
    name: "Cupetit",
    type: "monster",
    subtype: "Fairy",
    description: "Pode cancelar um ataque recebido uma vez por turno.",
    hp: 30,
    ap: 20,
    playCost: 1,
    effects: [
      {
        trigger: "attacked",
        action: "cease_attack",
        speed: "fast",
        fastType: "response",
        interaction: true,
        oncePerTurn: true,
        description: "[Attacked] [Once per turn] You may cease this attack.",
      },
    ],
  },
  {
    id: "mon_shinonion",
    name: "Shinonion",
    type: "monster",
    subtype: "Plant",
    description:
      "[Attacked] You may make the attacking monster unable to become Active until the end of your opponent's Refresh Phase.",
    hp: 30,
    ap: 30,
    playCost: 1,
    effects: [
      {
        trigger: "attacked",
        action: "lock_attacker_until_refresh",
        speed: "fast",
        fastType: "response",
        interaction: true,
        optional: true,
        description:
          "[Attacked] You may make the attacking monster unable to become Active until the end of your opponent's Refresh Phase.",
        requiresTarget: true,
        targetZones: ["opponent_battle"],
        targetFilter: "any",
        maxTargets: 1,
      },
    ],
  },
  {
    id: "mon_lilytle",
    name: "Lilytle",
    type: "monster",
    subtype: "Plant",
    description: "Exaure-se no fim do turno para comprar uma carta.",
    hp: 30,
    ap: 20,
    playCost: 1,
    effects: [
      {
        trigger: "end_of_turn",
        action: "exhaust_draw",
        speed: "trigger",
        value: 1,
        description:
          "[End of your turn] You may Exhaust this monster, then draw 1 card.",
      },
    ],
  },
  {
    id: "mon_ninpola",
    name: "Ninpola",
    type: "monster",
    subtype: "Plant",
    description:
      "[Played] [Evolved] You may Exhaust 1 card in your opponent's Farm. [Attacking] You can return 1 Exhausted card in your opponent's Farm to their hand.",
    hp: 60,
    ap: 70,
    evolvesFrom: "mon_shinonion",
    playCost: 3,
    evoCost: 1,
    effects: [
      {
        trigger: "played",
        action: "exhaust_opponent_farm_card",
        speed: "trigger",
        optional: true,
        description:
          "[Played] [Evolved] You may Exhaust 1 card in your opponent's Farm.",
        requiresTarget: true,
        targetZones: ["opponent_farm"],
        targetFilter: "any",
        maxTargets: 1,
      },
      {
        trigger: "attacking",
        action: "return_exhausted_opponent_farm_to_hand",
        speed: "trigger",
        description:
          "[Attacking] You can return 1 Exhausted card in your opponent's Farm to their hand.",
        requiresTarget: true,
        targetZones: ["opponent_farm"],
        targetFilter: "exhausted",
        maxTargets: 1,
      },
    ],
  },
  {
    id: "mon_robille",
    name: "Robille",
    type: "monster",
    subtype: "Machine",
    description: "Terrenos reduzem o custo para jogar esta carta.",
    hp: 40,
    ap: 40,
    playCost: 2,
    effects: [
      {
        trigger: "farm",
        action: "reduce_play_cost",
        speed: "trigger",
        value: 1,
        description: "[Farm] Reduce the cost to play this card by 1.",
      },
    ],
  },

  // ── Monstros legado (sem arte ainda) ─────────────────────
  {
    id: "mon_wolf",
    name: "Lobo das Sombras",
    type: "monster",
    tribe: "Beast",
    description: "Predador ágil que caça em matilha.",
    hp: 3,
    ap: 2,
    playCost: 1,
  },
  {
    id: "mon_golem",
    name: "Golem de Pedra",
    type: "monster",
    tribe: "None",
    description: "Lento mas muito resistente.",
    hp: 6,
    ap: 2,
    playCost: 2,
  },
  {
    id: "mon_drake",
    name: "Drake Jovem",
    type: "monster",
    tribe: "Dragon",
    description: "Um dragão em treinamento.",
    hp: 4,
    ap: 4,
    playCost: 2,
  },
  {
    id: "mon_sprite",
    name: "Sprite da Floresta",
    type: "monster",
    tribe: "None",
    description: "Pequeno mas traiçoeiro.",
    hp: 2,
    ap: 1,
    playCost: 1,
  },
  {
    id: "mon_serpent",
    name: "Serpente de Lava",
    type: "monster",
    tribe: "None",
    description: "Ataque devastador vindo do magma.",
    hp: 5,
    ap: 5,
    playCost: 3,
  },
];

// ══════════════════════════════════════════════════════════
//  HELPERS (somente leitura — sem efeitos colaterais)
// ══════════════════════════════════════════════════════════

export const cardTemplateMap: Record<string, CardTemplate> = Object.fromEntries(
  cardTemplates.map((t) => [t.id, t]),
);

export function getTemplate(id: string): CardTemplate | undefined {
  return cardTemplateMap[id];
}

export function getTemplatesByType(type: CardType): CardTemplate[] {
  return cardTemplates.filter((t) => t.type === type);
}

export function getTemplatesByTribe(tribe: CardTribe): CardTemplate[] {
  return cardTemplates.filter((t) => t.tribe === tribe);
}
