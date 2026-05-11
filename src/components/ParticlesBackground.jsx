import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },

        fpsLimit: 120,

        particles: {
          color: {
            value: ["#ec4899", "#8b5cf6", "#ffffff"],
          },

          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.1,
            width: 1,
          },

          collisions: {
            enable: false,
          },

          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: 1,
            straight: false,
          },

          number: {
            density: {
              enable: true,
            },
            value: 70,
          },

          opacity: {
            value: 0.3,
          },

          shape: {
            type: "circle",
          },

          size: {
            value: { min: 1, max: 5 },
          },
        },

        detectRetina: true,
      }}
      className="absolute inset-0 -z-10"
    />
  );
};

export default ParticlesBackground;
