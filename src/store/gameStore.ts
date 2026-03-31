import type {
  BattleState,
  CardInstance,
  ChainState,
  PlayerState,
  GameState,
  PendingOptionalEffect,
} from "@/types";
import { create } from "zustand";

export type RoomType = {
  createdAt: number;
  gameState: null | any;
  gameId: string;
  players: Player[];
  state: "waiting" | "in_game";
  roomName: string;
};

export type RoomT = {
  createdAt: number;
  gameState: null | any;
  id: string;
  players: Player[];
  state: "waiting" | "in_game";
  roomName: string;
};

// export interface CardInstance {
//   instanceId: string;
//   templateId: string;
//   currentHp: number;
//   exhausted: boolean;
//   canAttack: boolean;
//   revealed?: boolean;
//   apModifier?: number;
//   hpModifier?: number;
// }

export type Player = {
  joinedAt: number;
  name: string;
  playerId: string;
  socketId: string;
  isReady: boolean;
};

// Reuse `PlayerState` and `GameState` from `src/types.ts` to avoid duplicate definitions

type GameStore = {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
  userName: string | null;
  setUserName: (id: string | null) => void;
  rooms: RoomT[] | null;
  setRooms: (r: RoomT[] | null) => void;
  room: RoomType | null;
  setRoom: (r: RoomType | null) => void;
  gameState: GameState | null;
  setGameState: (game: GameState | null) => void;
  playerId: string | null;
  setPlayerId: (pId: string | null) => void;
  screen: "lobby" | "room" | "game";
  setScreen: (s: "lobby" | "room" | "game") => void;
};

export const useGameStore = create<GameStore>((set) => ({
  roomId: null,
  setRoomId: (id) => set({ roomId: id ?? null }),
  userName: null,
  setUserName: (name) => set({ userName: name }),
  rooms: null,
  setRooms: (r) => set({ rooms: r }),
  room: null,
  setRoom: (r) => set({ room: r }),
  gameState: null,
  setGameState: (game) => set({ gameState: game }),
  playerId: null,
  setPlayerId: (p) => set({ playerId: p }),
  screen: "lobby",
  setScreen: (s) => set({ screen: s }),
}));
