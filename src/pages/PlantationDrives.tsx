import React, { useState, useEffect, useMemo } from 'react';
import { localDb } from '../lib/supabase';
import { PlantationEvent } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Users, 
  TreePine, 
  Search, 
  Filter, 
  CheckCircle2, 
  X, 
  AlertCircle,
  PlusCircle,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlantationDrives: React.FC = () => {
  const { user, role, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<PlantationEvent[]>([]);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all'); // all, available, full
  const [selectedEvent, setSelectedEvent] = useState<PlantationEvent | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadEvents = () => {
    setEvents(localDb.getEvents());
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const userRegistrations = useMemo(() => {
    if (!user) return [];
    return localDb.getUserRegistrations(user.id).filter(r => r.status === 'confirmed');
  }, [user, events]);

  const isUserRegistered = (eventId: string) => {
    return userRegistrations.some(r => r.event_id === eventId);
  };

  const handleRegister = (event: PlantationEvent) => {
    if (!user) {
      setNotification({ type: 'error', message: 'Please log in to register as a volunteer.' });
      return;
    }

    const res = localDb.registerForEvent(event.id, user.id);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      loadEvents();
      setSelectedEvent(null);
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const handleCancelRegistration = (eventId: string) => {
    if (!user) return;
    const res = localDb.cancelRegistration(eventId, user.id);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      loadEvents();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = 
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location_name.toLowerCase().includes(search.toLowerCase()) ||
        e.tree_species.some(ts => ts.toLowerCase().includes(search.toLowerCase()));

      const matchesState = selectedState === 'all' || e.state.toLowerCase() === selectedState.toLowerCase();

      const slotsLeft = e.volunteer_capacity - e.registered_count;
      const matchesAvailability = 
        filterAvailability === 'all' ||
        (filterAvailability === 'available' && slotsLeft > 0) ||
        (filterAvailability === 'full' && slotsLeft <= 0);

      return matchesSearch && matchesState && matchesAvailability;
    });
  }, [events, search, selectedState, filterAvailability]);

  // Extract unique states for filter
  const states = useMemo(() => {
    const list = events.map(e => e.state);
    return Array.from(new Set(list));
  }, [events]);

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              Community Restoration Events
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-charcoal">
              Plantation Drives
            </h1>
            <p className="mt-2 text-base text-muted leading-relaxed max-w-2xl">
              Discover organized afforestation drives led by environmental organizations, colleges, and grassroots trusts across India. Reserve a volunteer slot and participate in ground-level restoration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/nearby"
              className="px-4 py-2.5 text-xs font-semibold text-charcoal bg-surface border border-border rounded hover:bg-bg transition-colors"
            >
              Interactive Map &rarr;
            </Link>
            {(role === 'organizer' || role === 'admin') && (
              <Link
                to="/host-drive"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-hover transition-colors shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Host a Drive
              </Link>
            )}
          </div>
        </div>

        {/* Global Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded border text-xs flex items-center justify-between ${
            notification.type === 'success' 
              ? 'bg-primary-subtle border-primary/30 text-primary' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="p-1 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-surface rounded-lg border border-border p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search drives, location, species..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-border rounded focus:outline-none focus:border-primary bg-bg text-charcoal"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
            <span className="text-xs text-muted font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            {/* State filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="text-xs py-1.5 px-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
            >
              <option value="all">All States</option>
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Availability filter */}
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="text-xs py-1.5 px-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
            >
              <option value="all">All Availability</option>
              <option value="available">Slots Available</option>
              <option value="full">Full / Waitlist</option>
            </select>

            {(selectedState !== 'all' || filterAvailability !== 'all' || search) && (
              <button
                onClick={() => {
                  setSelectedState('all');
                  setFilterAvailability('all');
                  setSearch('');
                }}
                className="text-xs text-primary hover:underline px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const slotsLeft = event.volunteer_capacity - event.registered_count;
            const registered = isUserRegistered(event.id);
            const isFull = slotsLeft <= 0;

            return (
              <div 
                key={event.id}
                className="bg-surface rounded-lg border border-border overflow-hidden flex flex-col justify-between hover:border-sage transition-all duration-200"
              >
                <div>
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={event.poster_url} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-surface/95 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold text-charcoal border border-border">
                      {event.state}
                    </div>
                    {event.status === 'completed' && (
                      <div className="absolute top-3 left-3 bg-primary text-white px-2.5 py-1 rounded text-xs font-semibold">
                        Completed
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="text-xs text-muted mb-1">
                      Organized by {event.organizer_name}
                    </div>
                    <h3 className="text-lg font-bold font-heading text-charcoal mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-xs text-charcoal bg-bg p-3.5 rounded border border-border mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{event.date} &bull; {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{event.location_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TreePine className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Target: {event.trees_planned} saplings ({event.tree_species.join(', ')})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Soil Zone: {event.soil_type}</span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between text-xs text-muted">
                        <span>Volunteer Capacity</span>
                        <span className="font-semibold text-charcoal">
                          {event.registered_count} / {event.volunteer_capacity}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(100, (event.registered_count / event.volunteer_capacity) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-border/60 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted block">Availability:</span>
                    <span className={`text-xs font-semibold ${isFull ? 'text-olive' : 'text-charcoal'}`}>
                      {isFull ? 'Capacity Reached' : `${slotsLeft} slots remaining`}
                    </span>
                  </div>

                  <div>
                    {registered ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-primary bg-primary-subtle px-2 py-1 rounded">
                          Registered
                        </span>
                        <button
                          onClick={() => handleCancelRegistration(event.id)}
                          className="text-xs text-muted hover:text-red-700 underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedEvent(event)}
                        disabled={isFull || event.status === 'completed'}
                        className={`px-4 py-2 text-xs font-semibold rounded transition-colors ${
                          isFull || event.status === 'completed'
                            ? 'bg-border text-muted cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary-hover shadow-sm'
                        }`}
                      >
                        {event.status === 'completed' ? 'Event Concluded' : isFull ? 'Drive Full' : 'Register Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Registration Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface rounded-lg max-w-lg w-full border border-border shadow-card p-6 sm:p-8">
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Volunteer Confirmation
                  </span>
                  <h3 className="text-xl font-bold font-heading text-charcoal">
                    {selectedEvent.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 text-muted hover:text-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-charcoal">
                <div className="bg-bg p-3 rounded border border-border space-y-1.5">
                  <div><strong>Date:</strong> {selectedEvent.date} ({selectedEvent.time})</div>
                  <div><strong>Location:</strong> {selectedEvent.location_name}</div>
                  <div><strong>Target Planting:</strong> {selectedEvent.trees_planned} saplings</div>
                  <div><strong>Target Species:</strong> {selectedEvent.tree_species.join(', ')}</div>
                </div>

                <div className="text-muted leading-relaxed">
                  By registering, you commit to arriving on time and following our scientific sapling placement guidelines. Protective gloves and sapling stakes will be distributed by the host organization.
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 text-xs font-semibold text-charcoal bg-bg border border-border rounded hover:bg-border"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRegister(selectedEvent)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-hover shadow-sm"
                >
                  Confirm Registration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
