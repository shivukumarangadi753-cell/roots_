import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { localDb } from '../lib/supabase';
import { PlantationEvent, SoilType, PlantSpecies, EnvironmentalStatistics } from '../types';
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Users, 
  TreePine, 
  Droplets, 
  CheckCircle2, 
  ShieldCheck, 
  Microscope,
  Compass,
  ArrowUpRight
} from 'lucide-react';

export const Home: React.FC = () => {
  const [stats, setStats] = useState<EnvironmentalStatistics>(() => localDb.getStatistics());
  const [featuredDrives, setFeaturedDrives] = useState<PlantationEvent[]>([]);
  const [soilPreviews, setSoilPreviews] = useState<SoilType[]>([]);
  const [plantPreviews, setPlantPreviews] = useState<PlantSpecies[]>([]);

  useEffect(() => {
    setStats(localDb.getStatistics());
    setFeaturedDrives(localDb.getEvents().slice(0, 3));
    setSoilPreviews(localDb.getSoilTypes().slice(0, 3));
    setPlantPreviews(localDb.getPlants().slice(0, 4));
  }, []);

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION (Editorial Nature Aesthetic) */}
      <section className="relative bg-primary text-white overflow-hidden">
        {/* Subtle authentic nature background with high-contrast darkening overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=85')` 
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 text-sage-light text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-olive-light"></span>
              Community Ecological Restoration
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading text-white leading-[1.12] mb-6">
              Plant Today.<br />
              <span className="text-olive-light">Protect Tomorrow.</span>
            </h1>

            <p className="text-lg sm:text-xl text-sage-light font-normal leading-relaxed mb-10 max-w-2xl">
              Understand your soil, discover the right trees, and connect with people building a greener future. A scientifically grounded community platform tracking long-term survival, not just seed counts.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/plantation-drives"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-primary bg-white rounded hover:bg-bg transition-colors shadow-sm"
              >
                Explore Plantation Drives
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/discover-soil"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white border border-white/40 rounded hover:bg-white/10 transition-colors"
              >
                <Compass className="w-4 h-4" />
                Discover Your Soil
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HORIZONTAL AUDITED STATISTICS SECTION */}
      <section className="bg-surface border-y border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-l-2 border-primary pl-4">
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-primary">
                {stats.total_trees_planted.toLocaleString()}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted font-medium mt-1">
                Trees Planted
              </div>
            </div>

            <div className="border-l-2 border-primary pl-4">
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-primary">
                {stats.active_drives}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted font-medium mt-1">
                Active Plantation Drives
              </div>
            </div>

            <div className="border-l-2 border-primary pl-4">
              <div className="text-3xl sm:text-4xl font-extrabold font-heading text-primary">
                {stats.registered_volunteers.toLocaleString()}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted font-medium mt-1">
                Registered Volunteers
              </div>
            </div>

            <div className="border-l-2 border-primary pl-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-heading text-primary">
                  {stats.total_trees_monitored.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-primary/80 bg-primary-subtle px-1.5 py-0.5 rounded">
                  {stats.overall_survival_rate}% Survival
                </span>
              </div>
              <div className="text-xs uppercase tracking-wider text-muted font-medium mt-1">
                Trees Being Monitored
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY AFFORESTATION MATTERS (Scientific & Environmental Context) */}
      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              The Ecological Imperative
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal">
              Why afforestation matters in the Anthropocene
            </h2>
            <p className="mt-3 text-base text-muted leading-relaxed">
              Tree plantation without soil chemistry and ecological suitability produces fragile monocultures with high sapling mortality. ROOTS bridges community goodwill with botanical precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface p-8 rounded-lg border border-border">
              <div className="w-10 h-10 rounded bg-primary-subtle flex items-center justify-center text-primary mb-5">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-heading text-charcoal mb-2">
                Aquifer Recharge & Hydrology
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Native root networks like Arjun and Banyan channel up to 40% more monsoon stormwater into deep subsoil aquifers compared to hardpack urban turf, arresting rapid urban flash floods.
              </p>
            </div>

            <div className="bg-surface p-8 rounded-lg border border-border">
              <div className="w-10 h-10 rounded bg-primary-subtle flex items-center justify-center text-primary mb-5">
                <Microscope className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-heading text-charcoal mb-2">
                Soil Chemistry & Microfauna
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Leaf canopy litter restores decayed organic carbon (humus), feeds mycorrhizal fungal networks, and buffers acidic or saline soils without commercial synthetic amendments.
              </p>
            </div>

            <div className="bg-surface p-8 rounded-lg border border-border">
              <div className="w-10 h-10 rounded bg-primary-subtle flex items-center justify-center text-primary mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-heading text-charcoal mb-2">
                Verified 365-Day Survival
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Our platform does not count saplings abandoned after plantation day photo-ops. We mandate Day 1 to Day 365 growth checkpoints to ensure genuine canopy recruitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW ROOTS WORKS (Structured 4-Step Process) */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              Systematic Methodology
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal">
              How ROOTS Works
            </h2>
            <p className="mt-2 text-sm text-muted">
              From soil assessment to community planting and long-term tree guardianship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="text-5xl font-extrabold font-heading text-border mb-3">01</div>
              <h3 className="text-base font-bold font-heading text-charcoal mb-2">
                Soil & Climate Diagnosis
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Volunteers use our 5-variable soil identifier to ascertain local texture, pH tendency, and drainage capacity.
              </p>
            </div>

            <div className="relative">
              <div className="text-5xl font-extrabold font-heading text-border mb-3">02</div>
              <h3 className="text-base font-bold font-heading text-charcoal mb-2">
                Native Species Selection
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                The platform recommends scientifically matched endemic trees (Neem, Banyan, Teak, Arjun) that thrive without artificial water inputs.
              </p>
            </div>

            <div className="relative">
              <div className="text-5xl font-extrabold font-heading text-border mb-3">03</div>
              <h3 className="text-base font-bold font-heading text-charcoal mb-2">
                Community Drives
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                NGOs, colleges, and citizen groups host managed plantation events with transparent volunteer limits and mapped coordinates.
              </p>
            </div>

            <div className="relative">
              <div className="text-5xl font-extrabold font-heading text-border mb-3">04</div>
              <h3 className="text-base font-bold font-heading text-charcoal mb-2">
                Adoption & Survival Audits
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Volunteers adopt saplings, upload photos at Days 30, 90, 180, and 365, logging true field health into public audit metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PLANTATION DRIVES */}
      <section className="py-20 bg-bg border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                Participate Locally
              </div>
              <h2 className="text-3xl font-bold font-heading text-charcoal">
                Featured Plantation Drives
              </h2>
            </div>
            <Link
              to="/plantation-drives"
              className="mt-4 sm:mt-0 text-sm font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1.5"
            >
              View all upcoming events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDrives.map((drive) => {
              const slotsLeft = drive.volunteer_capacity - drive.registered_count;
              return (
                <div 
                  key={drive.id}
                  className="bg-surface rounded-lg border border-border overflow-hidden flex flex-col justify-between hover:border-sage transition-colors duration-200"
                >
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={drive.poster_url} 
                        alt={drive.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold text-charcoal">
                        {drive.state}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="text-xs font-medium text-muted mb-1">
                        Organized by {drive.organizer_name}
                      </div>
                      <h3 className="text-lg font-bold font-heading text-charcoal mb-3 line-clamp-2">
                        {drive.title}
                      </h3>

                      <div className="space-y-2 text-xs text-muted mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{drive.date} &bull; {drive.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span className="truncate">{drive.location_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TreePine className="w-3.5 h-3.5 text-primary" />
                          <span>Target: {drive.trees_planned} saplings ({drive.tree_species.slice(0, 2).join(', ')})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-border/50 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted">Availability: </span>
                      <span className="text-xs font-semibold text-charcoal">
                        {slotsLeft > 0 ? `${slotsLeft} slots remaining` : 'Full'}
                      </span>
                    </div>

                    <Link
                      to="/plantation-drives"
                      className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
                    >
                      Details & RSVP
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. SOIL & PLANT DISCOVERY PREVIEW */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                Scientific Matching Engine
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-charcoal mb-4">
                Soil and Plant Discovery
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Different soils have starkly distinct pH ranges, drainage mechanics, and nutrient holding capacities. Planting a water-sensitive Teak in stagnant clay or a moisture-loving Arjun on barren dry sand guarantees failure.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-charcoal">
                    <strong>7 Comprehensive Soil Profiles:</strong> From Indo-Gangetic Alluvial to Deccan Basaltic Black, Red granite loam, and Laterite.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-charcoal">
                    <strong>10 Endemic Indian Trees:</strong> Scientific names, ideal pH ranges, sunlight demands, and environmental benefits.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-charcoal">
                    <strong>Interactive Soil Diagnostic:</strong> Step-by-step physical observation guide tailored for citizen volunteers.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/soil-plants"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-hover transition-colors"
                >
                  Explore Soils & Trees
                </Link>
                <Link
                  to="/discover-soil"
                  className="px-5 py-2.5 text-xs font-semibold text-primary border border-primary/40 rounded hover:bg-primary-subtle transition-colors"
                >
                  Discover Your Soil
                </Link>
              </div>
            </div>

            {/* Tree species preview grid */}
            <div className="grid grid-cols-2 gap-4">
              {plantPreviews.map((plant) => (
                <div 
                  key={plant.id} 
                  className="bg-bg rounded-lg p-4 border border-border flex flex-col justify-between"
                >
                  <img 
                    src={plant.image_url} 
                    alt={plant.common_name} 
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <div>
                    <h4 className="font-bold text-sm font-heading text-charcoal">
                      {plant.common_name}
                    </h4>
                    <p className="text-xs italic text-muted">
                      {plant.scientific_name}
                    </p>
                    <div className="mt-2 text-[11px] text-muted">
                      pH: <span className="text-charcoal font-medium">{plant.ideal_ph_range}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY IMPACT CALLOUT */}
      <section className="py-20 bg-bg border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary text-white rounded-xl p-8 sm:p-12 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-olive-light">
                Public Accountability
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-2 mb-4">
                Explore Our Audited Field Environmental Metrics
              </h2>
              <p className="text-sm text-sage-light leading-relaxed mb-6">
                All survival percentages on ROOTS are calculated strictly from trees that have recorded physical assessments at 30, 90, 180, and 365 days. No estimates, no arbitrary claims.
              </p>
              <Link
                to="/impact"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-primary bg-white rounded hover:bg-bg transition-colors"
              >
                View Live Audit Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
