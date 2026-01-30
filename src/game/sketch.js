export default function sketch(p) {
  p.setup = () => {
    p.createCanvas(1916, 951)
  }

  p.draw = () => {
    p.background(30)
    p.fill(255)
    p.text("p5 is running", 20, 40)
  }
}