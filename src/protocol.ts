// Centraliza nomes de eventos usados pelo cliente (front)
export const EVENTS = {
  ROOMS_UPDATED: "rooms_updated",
  ROOM_UPDATE: "room_update",
  CREATE_ROOM: "create_room",
  JOIN_ROOM: "join_room",
  GAME_UPDATE: "game:update",
  GAME_STARTED: "game_started",
  GAME_PENDING_OPTIONAL_EFFECT: "game:pending_optional_effect",
  ACTION_PREFIX: "action:",
};

export type RoomsUpdatedPayload = {
  ok: boolean;
  rooms?: any[];
  error?: string;
};
export type RoomUpdatePayload = any;
export type GameUpdatePayload = any;

export default EVENTS;
