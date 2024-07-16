import { useContext } from "react";
import { ParticleContext } from "../components/ParticleEngine";

export const useParticles = () => {
  return useContext(ParticleContext);
};
