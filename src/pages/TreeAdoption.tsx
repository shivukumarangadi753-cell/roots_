import React, { useState, useEffect, useMemo } from 'react';
import { localDb } from '../lib/supabase';
import { TreeRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  TreePine, 
  Heart, 
  Calendar, 
  MapPin, 
  PlusCircle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Activity, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TreeAdoption: React.FC = () => {
  const { user } = useAuth();
  const [trees, setTrees] = useState<TreeRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'gallery' | 'register'>('gallery');
  const [search, setSearch] = useState('');
  const [filterHealth, setFilterHealth] = useState('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New tree registration form state
  const [speciesName, setSpeciesName] = useState('Neem');
  const [scientificName, setScientificName] = useState('Azadirachta indica');
  const [planterName, setPlanterName] = useState(user?.full_name || 'Dr. Anita Rao');
  const [plantationDate, setPlantationDate] = useState('2026-11-15');
  const [locationName, setLocationName] = useState('Hesaraghatta Catchment Basin, Bengaluru');
  const [soilTypeName, setSoilTypeName] = useState('Red Soil & Sandy Loam');
  const [initialHeightCm, setInitialHeightCm] = useState('65');
  const [photoUrl, setPhotoUrl] = useState('/images/teak.jpg');

  const speciesOptions = [
    { common: 'Neem', scientific: 'Azadirachta indica' },
    { common: 'Banyan', scientific: 'Ficus benghalensis' },
    { common: 'Peepal', scientific: 'Ficus religiosa' },
    { common: 'Mango', scientific: 'Mangifera indica' },
    { common: 'Jackfruit', scientific: 'Artocarpus heterophyllus' },
    { common: 'Teak', scientific: 'Tectona grandis' },
    { common: 'Coconut', scientific: 'Cocos nucifera' },
    { common: 'Tamarind', scientific: 'Tamarindus indica' },
    { common: 'Arjun', scientific: 'Terminalia arjuna' },
    { common: 'Indian Gooseberry (Amla)', scientific: 'Phyllanthus emblica' },
  ];

  const loadTrees = () => {
    setTrees(localDb.getTrees());
  };

  useEffect(() => {
    loadTrees();
  }, []);

  const handleSpeciesChange = (common: string) => {
    setSpeciesName(common);
    const found = speciesOptions.find(s => s.common === common);
    if (found) {
      setScientificName(found.scientific);
    }
  };

  const handleRegisterTree = (e: React.FormEvent) => {
    e.preventDefault();
    const newTree = localDb.registerTree({
      species_name: speciesName,
      scientific_name: scientificName,
      planter_name: planterName,
      plantation_date: plantationDate,
      location_name: locationName,
      soil_type_name: soilTypeName,
      initial_height_cm: parseFloat(initialHeightCm) || 60,
      photo_url: photoUrl
    });

    setNotification({
      type: 'success',
      message: `Tree registered successfully with assigned unique ID: ${newTree.tree_code}!`
    });

    loadTrees();
    setActiveTab('gallery');
  };

  const handleAdopt = (treeId: string) => {
    if (!user) {
      setNotification({ type: 'error', message: 'Please log in to adopt a tree.' });
      return;
    }

    const res = localDb.adoptTree(treeId, user.full_name);
    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      loadTrees();
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const filteredTrees = useMemo(() => {
    return trees.filter(t => {
      const matchesSearch = 
        t.tree_code.toLowerCase().includes(search.toLowerCase()) ||
        t.species_name.toLowerCase().includes(search.toLowerCase()) ||
        t.location_name.toLowerCase().includes(search.toLowerCase());

      const matchesHealth = filterHealth === 'all' || t.current_health_status.toLowerCase() === filterHealth.toLowerCase();

      return matchesSearch && matchesHealth;
    });
  }, [trees, search, filterHealth]);

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
              Silvicultural Lifecycle Tracking
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-charcoal">
              Tree Adoption & Survival Registry
            </h1>
            <p className="mt-2 text-base text-muted leading-relaxed max-w-2xl">
              Every planted tree receives a permanent scientific identification code. Volunteers adopt trees and log physiological growth assessments at Days 30, 90, 180, and 365 to verify survival.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2.5 text-xs font-semibold rounded border transition-colors ${
                activeTab === 'gallery'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface border-border text-charcoal hover:bg-bg'
              }`}
            >
              Tree Registry Gallery ({trees.length})
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded border transition-colors ${
                activeTab === 'register'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface border-border text-charcoal hover:bg-bg'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Register Planted Tree
            </button>
          </div>
        </div>

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

        {/* ================= TAB 1: GALLERY ================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-surface rounded-lg border border-border p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Tree ID (e.g., ROOTS-KA-2026), species..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-border rounded focus:outline-none focus:border-primary bg-bg text-charcoal"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-xs text-muted font-medium flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Health Status:
                </span>
                <select
                  value={filterHealth}
                  onChange={(e) => setFilterHealth(e.target.value)}
                  className="text-xs py-1.5 px-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                >
                  <option value="all">All Health Statuses</option>
                  <option value="healthy">Healthy</option>
                  <option value="needs attention">Needs Attention</option>
                  <option value="under observation">Under Observation</option>
                  <option value="dead or replaced">Dead or Replaced</option>
                </select>
              </div>
            </div>

            {/* Tree Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrees.map((tree) => {
                const isHealthy = tree.current_health_status === 'Healthy';
                const needsAttention = tree.current_health_status === 'Needs Attention';

                return (
                  <div
                    key={tree.id}
                    className="bg-surface rounded-lg border border-border overflow-hidden flex flex-col justify-between hover:border-sage transition-all duration-200"
                  >
                    <div>
                      <div className="h-48 relative overflow-hidden">
                        <img 
                          src={tree.photo_url} 
                          alt={tree.species_name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-charcoal/90 text-white font-mono text-[11px] px-2.5 py-1 rounded backdrop-blur-sm">
                          {tree.tree_code}
                        </div>
                        <div className={`absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded ${
                          isHealthy 
                            ? 'bg-primary text-white' 
                            : needsAttention 
                              ? 'bg-amber-700 text-white' 
                              : 'bg-olive text-white'
                        }`}>
                          {tree.current_health_status}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-xl font-bold font-heading text-charcoal">
                            {tree.species_name}
                          </h3>
                          <span className="text-xs text-muted">
                            {tree.total_assessments_count} Assessments
                          </span>
                        </div>
                        <p className="text-xs italic text-muted font-serif mb-4">
                          {tree.scientific_name}
                        </p>

                        <div className="space-y-2 text-xs text-charcoal bg-bg p-3.5 rounded border border-border mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>Planted: {tree.plantation_date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{tree.location_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>Baseline Height: {tree.initial_height_cm} cm</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Soil:</span>
                            <span className="text-muted truncate">{tree.soil_type_name}</span>
                          </div>
                        </div>

                        <div className="text-xs text-muted mb-2">
                          Planter: <strong className="text-charcoal">{tree.planter_name}</strong>
                        </div>
                        {tree.is_adopted && (
                          <div className="text-xs text-primary font-medium flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 fill-primary text-primary" />
                            Guardian: {tree.adopted_by_name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-border/60 mt-4 flex items-center justify-between">
                      <Link
                        to={`/tree/${tree.id}`}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        View Growth History
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      {!tree.is_adopted ? (
                        <button
                          onClick={() => handleAdopt(tree.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-hover transition-colors shadow-sm"
                        >
                          Adopt Tree
                        </button>
                      ) : (
                        <span className="text-xs text-muted italic">Adopted</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 2: REGISTER TREE ================= */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterTree} className="bg-surface rounded-lg border border-border p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
            <div className="border-b border-border pb-4">
              <h3 className="text-xl font-bold font-heading text-charcoal">
                Register Newly Planted Sapling
              </h3>
              <p className="text-xs text-muted mt-1">
                Enter field measurements from your plantation site to generate a permanent ROOTS Tree ID.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Tree Species *</label>
                <select
                  value={speciesName}
                  onChange={(e) => handleSpeciesChange(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary font-medium"
                >
                  {speciesOptions.map(sp => (
                    <option key={sp.common} value={sp.common}>{sp.common}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Scientific Botanical Name</label>
                <input
                  type="text"
                  readOnly
                  value={scientificName}
                  className="w-full text-xs p-2.5 border border-border rounded bg-bg text-muted italic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Planter / Volunteer Name *</label>
                <input
                  type="text"
                  required
                  value={planterName}
                  onChange={(e) => setPlanterName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Plantation Date *</label>
                <input
                  type="date"
                  required
                  value={plantationDate}
                  onChange={(e) => setPlantationDate(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Field Location *</label>
              <input
                type="text"
                required
                placeholder="e.g., Campus perimeter, Lake boundary, Sanctuary corridor"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Soil Classification *</label>
                <select
                  value={soilTypeName}
                  onChange={(e) => setSoilTypeName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                >
                  <option value="Alluvial Soil">Alluvial Soil</option>
                  <option value="Black Soil (Regur)">Black Soil (Regur)</option>
                  <option value="Red Soil & Sandy Loam">Red Soil & Sandy Loam</option>
                  <option value="Laterite Soil">Laterite Soil</option>
                  <option value="Sandy Soil">Sandy Soil</option>
                  <option value="Clay Soil">Clay Soil</option>
                  <option value="Loamy Soil">Loamy Soil</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Initial Stem Height (cm) *</label>
                <input
                  type="number"
                  required
                  min="10"
                  max="400"
                  value={initialHeightCm}
                  onChange={(e) => setInitialHeightCm(e.target.value)}
                  className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Sapling Photo URL</label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
              />
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className="px-4 py-2 text-xs font-semibold text-charcoal bg-bg border border-border rounded hover:bg-border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-hover shadow-sm"
              >
                Assign Tree ID & Log Day 1 Checkpoint
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
