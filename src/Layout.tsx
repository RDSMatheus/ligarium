import React from "react";
import { useGameStore } from "./store/gameStore";
import Lobby from "./components/lobby/Lobby";
import Room from "./components/lobby/room/Room";
import Game from "./components/game/Game";
import { useSocketBridge } from "@/hooks/useSocketBridge";
import { useGameSocket } from "./hooks/useGameSocket";

const Layout = () => {
  // monta listeners globais do socket assim que o layout é renderizado
  useGameSocket();
  const screen = useGameStore().screen;
  if (screen === "lobby") return <Lobby />;
  if (screen === "room") return <Room />;
  if (screen === "game") return <Game />;
};

export default Layout;
