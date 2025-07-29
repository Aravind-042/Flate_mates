import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Get Mapbox token from Supabase secrets via edge function
const getMapboxToken = async (): Promise<string> => {
  try {
    const response = await fetch('/api/mapbox-token');
    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
  } catch (error) {
    console.error('Error fetching Mapbox token:', error);
  }
  return '';
};

interface LocationMapProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  markers?: Array<{
    coordinates: [number, number];
    title?: string;
    description?: string;
  }>;
  height?: string;
  width?: string;
  className?: string;
  onMapClick?: (coordinates: [number, number]) => void;
  interactive?: boolean;
}

export const LocationMap = ({
  center = [77.2090, 28.6139], // Default to Delhi
  zoom = 10,
  markers = [],
  height = "400px",
  width = "100%",
  className = "",
  onMapClick,
  interactive = true
}: LocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapMarkersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      const token = await getMapboxToken();
      if (!token) {
        console.error('Mapbox token not available');
        return;
      }

      mapboxgl.accessToken = token;

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
        interactive: interactive
      });

      // Add navigation controls if interactive
      if (interactive) {
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      }

      // Handle map clicks
      if (onMapClick) {
        map.current.on('click', (e) => {
          onMapClick([e.lngLat.lng, e.lngLat.lat]);
        });
      }

      // Add markers
      addMarkers();
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update markers when markers prop changes
  useEffect(() => {
    if (map.current) {
      addMarkers();
    }
  }, [markers]);

  // Update center when center prop changes
  useEffect(() => {
    if (map.current && center) {
      map.current.setCenter(center);
    }
  }, [center]);

  const addMarkers = () => {
    if (!map.current) return;

    // Remove existing markers
    mapMarkersRef.current.forEach(marker => marker.remove());
    mapMarkersRef.current = [];

    // Add new markers
    markers.forEach(markerData => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMzQgMiA1IDUuMTM0IDUgOUM1IDEzLjUgMTIgMjIgMTIgMjJTMTkgMTMuNSAxOSA5QzE5IDUuMTM0IDE1Ljg2NiAyIDEyIDJaTTEyIDExLjVDMTAuNjE5IDExLjUgOS41IDEwLjM4MSA5LjUgOUM5LjUgNy42MTkgMTAuNjE5IDYuNSAxMiA2LjVDMTMuMzgxIDYuNSAxNC41IDcuNjE5IDE0LjUgOUMxNC41IDEwLjM4MSAxMy4zODEgMTEuNSAxMiAxMS41WiIgZmlsbD0iIzM5NGZiZCIvPgo8L3N2Zz4K)';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.backgroundSize = 'contain';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(markerData.coordinates)
        .addTo(map.current!);

      // Add popup if title or description provided
      if (markerData.title || markerData.description) {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              ${markerData.title ? `<h3 class="font-semibold text-sm">${markerData.title}</h3>` : ''}
              ${markerData.description ? `<p class="text-xs text-slate-600 mt-1">${markerData.description}</p>` : ''}
            </div>
          `);
        
        marker.setPopup(popup);
      }

      mapMarkersRef.current.push(marker);
    });
  };

  return (
    <div 
      ref={mapContainer} 
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height, width }}
    />
  );
};