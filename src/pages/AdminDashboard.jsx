import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Grid2X2,
  Users,
  Settings,
  LogOut,
  RefreshCw,
  Siren,
  Shield,
  AlertTriangle,
  Trash2,
  MapPin,
  Video,
} from "lucide-react";

import { sosAPI } from "../services/api";
import { socket } from "../services/socket";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAlertBanner, setNewAlertBanner] = useState(false);
  const [latestAlertName, setLatestAlertName] = useState("");
  const audioRef = useRef(null);

  const fetchAlerts = async () => {
    try {
      const res = await sosAPI.getHistory();
      const data = res.data.alerts || res.data || [];
      setAlerts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load SOS alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const playAlertSound = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/sounds/sos-alert.mp3");
      }

      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.log("Alert sound blocked by browser:", error.message);
      });
    } catch (error) {
      console.log("Alert sound error:", error.message);
    }
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Browser notifications are not supported in this browser.");
      return;
    }

    if (Notification.permission === "granted") {
      alert("Browser notifications are already enabled.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      alert("Browser notifications enabled.");
    } else {
      alert("Browser notifications permission denied.");
    }
  };

  const showBrowserNotification = (newAlert) => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const notification = new Notification("🚨 New SOS Alert - Voice of Her", {
      body: `Emergency alert from ${
        newAlert.name || "Unknown user"
      }. Click to view dashboard.`,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      tag: `sos-${newAlert._id}`,
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = "/admin";
      notification.close();
    };
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

  const handleDeleteAlert = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this SOS alert permanently?"
    );

    if (!confirmDelete) return;

    try {
      await sosAPI.deleteAlert(id);

      setAlerts((prev) => prev.filter((alert) => alert._id !== id));
    } catch (error) {
      console.error("Failed to delete alert:", error);
      alert("Failed to delete alert");
    }
  };

  const handleClearAllAlerts = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all SOS alerts? This cannot be undone."
    );

    if (!confirmClear) return;

    try {
      await sosAPI.clearAll();

      setAlerts([]);
    } catch (error) {
      console.error("Failed to clear all alerts:", error);
      alert("Failed to clear all alerts");
    }
  };

  const handleDeleteResolvedAlerts = async () => {
    const confirmDelete = window.confirm(
      "Delete all resolved SOS alerts?"
    );

    if (!confirmDelete) return;

    try {
      const res = await sosAPI.deleteResolved();

      setAlerts((prev) => prev.filter((alert) => alert.status !== "Resolved"));

      alert(`${res.data.deletedCount || 0} resolved alerts deleted`);
    } catch (error) {
      console.error("Failed to delete resolved alerts:", error);
      alert("Failed to delete resolved alerts");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("voh_user");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  useEffect(() => {
    fetchAlerts();

    socket.on("newSOSAlert", (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);

      setLatestAlertName(newAlert.name || "Unknown user");
      setNewAlertBanner(true);

      playAlertSound();
      showBrowserNotification(newAlert);

      setTimeout(() => {
        setNewAlertBanner(false);
      }, 8000);
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

    socket.on("sosAlertDeleted", (deletedId) => {
      setAlerts((prev) => prev.filter((alert) => alert._id !== deletedId));
    });

    socket.on("sosAlertsCleared", () => {
      setAlerts([]);
    });

    socket.on("resolvedSOSAlertsDeleted", () => {
      setAlerts((prev) => prev.filter((alert) => alert.status !== "Resolved"));
    });

    const interval = setInterval(fetchAlerts, 15000);

    return () => {
      socket.off("newSOSAlert");
      socket.off("sosEvidenceUpdated");
      socket.off("sosStatusUpdated");
      socket.off("sosAlertDeleted");
      socket.off("sosAlertsCleared");
      socket.off("resolvedSOSAlertsDeleted");
      clearInterval(interval);
    };
  }, []);

  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter((alert) => alert.status === "Active").length;
  const resolvedAlerts = alerts.filter(
    (alert) => alert.status === "Resolved"
  ).length;

  return (
    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[280px] shrink-0 min-h-screen border-r border-white/10 bg-[#070b1d]/95 backdrop-blur-xl flex-col justify-between overflow-hidden">
        <div>
          <div className="px-6 py-7 flex items-center gap-4 border-b border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-pink-500/15 border border-pink-500/40 flex items-center justify-center">
              <Shield className="text-pink-400" size={32} />
            </div>

            <div>
              <h2 className="text-xl font-black text-pink-400 whitespace-nowrap">
                Voice of Her
              </h2>
              <p className="text-sm text-gray-300">Admin Panel</p>
            </div>
          </div>

          <nav className="p-4 space-y-3">
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-500/20 font-bold">
              <Grid2X2 size={20} />
              Dashboard
            </button>

            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/10 text-gray-300 font-semibold transition">
              <Bell size={20} />
              SOS Alerts
            </button>

            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/10 text-gray-300 font-semibold transition">
              <Users size={20} />
              Users
            </button>

            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-white/10 text-gray-300 font-semibold transition">
              <Settings size={20} />
              Settings
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="m-5 flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-500/15 text-gray-300 hover:text-red-300 font-bold transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-y-auto px-8 xl:px-10 pt-10 pb-8">
        <div className="max-w-[1450px] mx-auto">
          {/* New alert banner */}
          {newAlertBanner && (
            <div className="mb-7 rounded-2xl border border-pink-500/50 bg-gradient-to-r from-pink-500/20 via-purple-500/10 to-transparent p-5 shadow-[0_0_35px_rgba(236,72,153,0.18)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center">
                    <Siren className="text-pink-400 animate-pulse" size={28} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black">
                      New SOS alert received
                    </h2>
                    <p className="text-gray-300 mt-1">
                      Alert from{" "}
                      <span className="text-pink-300 font-bold">
                        {latestAlertName}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setNewAlertBanner(false)}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl md:text-[44px] leading-tight font-black tracking-tight">
                Admin SOS Dashboard
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                Monitor emergency alerts, locations, and uploaded evidence.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 xl:pt-5">
              <button
                onClick={playAlertSound}
                className="px-5 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 font-bold transition"
              >
                Enable Sound
              </button>

              <button
                onClick={requestNotificationPermission}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold transition"
              >
                Enable Notifications
              </button>

              <button
                onClick={fetchAlerts}
                className="px-5 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 font-bold transition flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              <button
                onClick={handleDeleteResolvedAlerts}
                disabled={!alerts.some((alert) => alert.status === "Resolved")}
                className="px-4 py-2 rounded-xl bg-green-500/15 border border-green-500/40 text-green-300 font-bold hover:bg-green-500/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Delete Resolved
              </button>

              <button
                onClick={handleClearAllAlerts}
                disabled={alerts.length === 0}
                className="px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 font-bold hover:bg-red-500/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="rounded-3xl bg-[#0b1024] border border-white/10 p-7 shadow-2xl">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/20 flex items-center justify-center">
                  <Bell className="text-pink-400" size={28} />
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Total Alerts</p>
                  <h2 className="text-4xl font-black mt-1">{totalAlerts}</h2>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-red-500/10 border border-red-500/30 p-7 shadow-2xl">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="text-red-400" size={30} />
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Active Alerts</p>
                  <h2 className="text-4xl font-black mt-1">{activeAlerts}</h2>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-green-500/10 border border-green-500/30 p-7 shadow-2xl">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <RefreshCw className="text-green-400" size={30} />
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Resolved</p>
                  <h2 className="text-4xl font-black mt-1">{resolvedAlerts}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-3xl bg-[#0b1024]/95 border border-white/10 overflow-hidden shadow-2xl w-full">
            <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
              <Bell className="text-pink-400" size={24} />
              <h2 className="text-2xl font-black">Latest SOS Alerts</h2>
            </div>

            {loading ? (
              <p className="p-8 text-gray-400">Loading alerts...</p>
            ) : alerts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🛡️</div>
                <h3 className="text-2xl font-black mb-2">
                  No SOS alerts found
                </h3>
                <p className="text-gray-400">
                  New emergency alerts will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[1150px] text-sm">
                  <thead className="bg-white/5 text-gray-200">
                    <tr>
                      <th className="px-5 py-4">User</th>
                      <th className="px-5 py-4">Location</th>
                      <th className="px-5 py-4">Evidence</th>
                      <th className="px-5 py-4">Priority</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Time</th>
                      <th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {alerts.map((alert) => {
                      const mapLink =
                        alert.latitude && alert.longitude
                          ? `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`
                          : null;

                      const isResolved = alert.status === "Resolved";
                      const priority = isResolved ? "Closed" : "High Priority";

                      return (
                        <tr
                          key={alert._id}
                          className="border-t border-white/10 hover:bg-white/[0.04] transition"
                        >
                          <td className="px-5 py-4 align-top">
                            <p className="font-black text-white">
                              {alert.name || alert.user?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {alert.email || alert.user?.email || "No email"}
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top">
                            {mapLink ? (
                              <div className="flex flex-col gap-1">
                                <a
                                  href={mapLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-pink-400 hover:underline font-black flex items-center gap-1"
                                >
                                  <MapPin size={16} />
                                  View Map
                                </a>

                                <span className="text-xs text-gray-500">
                                  {Number(alert.latitude).toFixed(4)}, {Number(alert.longitude).toFixed(4)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500">No location</span>
                            )}
                          </td>

                          <td className="px-5 py-4 align-top">
                            {alert.evidenceUrl ? (
                              <div className="flex flex-col gap-2">
                                <a
                                  href={alert.evidenceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-purple-400 hover:underline font-black flex items-center gap-1"
                                >
                                  <Video size={16} />
                                  View Evidence
                                </a>

                                <video
                                  src={alert.evidenceUrl}
                                  controls
                                  className="w-44 h-20 object-cover rounded-xl border border-white/10 bg-black"
                                />
                              </div>
                            ) : (
                              <span className="text-gray-500">
                                Not uploaded
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-black border ${
                                priority === "High Priority"
                                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                                  : "bg-green-500/20 text-green-300 border-green-500/30"
                              }`}
                            >
                              {priority}
                            </span>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div className="flex flex-col gap-2">
                              <span
                                className={`w-fit px-3 py-1 rounded-lg text-xs font-black ${
                                  isResolved
                                    ? "bg-green-500/20 text-green-300"
                                    : "bg-red-500/20 text-red-300"
                                }`}
                              >
                                {alert.status || "Active"}
                              </span>

                              {!isResolved && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatus(alert._id, "Resolved")
                                  }
                                  className="w-fit px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-black transition"
                                >
                                  Mark Resolved
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top text-sm text-gray-400">
                            {alert.createdAt
                              ? new Date(alert.createdAt).toLocaleString()
                              : "Unknown"}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleDeleteAlert(alert._id)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-bold hover:bg-red-500/20"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
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
      </main>
    </div>
  );
};

export default AdminDashboard;
