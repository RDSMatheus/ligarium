import type { TargetCondition } from "./data/cardDatabase";

export type ID = string;

export type RoomState = "waiting" | "in_game" | "finished";

export type CardType = "monster" | "spell" | "terrain" | "egg";

export type TurnPhase = "refresh" | "draw" | "farm" | "main" | "battle" | "end";

export interface PlayerConnection {
  socketId: string;
  playerId: ID;
  name: string;
  joinedAt: number;
  isReady: boolean;
}

export interface PlayerState {
  playerId: ID;
  hand: CardInstance[];
  deck: CardInstance[];
  terrainsZone: CardInstance[];
  terrainsDeck: CardInstance[];
  farm: CardInstance[];
  mainZone: CardInstance[];
  battleZone: CardInstance[];
  trash: CardInstance[];
  isReady: boolean;
}

export interface CardTemplate {
  id: string;
  name: string;
  type: CardType;
  description: string;
  hp?: number;
  ap?: number;
  playCost?: number;
  evolvesTo?: string;
  fast?: boolean;
  effects?: CardEffect[];
}

export interface CardEffect {
  type: string;
  value?: number;
  target: string;
  trigger: string;
  description?: string;
}

export type EffectSpeed = "trigger" | "fast";

export type EffectTrigger =
  | "taunt_while_exhausted"
  | "attacked"
  | "attacking"
  | "battling"
  | "blocking"
  | "played"
  | "evolving"
  | "end_of_turn"
  | "main_phase"
  | "either_turn"
  | "when_destroyed"
  | "when_returned"
  | "farm"
  | "continuous"
  | "blocker";

export type EffectTarget =
  | "opponent_farm"
  | "own_farm"
  | "opponent_battle"
  | "own_battle"
  | "opponent_hand"
  | "own_hand"
  | "opponent_main"
  | "own_main"
  | "opponent_trash"
  | "own_trash"
  | "any"; // sem alvo (efeito não precisa de alvo)

export interface PendingOptionalEffect {
  sourceInstanceId: string; // qual carta gerou o efeito
  ownerId: string; // qual jogador decide se ativa
  trigger: EffectTrigger; // "played", "attacked", "end_of_turn"...
  effectSpeed: EffectSpeed;
  targetZone?: EffectTarget[] | null;
  targetFilter: TargetCondition;
  action: string; // chave do EFFECT_HANDLERS
  requiresTarget: boolean; // precisa escolher alvo antes de ativar?
  params?: Record<string, any>; // dados extras (value, targetId...)
}

interface ApModifier {
  id: string;
  value: number;
  duration: "end_of_turn" | "permanent" | "until_leaves_field";
  sourceInstanceId: string;
}

interface HpModifier {
  id: string;
  value: number;
  duration: "end_of_turn" | "permanent" | "until_leaves_field";
  sourceInstanceId: string;
}

export interface CardInstance {
  instanceId: string;
  templateId: string;
  currentHp: number;
  exhausted: boolean;
  canAttack: boolean;
  revealed?: boolean;
  apModifier?: ApModifier[];
  hpModifier?: HpModifier[];
  lockedUntilEndOfTurn: boolean;

  attached?: CardInstance[];

  attachedTo?: string | null;
}

export interface GameState {
  id: ID;
  players: PlayerConnection[];
  playerStates: PlayerState[];
  currentPlayerId: ID | null;
  turnNumber: number;
  currentPhase: TurnPhase;
  winner: ID | null;
  chain: ChainState | null;
  battle: BattleState | null;
}

export interface StackEntry {
  id: string;
  sourceInstanceId: string; // qual carta gerou
  ownerId: string; // qual jogador ativou
  trigger: string; // "fast", "attacking", etc
  params?: Record<string, any>; // dados extras (ex: targetId)
  resolved: boolean;
}

export interface ChainState {
  priority: string; // playerId de quem age agora
  lastPassedBy: string | null;
  stack: StackEntry[];
}

export type BattleStep =
  | "declare" // ataque declarado, abre janela on_attack_declared
  | "attacking" // [attacking] triggers do atacante
  | "attacked" // [attacked] triggers do defensor (se houver alvo)
  | "blocking" // janela de bloqueio
  | "battling" // [battling] de ambos os lados
  | "damage" // resolução do dano
  | "after_attacking" // [after_attacking]
  | "after_attacked" // [after_attacked]
  | "cleanup";

export interface BattleState {
  step: BattleStep;
  attackerPlayerId: string;
  attackerInstanceId: string;
  targetInstanceId: string | null; // null = ataque direto
  blockerInstanceId: string | null;
  damageModifiers: { targetInstanceId: string; value: number }[];
}

export type Phase = "refresh" | "farm" | "draw" | "main" | "battle" | "end";
