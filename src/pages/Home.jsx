import { useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import EmergencyWidgets from "../components/EmergencyWidgets";
import VoiceAssistant from "../components/VoiceAssistant";
import VoiceDetection from "../components/VoiceDetection";
import LiveTracking from "../components/LiveTracking";
import LiveDashboard from "../components/LiveDashboard";
import EmergencyContacts from "../components/EmergencyContacts";
import EvidenceRecorder from "../components/EvidenceRecorder";
import SOSPopup from "../components/SOSPopup";
import ParticlesBackground from "../components/ParticlesBackground";

const Home = () => {

  const [isSOSOpen, setIsSOSOpen] = useState(false);

  return (
    <div className="bg-[#050816] text-white overflow-hidden relative">

      <ParticlesBackground />

      <Navbar />

      <Hero setIsSOSOpen={setIsSOSOpen} />

      <Stats />

      <EmergencyWidgets />

      <VoiceAssistant />

      <LiveTracking />

      <VoiceDetection setIsSOSOpen={setIsSOSOpen} />

      <LiveDashboard />

      <EvidenceRecorder />

      <EmergencyContacts />

      <SOSPopup
        isOpen={isSOSOpen}
        setIsOpen={setIsSOSOpen}
      />

    </div>
  );
};

export default Home;
