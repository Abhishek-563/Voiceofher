import { useEffect, useState } from "react";

import { io } from "socket.io-client";

import { motion } from "framer-motion";

import {
  ShieldAlert,
  Siren,
  Users,
  Activity,
  MapPinned,
  BellRing,
} from "lucide-react";

const socket = io("http://localhost:5000");

const AdminDashboard = () => {

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {

    socket.on("newSOS", (data) => {

      setAlerts((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("newSOS");
    };

  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden">

      {/* Sidebar */}
      <aside className="w-[260px] bg-white/5 border-r border-white/10 backdrop-blur-xl p-8">

        <h1 className="text-3xl font-black mb-12">
          Voice of Her
        </h1>

        <nav className="space-y-6">

          <div className="flex items-center gap-3 text-pink-400">
            <ShieldAlert />
            <span>Dashboard</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <Siren />
            <span>Emergencies</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <Users />
            <span>Users</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <Activity />
            <span>Analytics</span>
          </div>

        </nav>

      </aside>

      {/* Main */}
      <main className="flex-1 p-10 overflow-y-auto">

        {/* Top */}
        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-black">
              Emergency Control Center
            </h1>

            <p className="text-gray-400 mt-3">
              Real-time monitoring of active SOS alerts.
            </p>

          </div>

          <div className="flex items-center gap-3 bg-red-500/20 px-5 py-3 rounded-2xl border border-red-500/20">

            <BellRing className="text-red-400"/>

            <span>
              {alerts.length} Active Alerts
            </span>

          </div>

        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mt-14">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

            <h2 className="text-gray-400">
              Active Emergencies
            </h2>

            <h1 className="text-5xl font-black mt-4 text-red-400">
              {alerts.length}
            </h1>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

            <h2 className="text-gray-400">
              Protected Users
            </h2>

            <h1 className="text-5xl font-black mt-4 text-pink-400">
              15K
            </h1>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

            <h2 className="text-gray-400">
              NGOs Connected
            </h2>

            <h1 className="text-5xl font-black mt-4 text-purple-400">
              500
            </h1>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

            <h2 className="text-gray-400">
              Response Time
            </h2>

            <h1 className="text-5xl font-black mt-4 text-green-400">
              2m
            </h1>

          </div>

        </div>

        {/* Live Alerts */}
        <div className="mt-16">

          <h1 className="text-4xl font-black">
            Live Emergency Feed
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mt-10">

            {alerts.length === 0 && (

              <div className="text-gray-500">
                No active emergencies.
              </div>
            )}

            {alerts.map((alert) => (

              <motion.div
                key={alert.id}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="bg-white/5 border border-red-500/20 rounded-3xl p-8 relative overflow-hidden"
              >

                {/* Glow */}
                <div className="absolute inset-0 bg-red-500/10 blur-[100px]" />

                <div className="relative z-10">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <Siren className="text-red-500"/>

                      <h2 className="text-2xl font-black">
                        Active SOS
                      </h2>

                    </div>

                    <span className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm">
                      ACTIVE
                    </span>

                  </div>

                  {/* Coordinates */}
                  <div className="mt-8 space-y-4">

                    <div className="flex items-center gap-3">
                      <MapPinned className="text-pink-400"/>
                      <span>
                        {alert.location.lat}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPinned className="text-purple-400"/>
                      <span>
                        {alert.location.lng}
                      </span>
                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 mt-10">

                    <button className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 font-bold">
                      Dispatch Help
                    </button>

                    <button className="flex-1 py-3 rounded-2xl border border-white/10 bg-white/5">
                      Track Live
                    </button>

                  </div>

                </div>

              </motion.div>
            ))}

          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;
