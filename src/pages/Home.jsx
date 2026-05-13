import { useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import EmergencyWidgets from "../components/EmergencyWidgets";
import VoiceAssistant from "../components/VoiceAssistant";
import VoiceDetection from "../components/VoiceDetection";
import LiveTracking from "../components/LiveTracking";
import NearbyEmergencyServices from "../components/NearbyEmergencyServices";
import LiveDashboard from "../components/LiveDashboard";
import EmergencyContacts from "../components/EmergencyContacts";
import EvidenceRecorder from "../components/EvidenceRecorder";
import FakeCall from "../components/FakeCall";
import SOSPopup from "../components/SOSPopup";
import Footer from "../components/Footer";
import GlowBackground from "../components/GlowBackground";

const Home = () => {
  const [showSOS, setShowSOS] = useState(false);

  const openSOS = () => {
    setShowSOS(true);
  };

  const closeSOS = () => {
    setShowSOS(false);
  };

  return (
    <div className="bg-[#050816] text-white overflow-hidden relative">
      <GlowBackground />

      <Navbar />

      <button
        type="button"
        onClick={() => setShowSOS(true)}
        className="fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-full bg-red-600 text-white font-bold"
      >
        Test SOS
      </button>

      <Hero setShowSOS={setShowSOS} onSOSClick={() => setShowSOS(true)} />

      <Stats />

      <EmergencyWidgets setShowSOS={setShowSOS} onSOSClick={() => setShowSOS(true)} />

      <VoiceAssistant />

      <LiveTracking />

      <NearbyEmergencyServices />

      <VoiceDetection setShowSOS={setShowSOS} onSOSDetected={() => setShowSOS(true)} />

      <LiveDashboard />

      <EvidenceRecorder />

      <FakeCall />

      <EmergencyContacts />

      <Footer />

      <SOSPopup isOpen={showSOS} onClose={closeSOS} />
    </div>
  );
};

export default Home;
