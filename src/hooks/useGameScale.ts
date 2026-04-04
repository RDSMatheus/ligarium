import { useEffect, useState } from "react";

export const BASE_WIDTH = 800;
export const BASE_HEIGHT = 640;

export function useGameScale() {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const update = () => {
      // zoom baseado só na largura — mais seguro que tentar encaixar altura também
      setZoom(window.innerWidth / 1280);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return zoom;
}
