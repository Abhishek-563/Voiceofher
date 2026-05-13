import { useEffect, useRef, useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { sosAPI } from "../services/api";
import { recordEvidenceForSeconds } from "../services/autoEvidenceService";

const SOSPopup = ({ isOpen, onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const sentRef = useRef(false);
  const timerRef = useRef(null);

  const closePopup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    sentRef.current = false;
    setSending(false);
    setStatus("");
    setCountdown(5);

    onClose?.();
  };

  const runEvidenceInBackground = async (alertId) => {
    try {
      const evidenceUrl = await recordEvidenceForSeconds(10);

      if (alertId) {
        await sosAPI.updateEvidence(alertId, evidenceUrl);
      }

      console.log("Evidence recorded and attached successfully.");
    } catch (error) {
      console.log("Background evidence failed:", error);
    }
  };

  const sendPayload = async (payload) => {
    localStorage.removeItem("latestEvidenceUrl");

    const res = await sosAPI.sendSOS(payload);
    const alertId = res.data.alert?._id;

    setStatus(
      `SOS sent successfully. Contacts notified: ${
        res.data.contactsNotified || 0
      }. Recording evidence in background...`
    );

    setTimeout(() => {
      closePopup();
    }, 700);

    runEvidenceInBackground(alertId);
  };

  const sendSOSAlert = async () => {
    if (sending || sentRef.current) return;

    sentRef.current = true;
    setSending(true);
    setStatus("Sending SOS alert...");

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const fallbackPayload = {
      latitude: 17.6868,
      longitude: 83.2185,
      address: "Fallback location",
      evidenceUrl: "",
    };

    if (!navigator.geolocation) {
      try {
        await sendPayload(fallbackPayload);
      } catch (error) {
        console.log(error);
        setStatus("Failed to send SOS alert.");
        setSending(false);
        sentRef.current = false;
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await sendPayload({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "Live GPS location",
            evidenceUrl: "",
          });
        } catch (error) {
          console.log(error);
          setStatus("Failed to send SOS alert.");
          setSending(false);
          sentRef.current = false;
        }
      },
      async () => {
        try {
          await sendPayload(fallbackPayload);
        } catch (error) {
          console.log(error);
          setStatus("Failed to send SOS alert.");
          setSending(false);
          sentRef.current = false;
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 2000,
        maximumAge: 120000,
      }
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    setCountdown(5);
    setSending(false);
    setStatus("");
    sentRef.current = false;

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          sendSOSAlert();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center px-6"
      onClick={closePopup}
    >
      <div
        className="relative w-full max-w-xl bg-[#111426] border border-pink-500/40 rounded-3xl p-8 md:p-10 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closePopup}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white"
        >
          <X size={22} />
        </button>

        <div className="text-center">
          <AlertTriangle className="mx-auto text-red-500 mb-6" size={76} />

          <h2 className="text-3xl md:text-4xl font-black mb-4">
            🚨 SOS ACTIVATED
          </h2>

          <p className="text-gray-400 mb-8 leading-relaxed">
            Emergency alerts will be sent to your trusted contacts with your live location.
          </p>

          {!sending && (
            <>
              <div className="text-7xl font-black text-red-500 mb-3">
                {countdown}
              </div>

              <p className="text-gray-500 mb-8">
                Sending automatically in {countdown} seconds
              </p>
            </>
          )}

          {status && (
            <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-5 text-left">
              <div className="flex items-start gap-3">
                <Loader2 className="text-pink-400 mt-1 animate-spin" size={22} />
                <p className="text-gray-300 leading-relaxed">
                  {status}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <button
              type="button"
              onClick={closePopup}
              className="w-full py-4 rounded-2xl bg-white/10 border border-white/10 font-bold hover:bg-white/20 transition"
            >
              Cancel
            </button>

            {!sending && (
              <button
                type="button"
                onClick={sendSOSAlert}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 font-bold hover:scale-[1.02] transition"
              >
                Send Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSPopup;
