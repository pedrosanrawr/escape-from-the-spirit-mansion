import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/menu.css"

export default function Menu() {
  const navigate = useNavigate()
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    if (!isStarting) return undefined
    const t = window.setTimeout(() => navigate("/game/1"), 2200)
    return () => window.clearTimeout(t)
  }, [isStarting, navigate])

  return (
    <main className="menuScreen">
      <div className={isStarting ? "menuBg menuBg--animate" : "menuBg"} />
      <div className="menuOverlay" />

      <nav className="menuNav" aria-label="Main menu">
        <button
          className="menuTextBtn"
          type="button"
          onClick={() => setIsStarting(true)}
          disabled={isStarting}
          aria-disabled={isStarting ? "true" : "false"}
        >
          play
        </button>
        <Link className="menuTextBtn" to="/levels" aria-disabled={isStarting ? "true" : "false"}>
          maps
        </Link>
      </nav>
    </main>
  )
}
