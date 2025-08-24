// components/LeafletMap.jsx
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import L from "leaflet";
import { useMemo } from "react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export default function LeafletMap({
  center = [35.681236, 139.767125], // 東京駅
  zoom = 12,
  markers = [{ position: [35.681236, 139.767125], label: "Tokyo Station" }],
  height = 360,
}) {
  // マーカーピンを /public/leaflet 配下から確実に配信する
  const defaultIcon = useMemo(() => {
    return L.icon({
      iconUrl: "/leaflet/marker-icon.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      shadowUrl: "/leaflet/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }, []);

  const style = { width: "100%", height };

  return (
    <div style={style}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom style={style}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={m.position} icon={defaultIcon}>
            {m.label && <Popup>{m.label}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
