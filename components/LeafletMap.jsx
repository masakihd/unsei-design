// components/LeafletMap.jsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
// ※ LeafletのCSSは pages/_app.js で読み込んでいる前提（ここでは読み込まない）

// デフォルトのピン画像をNextでも表示できるように差し替え
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


export default function LeafletMap({
  lat = 35.681236,
  lng = 139.767125,
  zoom = 12,
  style = { height: '100%', width: '100%' },
  markers = [],
}) {
  // サーバー側では描画しない
  if (typeof window === 'undefined') return null;

  const center = [lat, lng];

  return (
    <MapContainer center={center} zoom={zoom} style={style} scrollWheelZoom>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((m, i) => (
        <Marker key={i} position={m.position} icon={defaultIcon}>
          {m.label ? <Popup>{m.label}</Popup> : null}
        </Marker>
      ))}
      <Marker position={center} icon={defaultIcon}>
        <Popup>中心地点</Popup>
      </Marker>
    </MapContainer>
  );
}
