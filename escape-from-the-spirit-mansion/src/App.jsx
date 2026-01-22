import { BrowserRouter, Routes, Route } from "react-router-dom"
import Menu from "./pages/menu"
import Levels from "./pages/levels"
import Game from "./pages/game"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
