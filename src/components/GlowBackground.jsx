const GlowBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050816]">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[140px] animate-pulse" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[140px] animate-pulse" />

      <div className="absolute top-[40%] left-[35%] w-[350px] h-[350px] bg-red-500/10 rounded-full blur-[120px]" />

      <div className="absolute top-[15%] right-[20%] w-[250px] h-[250px] bg-fuchsia-500/10 rounded-full blur-[100px]" />
    </div>
  );
};

export default GlowBackground;
