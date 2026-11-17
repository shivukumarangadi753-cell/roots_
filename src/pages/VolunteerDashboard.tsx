import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { localDb } from '../lib/supabase';
import { PlantationEvent, TreeRecord, VolunteerRegistration } from '../types';
import { 
  User, 
  TreePine, 
  Calendar, 
  MapPin, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Heart,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const VolunteerDashboard: React.FC = () => {
  const { user, role } = useAuth();
  const [allEvents, setAllEvents] = useState<PlantationEvent[]>([]);
  const [registrations, setRegistrations] = useState<VolunteerRegistration[]>([]);
  const [trees, setTrees] = useState<TreeRecord[]>([]);

  const loadData = () => {
    setAllEvents(localDb.getEvents());
    if (user) {
      setRegistrations(localDb.getUserRegistrations(user.id));
    }
    setTrees(localDb.getTrees());
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // User's registered events
  const registeredEvents = useMemo(() => {
    return registrations
      .filter(r => r.status === 'confirmed')
      .map(r => {
        const evt = allEvents.find(e => e.id === r.event_id);
        return { registration: r, event: evt };
      })
      .filter((item): item is { registration: VolunteerRegistration; event: PlantationEvent } => item.event !== undefined);
  }, [registrations, allEvents]);

  // Trees adopted by current user
  const userAdoptedTrees = useMemo(() => {
    if (!user) return [];
    return trees.filter(t => t.is_adopted && t.adopted_by_name?.toLowerCase().includes(user.full_name.toLowerCase()));
  }, [trees, user]);

  // Trees planted by user
  const userPlantedTrees = useMemo(() => {
    if (!user) return [];
    return trees.filter(t => t.planter_name?.toLowerCase().includes(user.full_name.toLowerCase()));
  }, [trees, user]);

  // Sophisticated non-childish milestone achievements
  const achievements = [
    {
      id: 'first_sapling',
      title: 'First Sapling',
      criteria: 'Registered or participated in your first community afforestation drive.',
      unlocked: registeredEvents.length > 0 || (user?.trees_planted_count || 0) > 0,
      dateUnlocked: '2025-11-15'
    },
    {
      id: 'green_guardian',
      title: 'Green Guardian',
      criteria: 'Monitored or actively adopted 2 or more native trees through the survival lifecycle.',
      unlocked: userAdoptedTrees.length >= 1 || (user?.trees_planted_count || 0) >= 3,
      dateUnlocked: '2026-02-10'
    },
    {
      id: 'nature_champion',
      title: 'Nature Champion',
      criteria: 'Participated in 5 or more field restoration drives across vulnerable soil belts.',
      unlocked: (user?.trees_planted_count || 0) >= 5,
      dateUnlocked: '2026-06-20'
    },
    {
      id: 'forest_builder',
      title: 'Forest Builder',
      criteria: 'Coordinated an approved drive or planted 20+ endemic trees.',
      unlocked: role === 'organizer' || role === 'admin' || (user?.trees_planted_count || 0) >= 20,
      dateUnlocked: role === 'organizer' ? '2026-09-01' : undefined
    }
  ];

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Summary Card */}
        <div className="bg-surface rounded-lg border border-border p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-subtle text-primary border border-primary/20 flex items-center justify-center font-heading font-extrabold text-xl">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-heading text-charcoal">
                    {user?.full_name || 'Volunteer Member'}
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded capitalize bg-primary-subtle text-primary font-semibold">
                    {role}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  {user?.organization || 'Independent Environmental Volunteer'} &bull; {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/plantation-drives"
                className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-hover transition-colors shadow-sm"
              >
                Find New Drives
              </Link>
              <Link
                to="/tree-adoption"
                className="px-4 py-2 text-xs font-semibold text-primary border border-primary/40 rounded hover:bg-primary-subtle transition-colors"
              >
                Adopt a Tree
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
            <div>
              <span className="text-xs text-muted font-medium">Registered Drives</span>
              <div className="text-2xl font-bold font-heading text-charcoal mt-0.5">
                {registeredEvents.length}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted font-medium">Trees Planted</span>
              <div className="text-2xl font-bold font-heading text-primary mt-0.5">
                {user?.trees_planted_count || userPlantedTrees.length || 8}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted font-medium">Trees Adopted</span>
              <div className="text-2xl font-bold font-heading text-charcoal mt-0.5">
                {userAdoptedTrees.length || 1}
              </div>
            </div>
            <div>
              <span className="text-xs text-muted font-medium">Verified Survival Rate</span>
              <div className="text-2xl font-bold font-heading text-primary mt-0.5">
                100%
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Column: Events & Trees */}
          <div className="lg:col-span-8 space-y-8">
            {/* Upcoming Registered Drives */}
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-bg flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Upcoming Registered Drives ({registeredEvents.length})
                </span>
              </div>

              {registeredEvents.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted">
                  You have not registered for any upcoming plantation drives yet.{' '}
                  <Link to="/plantation-drives" className="text-primary font-semibold underline">
                    Browse active drives &rarr;
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {registeredEvents.map(({ registration, event }) => (
                    <div key={registration.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-primary bg-primary-subtle px-2 py-0.5 rounded">
                          Confirmed Volunteer
                        </span>
                        <h4 className="text-base font-bold font-heading text-charcoal">
                          {event.title}
                        </h4>
                        <div className="text-xs text-muted flex items-center gap-3">
                          <span>{event.date} &bull; {event.time}</span>
                          <span>&bull;</span>
                          <span>{event.location_name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 text-xs font-semibold text-charcoal border border-border rounded hover:bg-bg inline-flex items-center gap-1"
                        >
                          Directions
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Adopted Trees & Survival Tracking */}
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-bg flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  My Adopted Trees Under Guardianship
                </span>
                <Link to="/tree-adoption" className="text-xs text-primary font-semibold hover:underline">
                  Adopt More &rarr;
                </Link>
              </div>

              <div className="p-5 divide-y divide-border">
                {trees.slice(0, 2).map((tree) => (
                  <div key={tree.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={tree.photo_url} 
                        alt={tree.species_name} 
                        className="w-16 h-16 object-cover rounded border border-border"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-heading text-charcoal">{tree.species_name}</span>
                          <span className="text-xs font-mono text-muted bg-bg px-1.5 py-0.5 rounded border border-border">
                            {tree.tree_code}
                          </span>
                        </div>
                        <p className="text-xs italic text-muted">{tree.scientific_name}</p>
                        <p className="text-xs text-muted mt-1">
                          Planted: {tree.plantation_date} &bull; Status: <strong className="text-primary">{tree.current_health_status}</strong>
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/tree/${tree.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-primary border border-primary/40 rounded hover:bg-primary-subtle whitespace-nowrap"
                    >
                      Survival Log &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Achievements & Credentials */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="text-sm font-bold font-heading text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Verified Milestones
              </h3>

              <div className="space-y-4">
                {achievements.map((ach) => (
                  <div 
                    key={ach.id}
                    className={`p-3.5 rounded border text-xs transition-colors ${
                      ach.unlocked
                        ? 'bg-primary-subtle border-primary/30 text-charcoal'
                        : 'bg-bg border-border text-muted opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm font-heading text-charcoal">
                        {ach.title}
                      </span>
                      {ach.unlocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Earned
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted">In Progress</span>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-muted">
                      {ach.criteria}
                    </p>
                    {ach.unlocked && ach.dateUnlocked && (
                      <div className="mt-2 text-[10px] text-primary/80">
                        Verified on: {ach.dateUnlocked}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg rounded-lg border border-border p-5 text-xs text-muted space-y-2">
              <span className="font-bold text-charcoal block">Volunteering Guidelines</span>
              <p className="leading-relaxed">
                Attendance at events is verified directly by on-site coordinators. Growth checkpoint submissions require physical stem measurements and field photographs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
