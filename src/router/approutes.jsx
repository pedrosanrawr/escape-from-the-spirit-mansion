//routing

import { HashRouter, Routes, Route } from "react-router-dom"
import Menu from "../pages/menu/menu"
import Levels from "../pages/levels/levels"
import Game from "../pages/game/game"

export default function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </HashRouter>
  )
}
