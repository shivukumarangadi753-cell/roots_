import React, { useState, useEffect, useMemo, useRef } from 'react';
import { localDb } from '../lib/supabase';
import { PlantationEvent } from '../types';
import { 
  MapPin, 
  Navigation, 
  Calendar, 
  TreePine, 
  Users, 
  ShieldCheck, 
  ExternalLink, 
  Search,
  Filter
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon issues in bundler
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Haversine formula to compute great-circle distance in kilometers
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Controller component to smoothly reposition Leaflet map
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export const NearbyDrives: React.FC = () => {
  const [events, setEvents] = useState<PlantationEvent[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; label: string } | null>({
    lat: 12.9716,
    lng: 77.5946,
    label: 'Bengaluru (Default)'
  });
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(500);
  const [manualCity, setManualCity] = useState('Bengaluru');
  const [locating, setLocating] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    setEvents(localDb.getEvents());
  }, []);

  // Preset Indian Cities
  const presetCities: Record<string, { lat: number; lng: number }> = {
    'Bengaluru': { lat: 12.9716, lng: 77.5946 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'New Delhi': { lat: 28.6139, lng: 77.2090 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
  };

  const handleCityChange = (cityName: string) => {
    setManualCity(cityName);
    if (presetCities[cityName]) {
      setUserLocation({
        lat: presetCities[cityName].lat,
        lng: presetCities[cityName].lng,
        label: `${cityName}`
      });
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Your Current Device Location'
        });
        setLocating(false);
      },
      (err) => {
        alert('Could not retrieve location. Please choose a city manually.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  // Calculate distances and filter
  const eventsWithDistance = useMemo(() => {
    return events.map((event) => {
      let distanceKm: number | null = null;
      if (userLocation && event.latitude && event.longitude) {
        distanceKm = getDistanceFromLatLonInKm(
          userLocation.lat,
          userLocation.lng,
          event.latitude,
          event.longitude
        );
      }
      return { ...event, distanceKm };
    }).filter(evt => {
      if (evt.distanceKm === null) return true;
      return evt.distanceKm <= maxDistanceKm;
    }).sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
  }, [events, userLocation, maxDistanceKm]);

  const mapCenter: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [20.5937, 78.9629];

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
            Geospatial Discovery
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-charcoal">
            Nearby Plantation Drives
          </h1>
          <p className="mt-2 text-base text-muted leading-relaxed">
            Locate active community afforestation projects relative to your geographical position. Distances are computed securely in-browser without broadcasting your personal location coordinates.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="bg-surface rounded-lg border border-border p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleGetLocation}
              disabled={locating}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              {locating ? 'Requesting GPS...' : 'Use My Current Location'}
            </button>

            <span className="text-xs text-muted">or choose region:</span>

            <select
              value={manualCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="text-xs py-2 px-3 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary font-medium"
            >
              {Object.keys(presetCities).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs text-muted font-medium">Search Radius:</span>
            <select
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="text-xs py-2 px-3 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary font-medium"
            >
              <option value="50">Within 50 km</option>
              <option value="150">Within 150 km</option>
              <option value="500">Within 500 km</option>
              <option value="2000">All Across India</option>
            </select>

            <div className="text-xs text-primary bg-primary-subtle px-2.5 py-1 rounded font-semibold whitespace-nowrap">
              {eventsWithDistance.length} Found
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mb-6 p-3 bg-surface rounded border border-border flex items-center gap-2.5 text-xs text-muted">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Privacy Preserved:</strong> User coordinates are never published, shared, or stored. Only the public organizers' event coordinates are displayed on the map.
          </span>
        </div>

        {/* Interactive Map & List Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Column */}
          <div className="lg:col-span-7 bg-surface rounded-lg border border-border p-2 h-[560px] relative">
            <MapContainer
              center={mapCenter}
              zoom={6}
              scrollWheelZoom={false}
              className="w-full h-full rounded"
            >
              <MapController center={mapCenter} zoom={6} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {eventsWithDistance.map((evt) => (
                <Marker
                  key={evt.id}
                  position={[evt.latitude, evt.longitude]}
                  icon={defaultIcon}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-primary text-sm">{evt.title}</div>
                      <div className="text-muted">{evt.location_name}</div>
                      <div className="text-charcoal">
                        <strong>Date:</strong> {evt.date}
                      </div>
                      <div className="text-charcoal">
                        <strong>Target:</strong> {evt.trees_planned} trees ({evt.tree_species.slice(0, 2).join(', ')})
                      </div>
                      {evt.distanceKm !== null && (
                        <div className="text-primary font-semibold">
                          Approx. {evt.distanceKm} km from your viewpoint
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* List Column */}
          <div className="lg:col-span-5 space-y-4 max-h-[560px] overflow-y-auto pr-1">
            {eventsWithDistance.length === 0 ? (
              <div className="bg-surface rounded-lg border border-border p-8 text-center text-xs text-muted">
                No plantation drives found within {maxDistanceKm} km of {userLocation?.label}. Try increasing the search radius above.
              </div>
            ) : (
              eventsWithDistance.map((evt) => {
                const isSelected = selectedEventId === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventId(evt.id)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary-subtle border-primary'
                        : 'bg-surface border-border hover:border-sage'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-bold font-heading text-charcoal">
                        {evt.title}
                      </h4>
                      {evt.distanceKm !== null && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-bg border border-border text-primary shrink-0">
                          {evt.distanceKm} km
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-muted mb-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{evt.location_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{evt.date} &bull; {evt.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TreePine className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{evt.trees_planned} trees ({evt.tree_species.join(', ')})</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                      <span className="text-muted">
                        Slots: <strong>{evt.volunteer_capacity - evt.registered_count}</strong> left
                      </span>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${evt.latitude},${evt.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Directions
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
