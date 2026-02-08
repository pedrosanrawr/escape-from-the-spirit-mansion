//dito yung React component para sa levels page

import { useNavigate } from "react-router-dom";
import bg from "../../assets/images/levels/levelsbg.png";

import { getAllLevels } from "../../game/levels/registry";

const STORAGE_KEY = "spirit_mansion_unlocked_level";

function getUnlockedLevel() {
  const v = Number(localStorage.getItem(STORAGE_KEY));
  return Number.isFinite(v) && v >= 1 ? v : 1;
}

export default function Levels() {
  const navigate = useNavigate();
  const unlockedLevel = getUnlockedLevel();

  const levelPositions = {
    1: { x: "30%", y: "60%" },
    2: { x: "50%", y: "45%" },
    3: { x: "70%", y: "60%" },
  };

  const levels = getAllLevels().map((lvl) => ({
    ...lvl,
    ...(levelPositions[lvl.id] ?? { x: "50%", y: "50%" }), 
  }));

  const handleClick = (levelId) => {
    if (levelId > unlockedLevel) return;
    navigate(`/game/${levelId}`);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "auto",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {levels.map((lvl) => {
        const locked = lvl.id > unlockedLevel;

        return (
          <button
            key={lvl.id}
            onClick={() => handleClick(lvl.id)}
            disabled={locked}
            title={
              locked
                ? "Finish previous level first"
                : `Play ${lvl.name ?? `Level ${lvl.id}`}`
            }
            style={{
              position: "absolute",
              left: lvl.x,
              top: lvl.y,
              transform: "translate(-50%, -50%)",

              width: 80,
              height: 80,
              borderRadius: "50%",

              border: "3px solid rgba(255,255,255,0.8)",
              background: locked
                ? "rgba(0,0,0,0.55)"
                : "rgba(80,200,255,0.75)",

              color: "white",
              fontSize: 18,
              fontWeight: 800,

              cursor: locked ? "not-allowed" : "pointer",
              opacity: locked ? 0.45 : 1,

              boxShadow: locked
                ? "none"
                : "0 0 18px rgba(80,200,255,0.9)",

              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!locked)
                e.currentTarget.style.transform =
                  "translate(-50%, -50%) scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translate(-50%, -50%) scale(1)";
            }}
          >
            {locked ? "locked" : lvl.id}
            <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4 }}>
              {!locked ? lvl.name : ""}
            </div>
          </button>
        );
      })}
    </div>
  );
}
