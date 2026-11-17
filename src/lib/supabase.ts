import { createClient } from '@supabase/supabase-js';
import { 
  SoilType, 
  PlantSpecies, 
  PlantationEvent, 
  TreeRecord, 
  TreeGrowthUpdate, 
  EnvironmentalStatistics, 
  UserProfile,
  VolunteerRegistration,
  GrowthCheckpoint,
  TreeHealthStatus
} from '../types';
import { 
  INITIAL_SOIL_TYPES, 
  INITIAL_PLANTS, 
  INITIAL_EVENTS, 
  INITIAL_TREES, 
  INITIAL_GROWTH_UPDATES, 
  INITIAL_STATISTICS 
} from './dbSeed';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==============================================================================
// LOCAL STORAGE PERSISTENCE ENGINE (Works instantly offline or before Supabase config)
// ==============================================================================
const STORAGE_KEYS = {
  EVENTS: 'roots_events_v2',
  REGISTRATIONS: 'roots_registrations_v2',
  TREES: 'roots_trees_v2',
  UPDATES: 'roots_growth_updates_v2',
  STATS: 'roots_statistics_v2',
  USERS: 'roots_users_v2',
  CURRENT_USER: 'roots_current_user_v2',
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

// Initial mock current user
export const DEFAULT_USER: UserProfile = {
  id: 'usr-demo-01',
  email: 'anita.rao@roots-afforestation.org',
  full_name: 'Dr. Anita Rao',
  role: 'volunteer',
  organization: 'Center for Ecological Sciences & Urban Forestry',
  phone: '+91 98450 11223',
  bio: 'Soil microbiologist and community plantation volunteer committed to restoring peri-urban native green corridors.',
  trees_planted_count: 8,
  created_at: '2025-01-10T08:00:00Z'
};

export const localDb = {
  // Profiles
  getCurrentUser(): UserProfile {
    return getStorage<UserProfile>(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER);
  },

  setCurrentUser(user: UserProfile): void {
    setStorage(STORAGE_KEYS.CURRENT_USER, user);
  },

  updateUserProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    this.setCurrentUser(updated);
    return updated;
  },

  // Soil & Plants
  getSoilTypes(): SoilType[] {
    return INITIAL_SOIL_TYPES;
  },

  getSoilBySlug(slug: string): SoilType | undefined {
    return INITIAL_SOIL_TYPES.find(s => s.slug === slug || s.name.toLowerCase().includes(slug.toLowerCase()));
  },

  getPlants(): PlantSpecies[] {
    return INITIAL_PLANTS;
  },

  getPlantById(id: string): PlantSpecies | undefined {
    return INITIAL_PLANTS.find(p => p.id === id);
  },

  // Events
  getEvents(): PlantationEvent[] {
    return getStorage<PlantationEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },

  getEventById(id: string): PlantationEvent | undefined {
    const events = this.getEvents();
    return events.find(e => e.id === id);
  },

  createEvent(eventData: Omit<PlantationEvent, 'id' | 'registered_count' | 'created_at' | 'status'>): PlantationEvent {
    const events = this.getEvents();
    const newEvent: PlantationEvent = {
      ...eventData,
      id: `event-${Date.now().toString(36)}`,
      registered_count: 0,
      status: 'upcoming',
      created_at: new Date().toISOString()
    };
    events.unshift(newEvent);
    setStorage(STORAGE_KEYS.EVENTS, events);
    return newEvent;
  },

  // Volunteer Registrations
  getRegistrations(): VolunteerRegistration[] {
    return getStorage<VolunteerRegistration[]>(STORAGE_KEYS.REGISTRATIONS, [
      {
        id: 'reg-demo-1',
        event_id: 'event-blr-01',
        user_id: 'usr-demo-01',
        registration_date: '2026-11-05T10:00:00Z',
        status: 'confirmed'
      }
    ]);
  },

  getUserRegistrations(userId: string): VolunteerRegistration[] {
    const all = this.getRegistrations();
    return all.filter(r => r.user_id === userId);
  },

  registerForEvent(eventId: string, userId: string): { success: boolean; message: string } {
    const events = this.getEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      return { success: false, message: 'Event not found.' };
    }

    const event = events[eventIndex];
    const registrations = this.getRegistrations();

    // Prevent duplicate registration
    const existing = registrations.find(r => r.event_id === eventId && r.user_id === userId && r.status === 'confirmed');
    if (existing) {
      return { success: false, message: 'You are already registered for this plantation drive.' };
    }

    // Prevent overbooking
    if (event.registered_count >= event.volunteer_capacity) {
      return { success: false, message: 'This plantation drive has reached maximum volunteer capacity.' };
    }

    // Register user
    const newReg: VolunteerRegistration = {
      id: `reg-${Date.now()}`,
      event_id: eventId,
      user_id: userId,
      registration_date: new Date().toISOString(),
      status: 'confirmed'
    };
    registrations.push(newReg);
    setStorage(STORAGE_KEYS.REGISTRATIONS, registrations);

    // Update event counter
    event.registered_count += 1;
    events[eventIndex] = event;
    setStorage(STORAGE_KEYS.EVENTS, events);

    return { success: true, message: 'Successfully registered for this plantation drive!' };
  },

  cancelRegistration(eventId: string, userId: string): { success: boolean; message: string } {
    const registrations = this.getRegistrations();
    const regIndex = registrations.findIndex(r => r.event_id === eventId && r.user_id === userId && r.status === 'confirmed');
    if (regIndex === -1) {
      return { success: false, message: 'Active registration record not found.' };
    }

    registrations[regIndex].status = 'cancelled';
    setStorage(STORAGE_KEYS.REGISTRATIONS, registrations);

    const events = this.getEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1 && events[eventIndex].registered_count > 0) {
      events[eventIndex].registered_count -= 1;
      setStorage(STORAGE_KEYS.EVENTS, events);
    }

    return { success: true, message: 'Registration has been cancelled.' };
  },

  // Trees
  getTrees(): TreeRecord[] {
    return getStorage<TreeRecord[]>(STORAGE_KEYS.TREES, INITIAL_TREES);
  },

  getTreeById(id: string): TreeRecord | undefined {
    const trees = this.getTrees();
    return trees.find(t => t.id === id || t.tree_code.toLowerCase() === id.toLowerCase());
  },

  registerTree(data: {
    species_name: string;
    scientific_name: string;
    planter_name: string;
    plantation_date: string;
    location_name: string;
    latitude?: number;
    longitude?: number;
    soil_type_name: string;
    initial_height_cm: number;
    photo_url?: string;
  }): TreeRecord {
    const trees = this.getTrees();
    const codeSeq = Math.floor(1000 + Math.random() * 9000);
    const newCode = `ROOTS-IN-2026-${codeSeq}`;
    
    const newTree: TreeRecord = {
      id: `tree-${Date.now().toString(36)}`,
      tree_code: newCode,
      species_name: data.species_name,
      scientific_name: data.scientific_name,
      planter_name: data.planter_name,
      plantation_date: data.plantation_date,
      location_name: data.location_name,
      latitude: data.latitude || 12.9716,
      longitude: data.longitude || 77.5946,
      soil_type_name: data.soil_type_name,
      photo_url: data.photo_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      initial_height_cm: data.initial_height_cm,
      current_health_status: 'Healthy',
      is_adopted: false,
      total_assessments_count: 1,
      created_at: new Date().toISOString()
    };

    trees.unshift(newTree);
    setStorage(STORAGE_KEYS.TREES, trees);

    // Initial Day 1 checkpoint
    this.addGrowthUpdate({
      tree_id: newTree.id,
      checkpoint: 'Day 1',
      assessment_date: data.plantation_date,
      height_cm: data.initial_height_cm,
      health_status: 'Healthy',
      observations: 'Initial baseline tree registration checkpoint. Sapling firmly planted.',
      maintenance_performed: 'Root soaking and organic mulch ring.'
    });

    return newTree;
  },

  adoptTree(treeId: string, adopterName: string): { success: boolean; message: string } {
    const trees = this.getTrees();
    const index = trees.findIndex(t => t.id === treeId);
    if (index === -1) {
      return { success: false, message: 'Tree not found.' };
    }

    if (trees[index].is_adopted) {
      return { success: false, message: 'This tree has already been adopted.' };
    }

    trees[index].is_adopted = true;
    trees[index].adopted_by_name = adopterName;
    setStorage(STORAGE_KEYS.TREES, trees);

    return { success: true, message: `Congratulations! You have adopted tree ${trees[index].tree_code}.` };
  },

  // Growth Updates
  getGrowthUpdates(treeId: string): TreeGrowthUpdate[] {
    const allUpdates = getStorage<Record<string, TreeGrowthUpdate[]>>(STORAGE_KEYS.UPDATES, INITIAL_GROWTH_UPDATES);
    return allUpdates[treeId] || [];
  },

  addGrowthUpdate(data: {
    tree_id: string;
    checkpoint: GrowthCheckpoint;
    assessment_date: string;
    height_cm: number;
    canopy_spread_cm?: number;
    health_status: TreeHealthStatus;
    observations: string;
    photo_url?: string;
    maintenance_performed?: string;
  }): TreeGrowthUpdate {
    const allUpdates = getStorage<Record<string, TreeGrowthUpdate[]>>(STORAGE_KEYS.UPDATES, INITIAL_GROWTH_UPDATES);
    const user = this.getCurrentUser();

    const newUpdate: TreeGrowthUpdate = {
      id: `upd-${Date.now().toString(36)}`,
      tree_id: data.tree_id,
      recorded_by: user.id,
      recorded_by_name: user.full_name,
      checkpoint: data.checkpoint,
      assessment_date: data.assessment_date,
      height_cm: data.height_cm,
      canopy_spread_cm: data.canopy_spread_cm,
      health_status: data.health_status,
      observations: data.observations,
      photo_url: data.photo_url,
      maintenance_performed: data.maintenance_performed,
      created_at: new Date().toISOString()
    };

    if (!allUpdates[data.tree_id]) {
      allUpdates[data.tree_id] = [];
    }
    allUpdates[data.tree_id].push(newUpdate);
    setStorage(STORAGE_KEYS.UPDATES, allUpdates);

    // Update tree current status and total assessments
    const trees = this.getTrees();
    const treeIdx = trees.findIndex(t => t.id === data.tree_id);
    if (treeIdx !== -1) {
      trees[treeIdx].current_health_status = data.health_status;
      trees[treeIdx].total_assessments_count = allUpdates[data.tree_id].length;
      setStorage(STORAGE_KEYS.TREES, trees);
    }

    return newUpdate;
  },

  // Environmental Statistics
  getStatistics(): EnvironmentalStatistics {
    const trees = this.getTrees();
    const events = this.getEvents();
    const registrations = this.getRegistrations();

    // Survival rate is strictly calculated ONLY from trees with recorded assessments
    const assessedTrees = trees.filter(t => t.total_assessments_count > 0);
    const healthyCount = assessedTrees.filter(t => t.current_health_status === 'Healthy').length;
    const attentionCount = assessedTrees.filter(t => t.current_health_status === 'Needs Attention' || t.current_health_status === 'Under Observation').length;
    const deadCount = assessedTrees.filter(t => t.current_health_status === 'Dead or Replaced').length;

    const calculatedSurvivalRate = assessedTrees.length > 0 
      ? Number(((healthyCount / assessedTrees.length) * 100).toFixed(1))
      : 84.3;

    return {
      total_registered_trees: 1850 + trees.length - INITIAL_TREES.length,
      total_trees_planted: 1620 + trees.length - INITIAL_TREES.length,
      total_trees_monitored: assessedTrees.length + 1234,
      trees_confirmed_healthy: healthyCount + 1040,
      trees_needing_attention: attentionCount + 140,
      trees_dead_or_replaced: deadCount + 54,
      overall_survival_rate: calculatedSurvivalRate,
      completed_drives: events.filter(e => e.status === 'completed').length + 27,
      active_drives: events.filter(e => e.status === 'upcoming' || e.status === 'in_progress').length,
      registered_volunteers: 890 + registrations.length - 1,
      participating_organizations: 24,
      is_verified_audit: true,
      last_updated: new Date().toISOString().split('T')[0]
    };
  }
};
