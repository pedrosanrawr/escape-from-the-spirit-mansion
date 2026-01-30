import { useEffect, useRef } from "react"
import p5 from "p5"
import sketch from "../game/sketch"

export default function Game() {
  const sketchRef = useRef()

  useEffect(() => {
    const p5Instance = new p5(sketch, sketchRef.current)

    return () => {
      p5Instance.remove()
    }
  }, [])

  return <div ref={sketchRef}></div>
}
