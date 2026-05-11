const GlowBackground = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
    {/* Pink orb top-left */}
    <div style={{
      position: "absolute", width: 600, height: 600,
      background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
      top: -200, left: -150,
      animation: "orbMove 20s ease-in-out infinite",
    }} />
    {/* Purple orb bottom-right */}
    <div style={{
      position: "absolute", width: 700, height: 700,
      background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
      bottom: -250, right: -200,
      animation: "orbMove 25s ease-in-out infinite reverse",
    }} />
    {/* Cyan orb center */}
    <div style={{
      position: "absolute", width: 400, height: 400,
      background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
      top: "40%", left: "50%",
      transform: "translate(-50%,-50%)",
      animation: "orbMove 30s ease-in-out infinite",
    }} />
    {/* Grid overlay */}
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
      backgroundSize: "60px 60px",
    }} />
  </div>
);

export default GlowBackground;
