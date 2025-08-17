import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Get Mapbox token from Supabase secrets via edge function
const getMapboxToken = async (): Promise<string> => {
  try {
    // Try to get from Supabase function
    const response = await fetch(`https://yotshodiprpprkyonwno.supabase.co/functions/v1/mapbox-token`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdHNob2RpcHJwcHJreW9ud25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2ODUxOTksImV4cCI6MjA2NDI2MTE5OX0.NB2uGqScaOd_v4FJxt4zNrbIN3_GwDZ3qwF9_K7IKR0`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
  } catch (error) {
    console.error('Error fetching Mapbox token:', error);
  }
  
  // Fallback: Show instructions to add token
  console.warn('Mapbox token not configured. Please add MAPBOX_PUBLIC_TOKEN to Supabase Edge Function Secrets.');
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
  const [isTokenMissing, setIsTokenMissing] = React.useState(false);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      const token = await getMapboxToken();
      if (!token) {
        console.error('Mapbox token not available');
        setIsTokenMissing(true);
        return;
      }

      setIsTokenMissing(false);
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
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height, width }}>
      {isTokenMissing ? (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
          <div className="text-center p-8">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Map Configuration Required</h3>
            <p className="text-sm text-slate-600 mb-4 max-w-md">
              To display the interactive map, please add your Mapbox public token to the Supabase Edge Function Secrets.
            </p>
            <p className="text-xs text-slate-500">
              Get your token at <span className="font-mono bg-slate-200 px-1 rounded">https://mapbox.com</span>
            </p>
          </div>
        </div>
      ) : (
        <div ref={mapContainer} className="w-full h-full" />
      )}
    </div>
  );
};