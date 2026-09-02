"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, ZoomControl, GeoJSON, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { STATIONS, Station } from "@/lib/mockData";

// Fix leaflet icon issues with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons (Location Pin + Train)
const createIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon bg-transparent border-none",
    html: `
      <div style="position: relative; width: 40px; height: 52px; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.3));">
        <!-- Map Pin Background -->
        <svg width="40" height="52" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" style="position: absolute; top: 0; left: 0;">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        </svg>
        <!-- Train Icon Foreground -->
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; top: 12px; left: 11px;">
          <rect x="4" y="3" width="16" height="16" rx="2"></rect>
          <path d="M4 11h16"></path>
          <path d="M12 3v8"></path>
          <path d="m8 19-2 3"></path>
          <path d="m18 22-2-3"></path>
          <path d="M8 15h.01"></path>
          <path d="M16 15h.01"></path>
        </svg>
      </div>
    `,
    iconSize: [40, 52],
    iconAnchor: [20, 52],
    popupAnchor: [0, -52],
  });
};

// Cluster icon generator is now inside the component to access state

const neutralIcon = createIcon("#6B7280"); // Gray (unselected)
const originIcon = createIcon("#003C71"); // Navy (origin)
const destIcon = createIcon("#f97316"); // Orange (destination)

interface RouteMapProps {
  origin: string;
  destination: string;
  onSetOrigin: (code: string) => void;
  onSetDestination: (code: string) => void;
}

// Helper to auto-close popup on selection
function PopupCloser({ origin, destination }: { origin: string, destination: string }) {
  const map = useMap();
  useEffect(() => {
    map.closePopup();
  }, [origin, destination, map]);
  return null;
}

export default function RouteMap({ origin, destination, onSetOrigin, onSetDestination }: RouteMapProps) {
  const defaultCenter: [number, number] = [-7.1509, 110.1402];

  const originStation = STATIONS.find(s => s.code === origin);
  const destStation = STATIONS.find(s => s.code === destination);

  const createClusterIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    const markers = cluster.getAllChildMarkers();
    
    let hasOrigin = false;
    let hasDest = false;
    
    for (const marker of markers) {
      const latlng = marker.getLatLng();
      // Using a small epsilon for float comparison just in case, though exact match usually works for static data
      if (originStation && Math.abs(latlng.lat - originStation.lat) < 0.0001 && Math.abs(latlng.lng - originStation.lng) < 0.0001) hasOrigin = true;
      if (destStation && Math.abs(latlng.lat - destStation.lat) < 0.0001 && Math.abs(latlng.lng - destStation.lng) < 0.0001) hasDest = true;
    }
    
    let color = "#6B7280"; // neutral Gray
    if (hasOrigin) color = "#003C71"; // Navy (Origin takes precedence)
    else if (hasDest) color = "#f97316"; // Orange
    
    return L.divIcon({
      className: "custom-cluster-icon bg-transparent border-none",
      html: `
        <div style="position: relative; width: 46px; height: 60px; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.3));">
          <!-- Map Pin Background -->
          <svg width="46" height="60" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5" style="position: absolute; top: 0; left: 0;">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          </svg>
          <!-- Number Foreground -->
          <span style="position: absolute; top: 12px; left: 50%; transform: translateX(-50%); color: #ffffff !important; font-weight: 900 !important; font-size: 16px !important; z-index: 999; display: block; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
            ${count}
          </span>
        </div>
      `,
      iconSize: [46, 60],
      iconAnchor: [23, 60],
    });
  };

  const [railwayData, setRailwayData] = useState<any>(null);

  useEffect(() => {
    // Fetch railway GeoJSON data asynchronously to keep bundle size small
    fetch('/data/railways.json')
      .then(res => res.json())
      .then(data => setRailwayData(data))
      .catch(err => console.error("Failed to load railway data:", err));
  }, []);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer center={defaultCenter} zoom={7} scrollWheelZoom={true} className="w-full h-full" zoomControl={false}>
        <PopupCloser origin={origin} destination={destination} />
        {/* Custom Zoom Control position to avoid overlapping with our UI */}
        <ZoomControl position="bottomright" />

        <LayersControl position="bottomright">
          <LayersControl.BaseLayer checked name="Peta Jalan (Google)">
            <TileLayer
              attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satelit">
            <TileLayer
              attribution='&copy; <a href="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Real-world Railway Tracks (Solid line) */}
        {railwayData && (
          <GeoJSON
            data={railwayData}
            style={{
              color: "#003C71", // KAI Navy
              weight: 3,
              opacity: 0.6
            }}
          />
        )}

        <MarkerClusterGroup
          key={`${origin}-${destination}`} // Force re-render of clusters on selection change
          chunkedLoading
          showCoverageOnHover={false}
          maxClusterRadius={40}
          iconCreateFunction={createClusterIcon}
        >
          {STATIONS.map((station) => {
            const isOrigin = station.code === origin;
            const isDest = station.code === destination;
            const currentIcon = isOrigin ? originIcon : isDest ? destIcon : neutralIcon;
            
            return (
              <Marker
                key={station.id}
                position={[station.lat, station.lng]}
                icon={currentIcon}
              >
                <Popup closeButton={true} minWidth={200}>
                  <div className="flex flex-col gap-3 p-1">
                    <div>
                      <div className="font-bold text-[15px] text-[#003C71]">{station.name}</div>
                      <div className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{station.city} ({station.code})</div>
                    </div>
                    
                    <div className="flex gap-2 w-full mt-1">
                      <button 
                        onClick={() => onSetOrigin(station.code)}
                        className="flex-1 py-1.5 px-2 bg-[#003C71] hover:bg-[#002855] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        Asal
                      </button>
                      <button 
                        onClick={() => onSetDestination(station.code)}
                        className="flex-1 py-1.5 px-2 bg-[#F58220] hover:bg-[#e0751a] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        Tujuan
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
