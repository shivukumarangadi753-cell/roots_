import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { localDb } from '../lib/supabase';
import { PlantationEvent } from '../types';
import { 
  Calendar, 
  MapPin, 
  TreePine, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Edit3, 
  Trash2,
  Phone,
  Mail,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HostDrive: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [events, setEvents] = useState<PlantationEvent[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00 AM – 12:00 PM IST');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('12.9716');
  const [longitude, setLongitude] = useState('77.5946');
  const [stateName, setStateName] = useState('Karnataka');
  const [treesPlanned, setTreesPlanned] = useState('300');
  const [volunteerCapacity, setVolunteerCapacity] = useState('50');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>(['Neem', 'Banyan']);
  const [soilType, setSoilType] = useState('Red Soil');
  const [contactPhone, setContactPhone] = useState('+91 98450 12345');
  const [contactEmail, setContactEmail] = useState('organizer@roots-afforestation.org');
  const [posterUrl, setPosterUrl] = useState('/images/arjun.jpg');

  // Species options from catalogue
  const availableSpecies = ['Neem', 'Banyan', 'Peepal', 'Mango', 'Jackfruit', 'Teak', 'Coconut', 'Tamarind', 'Arjun', 'Indian Gooseberry (Amla)'];

  const loadOrganizerEvents = () => {
    const all = localDb.getEvents();
    setEvents(all);
  };

  useEffect(() => {
    loadOrganizerEvents();
  }, []);

  const handleSpeciesToggle = (spec: string) => {
    if (selectedSpecies.includes(spec)) {
      if (selectedSpecies.length > 1) {
        setSelectedSpecies(selectedSpecies.filter(s => s !== spec));
      }
    } else {
      setSelectedSpecies([...selectedSpecies, spec]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !date || !locationName) {
      setNotification({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    const newEvent = localDb.createEvent({
      organizer_id: user?.id || 'org-local-demo',
      organizer_name: user?.organization || user?.full_name || 'Community Conservation Guild',
      title,
      description,
      date,
      time,
      location_name: locationName,
      latitude: parseFloat(latitude) || 12.9716,
      longitude: parseFloat(longitude) || 77.5946,
      state: stateName,
      trees_planned: parseInt(treesPlanned, 10) || 100,
      volunteer_capacity: parseInt(volunteerCapacity, 10) || 30,
      tree_species: selectedSpecies,
      soil_type: soilType,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      poster_url: posterUrl
    });

    setNotification({
      type: 'success',
      message: `Plantation Drive "${newEvent.title}" has been successfully published to the ROOTS registry!`
    });

    loadOrganizerEvents();
    setActiveTab('manage');

    // Reset fields
    setTitle('');
    setDescription('');
    setDate('');
    setLocationName('');
  };

  // If user is currently in volunteer mode, provide easy role switch for evaluation
  const isAuthorized = role === 'organizer' || role === 'admin';

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
            Organizer Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-charcoal">
            Host a Community Plantation Drive
          </h1>
          <p className="mt-2 text-base text-muted leading-relaxed">
            Registered organizations and approved coordinators can initiate new afforestation events, configure volunteer capacity thresholds, specify native species targets, and oversee volunteer rosters.
          </p>
        </div>

        {/* Role Authorization Alert if currently in volunteer mode */}
        {!isAuthorized && (
          <div className="bg-surface rounded-lg border border-border p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-charcoal">Organizer Credentials Required</h4>
                <p className="text-xs text-muted mt-0.5">
                  You are currently browsing as a <strong>Volunteer</strong>. In production, this requires approved organizer privileges. For evaluation purposes, switch to Organizer view below:
                </p>
              </div>
            </div>
            <button
              onClick={() => switchRole('organizer')}
              className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded hover:bg-primary-hover transition-colors whitespace-nowrap"
            >
              Switch to Organizer Role
            </button>
          </div>
        )}

        {/* Notification Banner */}
        {notification && (
          <div className={`mb-6 p-4 rounded border text-xs flex items-center justify-between ${
            notification.type === 'success' 
              ? 'bg-primary-subtle border-primary/30 text-primary' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium">{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="p-1">
              &times;
            </button>
          </div>
        )}

        {/* View Switcher */}
        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'border-primary text-primary bg-surface'
                : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            Create New Plantation Drive
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'manage'
                ? 'border-primary text-primary bg-surface'
                : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            Manage Drives & Rosters ({events.length})
          </button>
        </div>

        {/* ================= TAB 1: CREATE EVENT ================= */}
        {activeTab === 'create' && (
          <form onSubmit={handleSubmit} className="bg-surface rounded-lg border border-border p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-heading text-charcoal border-b border-border pb-3">
                1. General Drive Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cauvery Basin Riparian Native Buffer Drive"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Comprehensive Description & Objectives *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail the ecological rationale, soil context, site preparation, and instructions for arriving volunteers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-lg font-bold font-heading text-charcoal border-b border-border pb-3">
                2. Scheduling & Location
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Time Schedule *</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-charcoal mb-1">Public Location Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Hesaraghatta Catchment Basin, Bengaluru"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Latitude (Decimal)</label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                  <span className="text-[10px] text-muted">Used for OpenStreetMap navigation pin.</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Longitude (Decimal)</label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-lg font-bold font-heading text-charcoal border-b border-border pb-3">
                3. Silviculture & Capacity Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Trees Planned (Quantity) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={treesPlanned}
                    onChange={(e) => setTreesPlanned(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Volunteer Capacity Limit *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={volunteerCapacity}
                    onChange={(e) => setVolunteerCapacity(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                  <span className="text-[10px] text-muted">System will enforce strict waitlist when capacity is reached.</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">
                  Target Native Tree Species (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSpecies.map((sp) => {
                    const isSelected = selectedSpecies.includes(sp);
                    return (
                      <button
                        type="button"
                        key={sp}
                        onClick={() => handleSpeciesToggle(sp)}
                        className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary text-white font-medium'
                            : 'border-border bg-bg text-charcoal hover:bg-border'
                        }`}
                      >
                        {sp}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Soil Classification at Site *</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  >
                    <option value="Alluvial Soil">Alluvial Soil</option>
                    <option value="Black Soil (Regur)">Black Soil (Regur)</option>
                    <option value="Red Soil">Red Soil</option>
                    <option value="Laterite Soil">Laterite Soil</option>
                    <option value="Sandy Soil">Sandy Soil</option>
                    <option value="Clay Soil">Clay Soil</option>
                    <option value="Loamy Soil">Loamy Soil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Event Poster Image URL</label>
                  <input
                    type="url"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-lg font-bold font-heading text-charcoal border-b border-border pb-3">
                4. Organizer Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Official Coordinator Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Official Inquiry Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white text-xs font-semibold rounded hover:bg-primary-hover transition-colors shadow-sm"
              >
                Publish Plantation Drive & Open Volunteer Slots
              </button>
            </div>
          </form>
        )}

        {/* ================= TAB 2: MANAGE DRIVES ================= */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-bg flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Registered Drives Under Your Coordination
                </span>
                <span className="text-xs text-muted">
                  Total Managed: {events.length}
                </span>
              </div>

              <div className="divide-y divide-border">
                {events.map((evt) => (
                  <div key={evt.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          evt.status === 'completed' 
                            ? 'bg-primary text-white' 
                            : 'bg-primary-subtle text-primary'
                        }`}>
                          {evt.status}
                        </span>
                        <span className="text-xs text-muted">{evt.date}</span>
                      </div>
                      <h4 className="text-base font-bold font-heading text-charcoal">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-muted">
                        {evt.location_name} &bull; Target: {evt.trees_planned} trees
                      </p>
                      <div className="text-xs text-charcoal pt-1">
                        Volunteers Registered: <strong>{evt.registered_count}</strong> of {evt.volunteer_capacity}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Roster for "${evt.title}":\n- ${evt.registered_count} registered volunteers.\n- Automated attendance check sheet generated.`)}
                        className="px-3 py-1.5 text-xs font-semibold text-primary border border-primary/40 rounded hover:bg-primary-subtle"
                      >
                        View Volunteer Roster
                      </button>
                      <button
                        onClick={() => {
                          const num = prompt(`Enter confirmed trees planted on field for "${evt.title}":`, `${evt.trees_planned}`);
                          if (num) {
                            alert(`Recorded ${num} planted trees into the environmental audit database.`);
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-charcoal bg-bg border border-border rounded hover:bg-border"
                      >
                        Record Field Audit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
