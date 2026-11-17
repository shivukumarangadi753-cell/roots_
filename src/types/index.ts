export type UserRole = 'volunteer' | 'organizer' | 'admin';

export type TreeHealthStatus = 'Healthy' | 'Needs Attention' | 'Under Observation' | 'Dead or Replaced';

export type GrowthCheckpoint = 'Day 1' | 'Day 30' | 'Day 90' | 'Day 180' | 'Day 365';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  trees_planted_count: number;
  created_at?: string;
}

export interface SoilType {
  id: string;
  name: string;
  slug: string;
  composition: string;
  texture: string;
  ph_range: string;
  nutrient_availability: string;
  water_retention: string;
  drainage: string;
  suitable_trees: string[];
  suitable_plants: string[];
  advantages: string[];
  limitations: string[];
  color_description: string;
  image_url: string;
}

export interface PlantSpecies {
  id: string;
  common_name: string;
  scientific_name: string;
  family: string;
  soil_preferences: string[];
  ideal_ph_range: string;
  sunlight: 'Full Sun' | 'Partial Shade' | 'Full Sun to Partial Shade';
  water_needs: 'Low' | 'Moderate' | 'High' | 'Low to Moderate';
  growth_rate: 'Slow' | 'Moderate' | 'Fast';
  max_height_meters: number;
  native_status: string;
  environmental_benefits: string[];
  planting_season: string;
  medicinal_or_economic_value: string;
  image_url: string;
}

export interface PlantationEvent {
  id: string;
  organizer_id: string;
  organizer_name: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location_name: string;
  latitude: number;
  longitude: number;
  state: string;
  trees_planned: number;
  volunteer_capacity: number;
  registered_count: number;
  tree_species: string[];
  soil_type: string;
  contact_phone?: string;
  contact_email?: string;
  poster_url: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  completed_trees?: number;
  created_at: string;
}

export interface VolunteerRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registration_date: string;
  status: 'confirmed' | 'cancelled' | 'attended';
  notes?: string;
}

export interface TreeRecord {
  id: string;
  tree_code: string;
  species_id?: string;
  species_name: string;
  scientific_name: string;
  event_id?: string;
  planter_id?: string;
  planter_name: string;
  plantation_date: string;
  location_name: string;
  latitude?: number;
  longitude?: number;
  soil_type_name: string;
  photo_url: string;
  initial_height_cm: number;
  current_health_status: TreeHealthStatus;
  is_adopted: boolean;
  adopted_by_name?: string;
  total_assessments_count: number;
  created_at: string;
}

export interface TreeAdoption {
  id: string;
  tree_id: string;
  user_id: string;
  adopted_at: string;
  notes?: string;
  active: boolean;
}

export interface TreeGrowthUpdate {
  id: string;
  tree_id: string;
  recorded_by: string;
  recorded_by_name: string;
  checkpoint: GrowthCheckpoint;
  assessment_date: string;
  height_cm: number;
  canopy_spread_cm?: number;
  health_status: TreeHealthStatus;
  observations: string;
  photo_url?: string;
  maintenance_performed?: string;
  created_at: string;
}

export interface MaintenanceRecord {
  id: string;
  tree_id: string;
  recorded_by: string;
  maintenance_type: string;
  performed_at: string;
  notes?: string;
}

export interface EnvironmentalStatistics {
  total_registered_trees: number;
  total_trees_planted: number;
  total_trees_monitored: number;
  trees_confirmed_healthy: number;
  trees_needing_attention: number;
  trees_dead_or_replaced: number;
  overall_survival_rate: number;
  completed_drives: number;
  active_drives: number;
  registered_volunteers: number;
  participating_organizations: number;
  is_verified_audit: boolean;
  last_updated: string;
}

export interface SoilAssessmentInput {
  texture: string;
  color: string;
  waterDrainage: string;
  consistency: string;
  location: string;
  imagePreview?: string;
}

export interface SoilAssessmentResult {
  soilCategory: string;
  scientificConfidence: string;
  explanation: string;
  primaryCharacteristics: string[];
  estimatedPh: string;
  nutrientProfile: string;
  recommendedTrees: string[];
  suggestedPlantationMethods: string[];
  laboratoryAdvisory: string;
}
