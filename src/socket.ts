import { io } from "socket.io-client";

const SERVER_URL = import.meta.env?.VITE_SERVER_URL ?? "http://localhost:4000";

export const socket = io(SERVER_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("[socket] Conectado:", socket.id, "->", SERVER_URL);
});

socket.on("disconnect", (reason) => {
  console.warn("[socket] Desconectado:", reason);
});

socket.on("connect_error", (err) => {
  console.error("[socket] Erro de conexão:", err?.message ?? err);
});

export default socket;
