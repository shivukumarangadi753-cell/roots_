import React, { useState, useMemo } from 'react';
import { localDb } from '../lib/supabase';
import { SoilType, PlantSpecies } from '../types';
import { 
  Search, 
  Filter, 
  Droplets, 
  Sun, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Layers, 
  TreePine,
  ArrowRight,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SoilExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'soils' | 'trees'>('soils');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSoilSlug, setSelectedSoilSlug] = useState<string>('all');
  const [selectedSunlight, setSelectedSunlight] = useState<string>('all');
  const [selectedWater, setSelectedWater] = useState<string>('all');
  const [modalItem, setModalItem] = useState<{ type: 'soil' | 'tree'; data: SoilType | PlantSpecies } | null>(null);

  const soils = useMemo(() => localDb.getSoilTypes(), []);
  const trees = useMemo(() => localDb.getPlants(), []);

  // Filter soils
  const filteredSoils = useMemo(() => {
    return soils.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.composition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.suitable_trees.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [soils, searchTerm]);

  // Filter trees
  const filteredTrees = useMemo(() => {
    return trees.filter(t => {
      const matchesSearch = 
        t.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.family.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.environmental_benefits.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSoil = 
        selectedSoilSlug === 'all' || 
        t.soil_preferences.some(sp => sp.toLowerCase().includes(selectedSoilSlug.toLowerCase()));

      const matchesSunlight = 
        selectedSunlight === 'all' || 
        t.sunlight.toLowerCase().includes(selectedSunlight.toLowerCase());

      const matchesWater = 
        selectedWater === 'all' || 
        t.water_needs.toLowerCase().includes(selectedWater.toLowerCase());

      return matchesSearch && matchesSoil && matchesSunlight && matchesWater;
    });
  }, [trees, searchTerm, selectedSoilSlug, selectedSunlight, selectedWater]);

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
            Pedology & Silviculture Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-charcoal">
            Soil & Plant Explorer
          </h1>
          <p className="mt-2 text-base text-muted leading-relaxed">
            Investigate the chemical composition, pH spectrums, and drainage mechanics of 7 major Indian soils, alongside 10 keystone endemic trees engineered by evolution to thrive within them.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('soils')}
            className={`flex items-center gap-2 py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'soils'
                ? 'border-primary text-primary bg-surface'
                : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            <Layers className="w-4 h-4" />
            7 Major Soil Types ({filteredSoils.length})
          </button>
          <button
            onClick={() => setActiveTab('trees')}
            className={`flex items-center gap-2 py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'trees'
                ? 'border-primary text-primary bg-surface'
                : 'border-transparent text-muted hover:text-charcoal'
            }`}
          >
            <TreePine className="w-4 h-4" />
            10 Endemic Tree Profiles ({filteredTrees.length})
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-surface rounded-lg border border-border p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'soils' ? "Search soils, composition, or trees..." : "Search species, Latin name, family..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-border rounded focus:outline-none focus:border-primary bg-bg text-charcoal"
            />
          </div>

          {activeTab === 'trees' && (
            <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
              <span className="text-xs text-muted font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filters:
              </span>

              {/* Soil filter */}
              <select
                value={selectedSoilSlug}
                onChange={(e) => setSelectedSoilSlug(e.target.value)}
                className="text-xs py-1.5 px-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
              >
                <option value="all">All Soils</option>
                <option value="alluvial">Alluvial Soil</option>
                <option value="black">Black Soil</option>
                <option value="red">Red Soil</option>
                <option value="laterite">Laterite Soil</option>
                <option value="sandy">Sandy Soil</option>
                <option value="clay">Clay Soil</option>
                <option value="loamy">Loamy Soil</option>
              </select>

              {/* Sunlight filter */}
              <select
                value={selectedSunlight}
                onChange={(e) => setSelectedSunlight(e.target.value)}
                className="text-xs py-1.5 px-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
              >
                <option value="all">All Sunlight</option>
                <option value="full sun">Full Sun</option>
                <option value="partial shade">Partial Shade</option>
              </select>

              {/* Water filter */}
              <select
                value={selectedWater}
                onChange={(e) => setSelectedWater(e.target.value)}
                className="text-xs py-1.5 px-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
              >
                <option value="all">All Water Requirements</option>
                <option value="low">Low Water</option>
                <option value="moderate">Moderate Water</option>
                <option value="high">High Water</option>
              </select>

              {(selectedSoilSlug !== 'all' || selectedSunlight !== 'all' || selectedWater !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedSoilSlug('all');
                    setSelectedSunlight('all');
                    setSelectedWater('all');
                    setSearchTerm('');
                  }}
                  className="text-xs text-primary hover:underline px-2"
                >
                  Reset
                </button>
              )}
            </div>
          )}

          {activeTab === 'soils' && (
            <div className="text-xs text-muted">
              Unsure what soil you have?{' '}
              <Link to="/discover-soil" className="text-primary font-semibold hover:underline">
                Use Soil Identifier &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* ===================== TAB 1: SOIL TYPES ===================== */}
        {activeTab === 'soils' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredSoils.map((soil) => (
              <div 
                key={soil.id}
                className="bg-surface rounded-lg border border-border overflow-hidden hover:border-sage transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 relative overflow-hidden">
                    <img 
                      src={soil.image_url} 
                      alt={soil.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-surface/95 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold text-charcoal border border-border">
                      pH: {soil.ph_range}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold font-heading text-charcoal mb-1">
                      {soil.name}
                    </h3>
                    <p className="text-xs font-medium text-sage mb-4">
                      Color Profile: {soil.color_description}
                    </p>

                    <div className="space-y-3 text-xs text-charcoal mb-6">
                      <div>
                        <span className="font-semibold text-charcoal">Composition: </span>
                        <span className="text-muted leading-relaxed">{soil.composition}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-charcoal">Texture: </span>
                        <span className="text-muted">{soil.texture}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-charcoal">Nutrients: </span>
                        <span className="text-muted">{soil.nutrient_availability}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="bg-bg p-2 rounded border border-border">
                          <span className="font-semibold block">Water Retention:</span>
                          <span className="text-muted">{soil.water_retention}</span>
                        </div>
                        <div className="bg-bg p-2 rounded border border-border">
                          <span className="font-semibold block">Drainage:</span>
                          <span className="text-muted">{soil.drainage}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 mb-4">
                      <div className="text-xs font-semibold text-charcoal mb-2">Suitable Trees:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {soil.suitable_trees.map((t, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-primary-subtle text-primary font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setModalItem({ type: 'soil', data: soil })}
                    className="w-full py-2 text-xs font-semibold text-primary border border-primary/40 rounded hover:bg-primary-subtle transition-colors text-center"
                  >
                    View Complete Pedology Specifications & Limitations &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================== TAB 2: NATIVE TREES ===================== */}
        {activeTab === 'trees' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrees.map((tree) => (
              <div 
                key={tree.id}
                className="bg-surface rounded-lg border border-border overflow-hidden hover:border-sage transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={tree.image_url} 
                      alt={tree.common_name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-surface/95 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-semibold text-charcoal border border-border">
                      {tree.growth_rate} Growth
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-xs text-muted mb-0.5">Family: {tree.family}</div>
                    <h3 className="text-xl font-bold font-heading text-charcoal">
                      {tree.common_name}
                    </h3>
                    <p className="text-xs italic text-sage mb-4 font-serif">
                      {tree.scientific_name}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-muted mb-4 bg-bg p-3 rounded border border-border">
                      <div>
                        <span className="font-semibold text-charcoal block">Ideal pH:</span>
                        <span>{tree.ideal_ph_range}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-charcoal block">Water Need:</span>
                        <span>{tree.water_needs}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-charcoal block">Sunlight:</span>
                        <span>{tree.sunlight}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-charcoal block">Max Height:</span>
                        <span>{tree.max_height_meters} meters</span>
                      </div>
                    </div>

                    <div className="text-xs mb-4">
                      <span className="font-semibold text-charcoal block mb-1">Soil Compatibility:</span>
                      <div className="flex flex-wrap gap-1">
                        {tree.soil_preferences.map((sp, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-bg border border-border text-charcoal">
                            {sp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted line-clamp-2 mb-4">
                      <span className="font-semibold text-charcoal">Eco Role: </span>
                      {tree.environmental_benefits[0]}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setModalItem({ type: 'tree', data: tree })}
                    className="w-full py-2 text-xs font-semibold text-primary border border-primary/40 rounded hover:bg-primary-subtle transition-colors text-center"
                  >
                    View Silviculture Dossier &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for In-depth Details */}
        {modalItem && (
          <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-card p-6 sm:p-8">
              <div className="flex items-start justify-between pb-4 border-b border-border">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {modalItem.type === 'soil' ? 'Pedology Scientific Dossier' : 'Silviculture Botanical Profile'}
                  </div>
                  <h2 className="text-2xl font-bold font-heading text-charcoal">
                    {modalItem.type === 'soil' 
                      ? (modalItem.data as SoilType).name 
                      : (modalItem.data as PlantSpecies).common_name}
                  </h2>
                  {modalItem.type === 'tree' && (
                    <p className="text-sm italic text-muted">
                      {(modalItem.data as PlantSpecies).scientific_name}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setModalItem(null)}
                  className="p-1 rounded text-muted hover:text-charcoal hover:bg-bg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Soil Detailed View */}
              {modalItem.type === 'soil' && (() => {
                const s = modalItem.data as SoilType;
                return (
                  <div className="py-6 space-y-6 text-sm text-charcoal">
                    <img src={s.image_url} alt={s.name} className="w-full h-56 object-cover rounded-md" />

                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-muted mb-1">Composition & Genesis</h4>
                      <p className="text-muted leading-relaxed">{s.composition}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-bg p-3 rounded border border-border">
                        <span className="font-semibold block text-xs text-muted">pH Dynamics:</span>
                        <span className="font-medium text-charcoal">{s.ph_range}</span>
                      </div>
                      <div className="bg-bg p-3 rounded border border-border">
                        <span className="font-semibold block text-xs text-muted">Texture Class:</span>
                        <span className="font-medium text-charcoal">{s.texture}</span>
                      </div>
                      <div className="bg-bg p-3 rounded border border-border">
                        <span className="font-semibold block text-xs text-muted">Water Retention:</span>
                        <span className="font-medium text-charcoal">{s.water_retention}</span>
                      </div>
                      <div className="bg-bg p-3 rounded border border-border">
                        <span className="font-semibold block text-xs text-muted">Internal Drainage:</span>
                        <span className="font-medium text-charcoal">{s.drainage}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-muted mb-2">Agronomic Advantages</h4>
                      <ul className="space-y-1 text-xs">
                        {s.advantages.map((adv, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-muted mb-2">Pedological Limitations</h4>
                      <ul className="space-y-1 text-xs">
                        {s.limitations.map((lim, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-olive shrink-0 mt-0.5" />
                            <span className="text-muted">{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}

              {/* Tree Detailed View */}
              {modalItem.type === 'tree' && (() => {
                const t = modalItem.data as PlantSpecies;
                return (
                  <div className="py-6 space-y-6 text-sm text-charcoal">
                    <img src={t.image_url} alt={t.common_name} className="w-full h-56 object-cover rounded-md" />

                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-muted mb-1">Native Biogeography</h4>
                      <p className="text-muted">{t.native_status}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-muted mb-2">Key Environmental Ecosystem Services</h4>
                      <ul className="space-y-2 text-xs">
                        {t.environmental_benefits.map((ben, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{ben}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-bg p-4 rounded border border-border">
                      <div>
                        <span className="font-semibold block text-muted">Optimal Planting Season:</span>
                        <span className="font-medium text-charcoal">{t.planting_season}</span>
                      </div>
                      <div>
                        <span className="font-semibold block text-muted">Mature Height Potential:</span>
                        <span className="font-medium text-charcoal">{t.max_height_meters} meters</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-muted mb-1">Ethnobotanical & Community Value</h4>
                      <p className="text-xs text-muted leading-relaxed">{t.medicinal_or_economic_value}</p>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-4 border-t border-border flex justify-end">
                <button
                  onClick={() => setModalItem(null)}
                  className="px-5 py-2 text-xs font-semibold text-charcoal bg-bg border border-border rounded hover:bg-border transition-colors"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
