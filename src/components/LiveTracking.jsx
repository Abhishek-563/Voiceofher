import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from "react-leaflet";
import { motion } from "framer-motion";
import { MapPinned, Navigation, Shield, RefreshCw } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const customIcon = L.divIcon({
  html: `
    <div style="
      width:36px;height:36px;border-radius:50%;
      background:linear-gradient(135deg,#ec4899,#8b5cf6);
      display:flex;align-items:center;justify-content:center;
      border:3px solid white;
      box-shadow:0 0 20px rgba(236,72,153,0.6);
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`,
  className: "",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const LiveTracking = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [accuracy, setAccuracy] = useState(null);
  const [path, setPath] = useState([]);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [speedMps, setSpeedMps] = useState(null);

  const toRad = (value) => (value * Math.PI) / 180;
  const calculateDistance = (from, to) => {
    const R = 6371000; // Earth radius in meters
    const dLat = toRad(to.lat - from.lat);
    const dLon = toRad(to.lng - from.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const updatePosition = (pos) => {
    const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    setLocation(current);
    setAccuracy(pos.coords.accuracy);
    setSpeedMps(pos.coords.speed || null);

    setPath((prev) => {
      if (!prev.length) {
        return [current];
      }
      const last = prev[prev.length - 1];
      const delta = calculateDistance(last, current);
      setDistanceMeters((prevDistance) => prevDistance + delta);
      return [...prev, current];
    });
    setLoading(false);
  };

  const getLocation = () => {
    setLoading(true);
    setError("");
    setPath([]);
    setDistanceMeters(0);
    setSpeedMps(null);
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updatePosition(pos);
      },
      (err) => {
        setError(err.code === 1 ? "Location access denied. Please allow permissions." : "Unable to retrieve location.");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getLocation();
    let watchId = null;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        updatePosition,
        (err) => {
          console.error("Watch position error:", err);
        },
        { enableHighAccuracy: true, maximumAge: 8000, timeout: 15000 }
      );
    }
    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <section id="tracking" style={{ padding: "6rem 2rem", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }} style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 className="section-title">
            Live GPS <span className="gradient-text">Emergency Tracking</span>
          </h2>
          <p className="section-subtitle">Real-time location monitoring for instant emergency response.</p>
        </motion.div>

        {/* Map container */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          style={{
            borderRadius: "var(--radius-xl)", overflow: "hidden",
            border: "1px solid var(--border)",
            boxShadow: "0 0 60px rgba(236,72,153,0.1), 0 20px 60px rgba(0,0,0,0.5)",
            position: "relative",
          }}>

          {/* Top bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, zIndex: 1000,
            background: "rgba(5,8,22,0.85)", backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
            padding: "12px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <MapPinned size={18} color="var(--pink)" />
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Live Location Monitor</span>
              {!loading && !error && (
                <span className="status-badge status-online">
                  <span className="pulse-dot" /> Active
                </span>
              )}
              {location && (
                <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {distanceMeters > 0 && (
                <div style={{ color: "var(--text-secondary)", fontSize: "0.78rem", minWidth: 140 }}>
                  <strong>Distance:</strong> {(distanceMeters / 1000).toFixed(2)} km
                </div>
              )}
              {speedMps !== null && (
                <div style={{ color: "var(--text-secondary)", fontSize: "0.78rem", minWidth: 130 }}>
                  <strong>Speed:</strong> {(speedMps * 3.6).toFixed(1)} km/h
                </div>
              )}
              <button onClick={getLocation}
                style={{
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  borderRadius: 8, padding: "6px 8px", cursor: "pointer",
                  color: "var(--text-secondary)", display: "flex", alignItems: "center",
                }}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Map or states */}
          {loading ? (
            <div style={{
              height: 500, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              background: "var(--bg-secondary)", gap: 16,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: "3px solid var(--border)", borderTopColor: "var(--pink)",
                animation: "spin-slow 0.8s linear infinite",
              }} />
              <p style={{ color: "var(--text-muted)" }}>Acquiring GPS signal…</p>
            </div>
          ) : error ? (
            <div style={{
              height: 500, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              background: "var(--bg-secondary)", gap: 12, padding: 32,
            }}>
              <MapPinned size={48} color="var(--text-muted)" />
              <p style={{ color: "#fca5a5", textAlign: "center" }}>{error}</p>
              <button onClick={getLocation} className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.9rem" }}>
                Retry
              </button>
            </div>
          ) : (
            <div style={{ paddingTop: 52 }}>
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={15}
                style={{ height: 500, width: "100%" }}
                zoomControl={false}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {path.length > 1 && (
                  <Polyline
                    positions={path.map((point) => [point.lat, point.lng])}
                    pathOptions={{ color: "#ec4899", weight: 4, dashArray: "8 6", opacity: 0.85 }}
                  />
                )}
                <Marker position={[location.lat, location.lng]} icon={customIcon}>
                  <Popup>
                    <div style={{ fontFamily: "var(--font-main)", fontSize: "0.85rem" }}>
                      <strong>Your Location</strong><br />
                      {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                      {accuracy && <><br /><span style={{ color: "#888" }}>Accuracy: ~{Math.round(accuracy)}m</span></>}
                    </div>
                  </Popup>
                </Marker>
                {accuracy && (
                  <Circle center={[location.lat, location.lng]} radius={accuracy}
                    pathOptions={{ color: "#ec4899", fillColor: "#ec4899", fillOpacity: 0.08, weight: 1, dashArray: "4 4" }} />
                )}
              </MapContainer>
            </div>
          )}
        </motion.div>

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginTop: "2rem" }}>
          {[
            { icon: Navigation, label: "Live Monitoring", desc: "Track emergency movement in real-time", color: "var(--pink)" },
            { icon: Shield, label: "Instant Alerts", desc: "Emergency contacts receive immediate updates", color: "var(--purple)" },
            { icon: MapPinned, label: "Precision GPS", desc: "High-accuracy location within meters", color: "#06b6d4" },
          ].map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)", padding: "1.5rem",
                display: "flex", gap: 14, alignItems: "flex-start",
              }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: c.color + "18", border: `1px solid ${c.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center", color: c.color,
              }}>
                <c.icon size={18} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 4 }}>{c.label}</h4>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.5 }}>{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveTracking;
