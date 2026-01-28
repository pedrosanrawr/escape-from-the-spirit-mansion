import { HashRouter, Routes, Route } from "react-router-dom"
import Menu from "./pages/menu"
import Levels from "./pages/levels"
import Game from "./pages/game"

function App() {
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

export default App
