import { useEffect, useRef, useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { sosAPI } from "../services/api";
import { recordEvidenceForSeconds } from "../services/autoEvidenceService";

const SOSPopup = ({ isOpen, onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

  const sendingRef = useRef(false);
  const timerRef = useRef(null);

  const sendPayload = async () => {
    if (sendingRef.current) return;

    sendingRef.current = true;
    setSending(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    try {
      setMessage("Sending SOS alert...");

      let latitude = 17.6868;
      let longitude = 83.2185;
      let address = "Fallback location";

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0,
          });
        });

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        address = "Current live location";
      } catch (locationError) {
        console.warn("Using fallback location:", locationError);
      }

      const payload = {
        latitude,
        longitude,
        address,
        evidenceUrl: "",
      };

      const res = await sosAPI.send(payload);

      setSent(true);

      const alertId = res.data.alert?._id || res.data.alert?.id;

      setMessage(
        `SOS sent successfully. Contacts notified: ${
          res.data.contactsNotified || res.data.contactNotified || 0
        }. Recording current evidence now...`
      );

      if (alertId) {
        try {
          setMessage("Recording current evidence... Please allow camera and microphone.");

          const evidenceUrl = await recordEvidenceForSeconds(10);

          setMessage("Uploading evidence and attaching it to SOS alert...");

          const evidenceRes = await sosAPI.updateEvidence(alertId, evidenceUrl);

          setMessage(
            `Evidence attached and follow-up emails sent successfully. Contacts notified: ${
              evidenceRes.data.contactsNotified || 0
            }.`
          );
        } catch (evidenceError) {
          console.error("Evidence upload failed:", evidenceError);

          setMessage(
            `SOS sent, but evidence upload failed: ${
              evidenceError.response?.data?.message ||
              evidenceError.response?.data?.error ||
              evidenceError.message
            }`
          );
        }
      }
    } catch (error) {
      console.error("Failed to send SOS:", error);

      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to send SOS alert."
      );

      sendingRef.current = false;
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    setCountdown(5);
    setSent(false);
    setSending(false);
    setMessage("");
    sendingRef.current = false;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          sendPayload();
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
      onClick={() => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        sendingRef.current = false;
        setSending(false);
        setSent(false);
        setMessage("");
        onClose();
      }}
    >
      <div
        className="relative w-full max-w-xl bg-[#111426] border border-pink-500/40 rounded-3xl p-8 md:p-10 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }

            sendingRef.current = false;
            setSending(false);
            setSent(false);
            setMessage("");
            onClose();
          }}
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

          {message && (
            <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-5 text-left">
              <div className="flex items-start gap-3">
                <Loader2 className="text-pink-400 mt-1 animate-spin" size={22} />
                <p className="text-gray-300 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <button
              type="button"
              onClick={() => {
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                  timerRef.current = null;
                }

                sendingRef.current = false;
                setSending(false);
                setSent(false);
                setMessage("");
                onClose();
              }}
              className="w-full py-4 rounded-2xl bg-white/10 border border-white/10 font-bold hover:bg-white/20 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={sendPayload}
              disabled={sending || sent}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 font-bold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : sent ? "Sent" : "Send Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSPopup;
