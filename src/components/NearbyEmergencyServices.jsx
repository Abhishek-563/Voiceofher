import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import {
  Hospital,
  ShieldAlert,
  MapPin,
  Navigation,
  RefreshCcw,
} from "lucide-react";

const userIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [35, 35],
});

const hospitalIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
  iconSize: [35, 35],
});

const policeIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/3063/3063176.png",
  iconSize: [35, 35],
});

const NearbyEmergencyServices = () => {
  const [location, setLocation] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fallbackLocation = {
    lat: 17.6868,
    lng: 83.2185,
  };

  const getCurrentLocation = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(coords);
        fetchNearbyServices(coords);
      },
      (error) => {
        console.log("Location error:", error);

        setLocation(fallbackLocation);
        fetchNearbyServices(fallbackLocation);
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const fetchNearbyServices = async (coords) => {
    try {
      setLoading(true);

      const radius = 5000;

      const query = `
        [out:json];
        (
          node["amenity"="hospital"](around:${radius},${coords.lat},${coords.lng});
          node["amenity"="police"](around:${radius},${coords.lat},${coords.lng});
          way["amenity"="hospital"](around:${radius},${coords.lat},${coords.lng});
          way["amenity"="police"](around:${radius},${coords.lat},${coords.lng});
        );
        out center;
      `;

      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          body: query,
        }
      );

      const data = await response.json();

      const places = data.elements.map((item) => {
        const lat = item.lat || item.center?.lat;
        const lng = item.lon || item.center?.lon;

        return {
          id: item.id,
          name:
            item.tags?.name ||
            (item.tags?.amenity === "hospital"
              ? "Nearby Hospital"
              : "Nearby Police Station"),
          type: item.tags?.amenity,
          lat,
          lng,
        };
      });

      setServices(places);
    } catch (error) {
      console.log("Overpass error:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  if (!location) {
    return (
      <section className="py-28 px-6 text-center text-white">
        Loading nearby emergency services...
      </section>
    );
  }

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute left-0 top-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            y: 60,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="text-center"
        >
          <h1 className="text-5xl font-black">
            Nearby
            <span className="bg-gradient-to-r from-blue-400 to-pink-500 text-transparent bg-clip-text">
              {" "}Emergency Services
            </span>
          </h1>

          <p className="text-gray-400 mt-5">
            Find nearby hospitals and police stations using free OpenStreetMap data.
          </p>

          <button
            onClick={getCurrentLocation}
            className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-pink-600 font-bold inline-flex items-center gap-3 hover:scale-105 transition"
          >
            <RefreshCcw />
            Refresh Nearby Services
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 mt-16">
          {/* Map */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] overflow-hidden p-4">
            <div className="rounded-[28px] overflow-hidden">
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={14}
                style={{
                  height: "550px",
                  width: "100%",
                }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                  position={[location.lat, location.lng]}
                  icon={userIcon}
                >
                  <Popup>Your Current Location</Popup>
                </Marker>

                <Circle
                  center={[location.lat, location.lng]}
                  radius={5000}
                  pathOptions={{
                    color: "blue",
                    fillColor: "blue",
                    fillOpacity: 0.08,
                  }}
                />

                {services.map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lng]}
                    icon={
                      place.type === "hospital"
                        ? hospitalIcon
                        : policeIcon
                    }
                  >
                    <Popup>
                      <strong>{place.name}</strong>
                      <br />
                      {place.type}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* List */}
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black">
                Emergency Places
              </h2>

              <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-300">
                {services.length} Found
              </span>
            </div>

            {loading && (
              <p className="text-gray-400 mt-8">
                Searching nearby places...
              </p>
            )}

            {!loading && services.length === 0 && (
              <p className="text-gray-400 mt-8">
                No nearby emergency services found. Try refreshing or increasing radius later.
              </p>
            )}

            <div className="space-y-5 mt-8 max-h-[470px] overflow-y-auto pr-2">
              {services.map((place) => (
                <div
                  key={place.id}
                  className="bg-black/20 border border-white/10 rounded-3xl p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {place.type === "hospital" ? (
                        <Hospital className="text-red-400" />
                      ) : (
                        <ShieldAlert className="text-blue-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold">
                        {place.name}
                      </h3>

                      <p className="text-gray-400 mt-2 capitalize flex items-center gap-2">
                        <MapPin size={16} />
                        {place.type}
                      </p>

                      <a
                        href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-pink-400 hover:text-pink-300"
                      >
                        <Navigation size={16} />
                        Open in Maps
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NearbyEmergencyServices;
