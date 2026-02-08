//dito yung React component para sa game page

import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { createGame } from "../../game";

export default function Game() {
  const { id } = useParams();
  const hostRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current) return;

    hostRef.current.innerHTML = "";

    if (!gameRef.current) gameRef.current = createGame();

    gameRef.current.mount(hostRef.current, Number(id) || 1);

    return () => {
      gameRef.current?.unmount();
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const levelId = Number(id) || 1;
    gameRef.current?.setLevel?.(levelId); 
  }, [id]);

  return (
    <div
      ref={hostRef}
      style={{
        width: "1916px",
        height: "951px",
        margin: "0 auto",
        background: "#000",
        overflow: "hidden",
      }}
    />
  );
}
