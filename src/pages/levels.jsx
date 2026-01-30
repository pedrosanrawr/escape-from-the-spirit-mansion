import bg from "../assets/maps/map.png";

export default function Levels() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "auto",       
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat",
      }}
    >
    </div>
  );
}
