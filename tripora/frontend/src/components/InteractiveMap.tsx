import React, { useEffect, useRef } from 'react';
import { Activity } from '../types';
import L from 'leaflet';

interface InteractiveMapProps {
  activities: Activity[];
  destinationName?: string;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  activities,
  destinationName,
  className = 'h-96 w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not yet created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([40.634, 14.6027], 12);

      // Clean, elegant CartoDB Positron tiles for high-end editorial feel
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;

    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Filter valid coordinate activities
    const validActivities = activities.filter(
      (a) => a.latitude !== undefined && a.longitude !== undefined && a.latitude !== null && a.longitude !== null
    );

    if (validActivities.length === 0) {
      // Default view if no coords
      return;
    }

    const latLngs: L.LatLngExpression[] = [];

    validActivities.forEach((act, idx) => {
      const lat = act.latitude!;
      const lng = act.longitude!;
      latLngs.push([lat, lng]);

      // Custom Cobalt numbered pin
      const iconHtml = `
        <div style="
          background-color: #2864D8;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 4px 10px rgba(40,100,216,0.4);
          border: 2px solid #FFFFFF;
        ">
          ${act.order_index || idx + 1}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-tripora-pin',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #1E293B;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #2864D8; margin-bottom: 2px;">
            ${act.start_time} • ${act.category}
          </div>
          <div style="font-weight: 700; font-size: 14px; color: #0F172A; margin-bottom: 4px;">
            ${act.title}
          </div>
          <div style="color: #64748B; margin-bottom: 6px;">
            📍 ${act.location_name}
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: 600; border-top: 1px solid #E2E8F0; padding-top: 4px;">
            <span>⏱ ${act.duration_minutes} min</span>
            <span style="color: #FF786B;">${act.cost > 0 ? `$${act.cost}` : 'Free'}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersGroup.addLayer(marker);
    });

    // Draw connecting route line
    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: '#2864D8',
        weight: 3,
        opacity: 0.6,
        dashArray: '6, 8',
      });
      markersGroup.addLayer(polyline);
    }

    // Fit map bounds
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [activities]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-charcoal-border shadow-soft ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" />
      
      {/* Floating map badge */}
      <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-charcoal-border shadow-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cobalt animate-ping" />
        <span className="text-xs font-semibold text-charcoal">
          {activities.length} Stops Today
        </span>
      </div>
    </div>
  );
};

