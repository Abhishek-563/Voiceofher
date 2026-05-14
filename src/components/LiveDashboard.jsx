import { useEffect, useState } from "react";
import { Activity, MapPin, ShieldCheck, Video } from "lucide-react";
import { sosAPI } from "../services/api";

const LiveDashboard = () => {
  const [stats, setStats] = useState({
    totalAlerts: 0,
    activeAlerts: 0,
    resolvedAlerts: 0,
    evidenceCount: 0,
  });

  const [latestAlert, setLatestAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await sosAPI.getHistory();
      const alerts = res.data.alerts || res.data || [];

      const safeAlerts = Array.isArray(alerts) ? alerts : [];

      const totalAlerts = safeAlerts.length;
      const activeAlerts = safeAlerts.filter(
        (alert) => alert.status === "Active"
      ).length;
      const resolvedAlerts = safeAlerts.filter(
        (alert) => alert.status === "Resolved"
      ).length;
      const evidenceCount = safeAlerts.filter(
        (alert) => alert.evidenceUrl
      ).length;

      setStats({
        totalAlerts,
        activeAlerts,
        resolvedAlerts,
        evidenceCount,
      });

      setLatestAlert(safeAlerts[0] || null);
    } catch (error) {
      console.error("Failed to load live dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 15000);

    return () => clearInterval(interval);
  }, []);

  const mapLink =
    latestAlert?.latitude && latestAlert?.longitude
      ? `https://www.google.com/maps?q=${latestAlert.latitude},${latestAlert.longitude}`
      : null;

  return (
    <section
      id="live-dashboard"
      className="relative py-24 px-6 bg-[#050816] text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-pink-400 font-bold uppercase tracking-[0.25em]">
            Live Safety Overview
          </p>

          <h2 className="text-4xl md:text-5xl font-black mt-4">
            Real-Time Emergency Dashboard
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Track SOS alerts, live location activity, evidence uploads, and
            emergency response status.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-400">
            Loading live dashboard...
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-10">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <Activity className="text-pink-400 mb-4" size={30} />
                <p className="text-gray-400">Total Alerts</p>
                <h3 className="text-4xl font-black mt-2">
                  {stats.totalAlerts}
                </h3>
              </div>

              <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
                <ShieldCheck className="text-red-400 mb-4" size={30} />
                <p className="text-gray-400">Active Alerts</p>
                <h3 className="text-4xl font-black mt-2">
                  {stats.activeAlerts}
                </h3>
              </div>

              <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6">
                <ShieldCheck className="text-green-400 mb-4" size={30} />
                <p className="text-gray-400">Resolved</p>
                <h3 className="text-4xl font-black mt-2">
                  {stats.resolvedAlerts}
                </h3>
              </div>

              <div className="rounded-3xl border border-purple-500/30 bg-purple-500/10 p-6">
                <Video className="text-purple-400 mb-4" size={30} />
                <p className="text-gray-400">Evidence Uploaded</p>
                <h3 className="text-4xl font-black mt-2">
                  {stats.evidenceCount}
                </h3>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1024] p-8 shadow-2xl">
              <h3 className="text-2xl font-black mb-6">
                Latest Emergency Activity
              </h3>

              {latestAlert ? (
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <p className="text-gray-400 mb-2">User</p>
                    <h4 className="text-2xl font-black">
                      {latestAlert.name || latestAlert.user?.name || "Unknown"}
                    </h4>

                    <p className="text-gray-400 mt-1">
                      {latestAlert.email ||
                        latestAlert.user?.email ||
                        "No email available"}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-black ${
                          latestAlert.status === "Resolved"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {latestAlert.status || "Active"}
                      </span>

                      {mapLink && (
                        <a
                          href={mapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-pink-500/20 text-pink-300 font-black flex items-center gap-2"
                        >
                          <MapPin size={16} />
                          View Location
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    {latestAlert.evidenceUrl ? (
                      <video
                        src={latestAlert.evidenceUrl}
                        controls
                        className="w-full max-h-72 rounded-2xl border border-white/10 bg-black"
                      />
                    ) : (
                      <div className="h-64 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-500">
                        No evidence uploaded yet
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">No recent SOS activity.</div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LiveDashboard;
