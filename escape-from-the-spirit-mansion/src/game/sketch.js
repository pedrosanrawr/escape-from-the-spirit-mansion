export default function sketch(p) {
  p.setup = () => {
    p.createCanvas(640, 360)
  }

  p.draw = () => {
    p.background(30)
    p.fill(255)
    p.text("p5 is running", 20, 20)
  }
}