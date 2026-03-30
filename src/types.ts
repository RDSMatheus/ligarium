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

export interface BattleState {
  step: "declare" | "response" | "damage" | "cleanup";
  attackerPlayerId: string;
  attackerInstanceId: string;
  targetInstanceId: string | null; // null = ataque direto
  blockerInstanceId: string | null;
  damageModifiers: { targetInstanceId: string; value: number }[];
}

export type Phase = "refresh" | "farm" | "draw" | "main" | "battle" | "end";
