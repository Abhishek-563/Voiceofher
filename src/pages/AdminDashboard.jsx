import { useEffect, useRef, useState } from "react";
import { sosAPI } from "../services/api";
import { socket } from "../services/socket";

const AdminDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAlertBanner, setNewAlertBanner] = useState(false);
  const [latestAlertName, setLatestAlertName] = useState("");
  const audioRef = useRef(null);

  const fetchAlerts = async () => {
    try {
      const res = await sosAPI.getHistory();
      setAlerts(res.data.alerts || res.data || []);
    } catch (error) {
      console.error("Failed to load SOS alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await sosAPI.updateStatus(id, status);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert._id === id ? { ...alert, status } : alert
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update SOS status");
    }
  };

  const playAlertSound = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
    } catch (error) {
      console.warn("Unable to play alert sound automatically:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();

    socket.on("newSOSAlert", (newAlert) => {
      setLatestAlertName(newAlert.name || newAlert.user?.name || "Unknown");
      setNewAlertBanner(true);
      setAlerts((prev) => [newAlert, ...prev]);
      playAlertSound();
      setTimeout(() => setNewAlertBanner(false), 10000);
    });

    socket.on("sosEvidenceUpdated", (updatedAlert) => {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert._id === updatedAlert._id ? updatedAlert : alert
        )
      );
    });

    socket.on("sosStatusUpdated", (updatedAlert) => {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert._id === updatedAlert._id ? updatedAlert : alert
        )
      );
    });

    const interval = setInterval(fetchAlerts, 15000);

    return () => {
      socket.off("newSOSAlert");
      socket.off("sosEvidenceUpdated");
      socket.off("sosStatusUpdated");
      clearInterval(interval);
    };
  }, []);

  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(
    (alert) => alert.status === "Active"
  ).length;

  return (
    <div className="min-h-screen bg-[#050816] text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className={`mb-6 rounded-2xl border p-5 ${newAlertBanner ? "border-pink-400 bg-pink-500/10" : "border-white/10 bg-white/5"}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-lg font-bold">
                {newAlertBanner ? "New SOS alert received" : "Waiting for incoming SOS alerts"}
              </p>
              <p className="text-gray-300 mt-1">
                {newAlertBanner
                  ? `Alert from ${latestAlertName}`
                  : "Live tracking active. New alerts will appear here."}
              </p>
            </div>
            {newAlertBanner && (
              <button
                type="button"
                onClick={() => setNewAlertBanner(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
        <audio ref={audioRef} src="/sounds/sos-alert.wav" preload="auto" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black">
              Admin SOS Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Monitor emergency alerts, locations, and uploaded evidence.
            </p>
          </div>

          <button
            onClick={fetchAlerts}
            className="px-5 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 font-bold"
          >
            Refresh
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="rounded-2xl bg-white/10 border border-white/10 p-6">
            <p className="text-gray-400">Total Alerts</p>
            <h2 className="text-4xl font-black mt-2">{totalAlerts}</h2>
          </div>

          <div className="rounded-2xl bg-red-500/15 border border-red-500/30 p-6">
            <p className="text-gray-400">Active Alerts</p>
            <h2 className="text-4xl font-black mt-2">{activeAlerts}</h2>
          </div>

          <div className="rounded-2xl bg-green-500/15 border border-green-500/30 p-6">
            <p className="text-gray-400">Auto Refresh</p>
            <h2 className="text-4xl font-black mt-2">5s</h2>
          </div>
        </div>

        <div className="rounded-3xl bg-white/10 border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="text-2xl font-bold">Latest SOS Alerts</h2>
          </div>

          {loading ? (
            <p className="p-6 text-gray-400">Loading alerts...</p>
          ) : alerts.length === 0 ? (
            <p className="p-6 text-gray-400">No SOS alerts found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Evidence</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {alerts.map((alert) => {
                    const mapLink =
                      alert.latitude && alert.longitude
                        ? `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`
                        : null;

                    return (
                      <tr
                        key={alert._id}
                        className="border-t border-white/10 hover:bg-white/5"
                      >
                        <td className="p-4">
                          <p className="font-bold">
                            {alert.name || alert.user?.name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {alert.email || alert.user?.email || "No email"}
                          </p>
                        </td>

                        <td className="p-4">
                          {mapLink ? (
                            <a
                              href={mapLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-pink-400 hover:underline font-semibold"
                            >
                              View Map
                            </a>
                          ) : (
                            <span className="text-gray-500">
                              No location
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          {alert.evidenceUrl ? (
                            <a
                              href={alert.evidenceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-purple-400 hover:underline font-semibold"
                            >
                              View Evidence
                            </a>
                          ) : (
                            <span className="text-gray-500">
                              Not uploaded
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col gap-2">
                            <span
                              className={`w-fit px-3 py-1 rounded-full text-sm font-bold ${
                                alert.status === "Resolved"
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {alert.status || "Active"}
                            </span>

                            {alert.status !== "Resolved" && (
                              <button
                                type="button"
                                onClick={() => updateStatus(alert._id, "Resolved")}
                                className="w-fit px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold"
                              >
                                Mark Resolved
                              </button>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-sm text-gray-400">
                          {alert.createdAt
                            ? new Date(alert.createdAt).toLocaleString()
                            : "Unknown"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
