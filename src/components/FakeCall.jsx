import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, UserRound } from "lucide-react";

const FakeCall = () => {
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const startFakeCall = () => {
    setIsCallOpen(true);
    setIsAnswered(false);
  };

  const endCall = () => {
    setIsCallOpen(false);
    setIsAnswered(false);
  };

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute left-0 top-0 w-[400px] h-[400px] bg-green-500/10 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-black">
            Fake Incoming
            <span className="bg-gradient-to-r from-green-400 to-pink-500 text-transparent bg-clip-text">
              {" "}Call
            </span>
          </h1>

          <p className="text-gray-400 mt-5 max-w-2xl mx-auto">
            Trigger a realistic incoming call screen to safely escape uncomfortable situations.
          </p>

          <button
            onClick={startFakeCall}
            className="mt-10 px-10 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-pink-600 font-bold hover:scale-105 transition inline-flex items-center gap-3"
          >
            <Phone />
            Start Fake Call
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isCallOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[200] flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 40 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-sm min-h-[650px] rounded-[40px] bg-gradient-to-b from-[#111827] to-[#020617] border border-white/10 shadow-2xl p-8 flex flex-col items-center justify-between"
            >
              {/* Top */}
              <div className="text-center mt-8">
                <p className="text-gray-400 text-sm">
                  {isAnswered ? "Call in progress" : "Incoming call"}
                </p>

                <motion.div
                  animate={
                    !isAnswered
                      ? {
                          scale: [1, 1.08, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                  }}
                  className="mt-10 w-32 h-32 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mx-auto"
                >
                  <UserRound size={70} className="text-pink-400" />
                </motion.div>

                <h2 className="text-4xl font-black mt-8">
                  Mom
                </h2>

                <p className="text-gray-400 mt-2">
                  Mobile
                </p>

                {isAnswered && (
                  <p className="text-green-400 mt-6 text-lg">
                    00:12
                  </p>
                )}
              </div>

              {/* Middle Message */}
              <div className="text-center px-4">
                {!isAnswered ? (
                  <p className="text-gray-400">
                    Use this call screen to create a safe excuse and leave.
                  </p>
                ) : (
                  <p className="text-gray-300">
                    “Come home quickly. I need your help.”
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-10 mb-8">
                <button
                  onClick={endCall}
                  className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition"
                >
                  <PhoneOff size={36} />
                </button>

                {!isAnswered && (
                  <button
                    onClick={() => setIsAnswered(true)}
                    className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center hover:scale-110 transition"
                  >
                    <Phone size={36} />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FakeCall;
