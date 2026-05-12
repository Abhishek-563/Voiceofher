import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useCallback } from "react";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

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
        fpsLimit: 60,
        particles: {
          number: {
            value: 60,
            density: {
              enable: true,
            },
          },
          color: {
            value: "#ec4899",
          },
          links: {
            enable: true,
            color: "#ec4899",
            distance: 150,
            opacity: 0.25,
          },
          move: {
            enable: true,
            speed: 1,
          },
          opacity: {
            value: 0.4,
          },
          size: {
            value: {
              min: 1,
              max: 3,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;
