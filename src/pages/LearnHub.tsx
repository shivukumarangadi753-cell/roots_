import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  TreePine, 
  Droplets, 
  Calendar, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  FileCheck,
  Thermometer,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LearnHub: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<'concepts' | 'soil_chem' | 'planting_guide' | 'seasons' | 'sapling_care'>('concepts');

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
            Environmental Curriculum
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-charcoal">
            Educational Knowledge Hub
          </h1>
          <p className="mt-2 text-base text-muted leading-relaxed">
            Evidence-based educational modules on forest ecology, soil chemistry fundamentals, native silviculture, and systematic sapling maintenance tailored for Indian biomes.
          </p>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-4 mb-8">
          {[
            { id: 'concepts', label: '1. Afforestation vs Reforestation', icon: TreePine },
            { id: 'soil_chem', label: '2. Soil Chemistry & pH Dynamics', icon: Layers },
            { id: 'planting_guide', label: '3. Scientific 5-Step Planting', icon: FileCheck },
            { id: 'seasons', label: '4. Plantation Seasons in India', icon: Calendar },
            { id: 'sapling_care', label: '5. Sapling Care & First 100 Days', icon: Droplets },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTopic(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold transition-colors ${
                  activeTopic === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface border border-border text-charcoal hover:bg-bg'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-surface rounded-lg border border-border p-6 sm:p-10">
          {/* ================= TOPIC 1: FOREST CONCEPTS ================= */}
          {activeTopic === 'concepts' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Foundational Ecology</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-charcoal mt-1 mb-4">
                  Afforestation, Reforestation, and Deforestation
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  While frequently used interchangeably in public discourse, these three terms represent distinct ecological interventions with radically different ecological ramifications.
                </p>
              </div>

              {/* Comparative Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-bg p-5 rounded border border-border space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary">Afforestation</div>
                  <h3 className="text-base font-bold font-heading text-charcoal">Establishing New Canopies</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    The intentional establishment of a forest or stand of trees in an area where there was no recent previous tree cover (often non-forested agricultural wastelands, peri-urban scrub, or mining dumps).
                  </p>
                  <div className="text-[11px] font-medium text-charcoal bg-surface p-2.5 rounded border border-border">
                    Critical requirement: Thorough soil testing to avoid destroying natural native grasslands that harbor specialized biodiversity.
                  </div>
                </div>

                <div className="bg-bg p-5 rounded border border-border space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-sage">Reforestation</div>
                  <h3 className="text-base font-bold font-heading text-charcoal">Rebuilding Historic Biomes</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    The re-establishment of forest cover either naturally or by planting on land that was recently deforested through logging, wildfire, highway expansion, or clearance.
                  </p>
                  <div className="text-[11px] font-medium text-charcoal bg-surface p-2.5 rounded border border-border">
                    Key goal: Restoring the original baseline ecosystem composition rather than introducing commercial monoculture trees.
                  </div>
                </div>

                <div className="bg-bg p-5 rounded border border-border space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-charcoal">Deforestation</div>
                  <h3 className="text-base font-bold font-heading text-charcoal">Persistent Canopy Loss</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    The long-term conversion of forested land to non-forested uses (e.g., pastureland, intensive urban settlements, open-cast mines).
                  </p>
                  <div className="text-[11px] font-medium text-charcoal bg-surface p-2.5 rounded border border-border">
                    Severe consequence: Disruption of local rainfall precipitation recycling, soil erosion, and irreversible biodiversity collapse.
                  </div>
                </div>
              </div>

              {/* Native vs Invasive Section */}
              <div className="border-t border-border pt-8 space-y-4">
                <h3 className="text-xl font-bold font-heading text-charcoal">
                  The Native vs. Invasive Plant Dilemma
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  In India, past well-intentioned plantation drives extensively planted exotic alien species like <em>Eucalyptus tereticornis</em>, <em>Acacia auriculiformis</em>, and <em>Prosopis juliflora</em> (Vilayati Kikar). While fast-growing, these species deplete water tables, exude allelopathic chemicals that kill native seedlings, and fail to provide food for native bird and insect populations.
                </p>

                <div className="bg-primary-subtle border border-primary/20 p-4 rounded text-xs text-charcoal space-y-2">
                  <span className="font-bold text-primary block text-sm">ROOTS Silvicultural Protocol:</span>
                  <p className="leading-relaxed">
                    ROOTS exclusively approves and tracks plantations of indigenous native trees (such as Neem, Peepal, Banyan, Arjun, and Tamarind) that integrate seamlessly into local trophic webs and support regional microclimates.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TOPIC 2: SOIL CHEMISTRY ================= */}
          {activeTopic === 'soil_chem' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Pedology & Chemistry</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-charcoal mt-1 mb-4">
                  Soil Chemistry, pH Spectrum, and Essential Nutrients
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  Soil is not inert dirt; it is a chemically dynamic, biologically living membrane. The availability of essential plant nutrients is governed primarily by soil pH and organic humus complexes.
                </p>
              </div>

              {/* Visual CSS-based pH Chart */}
              <div className="bg-bg p-6 rounded border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-heading text-charcoal">The Agronomic pH Spectrum</h3>
                  <span className="text-xs text-muted">Optimal range for most Indian forest trees: 6.0 – 7.5</span>
                </div>

                <div className="w-full h-8 rounded grid grid-cols-14 overflow-hidden border border-border text-[10px] font-bold text-center leading-8 text-white">
                  <div style={{ backgroundColor: '#B85042' }}>1</div>
                  <div style={{ backgroundColor: '#D66D5B' }}>2</div>
                  <div style={{ backgroundColor: '#E28743' }}>3</div>
                  <div style={{ backgroundColor: '#EAB079' }}>4</div>
                  <div style={{ backgroundColor: '#E3C16F' }}>5</div>
                  <div style={{ backgroundColor: '#A3A77A' }}>6</div>
                  <div style={{ backgroundColor: '#244C3A' }}>7</div>
                  <div style={{ backgroundColor: '#3A6351' }}>8</div>
                  <div style={{ backgroundColor: '#587A6E' }}>9</div>
                  <div style={{ backgroundColor: '#6F8C81' }}>10</div>
                  <div style={{ backgroundColor: '#819783' }}>11</div>
                  <div style={{ backgroundColor: '#9BB09D' }}>12</div>
                  <div style={{ backgroundColor: '#B3C4B5' }}>13</div>
                  <div style={{ backgroundColor: '#CCD8CD' }}>14</div>
                </div>

                <div className="flex justify-between text-xs text-muted pt-1">
                  <span>Strongly Acidic (Laterite Soils)</span>
                  <span className="font-semibold text-primary">Neutral Equilibrium (pH 7.0)</span>
                  <span>Strongly Alkaline (Sodic Soils)</span>
                </div>
              </div>

              {/* Primary Macronutrients Breakdown (NPK) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-heading text-charcoal">The Primary Macronutrients (NPK)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-bg p-5 rounded border border-border">
                    <div className="text-xs font-bold text-primary mb-1">Nitrogen (N)</div>
                    <div className="text-sm font-bold font-heading text-charcoal mb-2">Vegetative & Foliar Vigor</div>
                    <p className="text-xs text-muted leading-relaxed">
                      Fundamental constituent of chlorophyll and plant amino acids. Drives dark green leaf development and rapid sapling shoot extension.
                    </p>
                  </div>

                  <div className="bg-bg p-5 rounded border border-border">
                    <div className="text-xs font-bold text-primary mb-1">Phosphorus (P)</div>
                    <div className="text-sm font-bold font-heading text-charcoal mb-2">Root Architecture & Energy</div>
                    <p className="text-xs text-muted leading-relaxed">
                      Powers ATP energy transfer and deep taproot penetration into subsoil strata. Critical during the initial 90-day root establishment phase.
                    </p>
                  </div>

                  <div className="bg-bg p-5 rounded border border-border">
                    <div className="text-xs font-bold text-primary mb-1">Potassium (K)</div>
                    <div className="text-sm font-bold font-heading text-charcoal mb-2">Osmoregulation & Disease Shield</div>
                    <p className="text-xs text-muted leading-relaxed">
                      Controls stomatal opening and transpiration water loss. Strengthens stem cell walls against pest invasion and dry summer drought stress.
                    </p>
                  </div>
                </div>
              </div>

              {/* Soil Conservation Techniques */}
              <div className="border-t border-border pt-6 space-y-3">
                <h3 className="text-lg font-bold font-heading text-charcoal">Soil Conservation & Erosion Prevention</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Topsoil takes 500 to 1,000 years to form 1 inch of fertile depth. Contour bunding, organic cover cropping with cowpeas, and zero-tillage sapling basins protect this irreplaceable biological layer from monsoon sheet erosion.
                </p>
              </div>
            </div>
          )}

          {/* ================= TOPIC 3: PLANTATION GUIDE ================= */}
          {activeTopic === 'planting_guide' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Field Protocol</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-charcoal mt-1 mb-4">
                  The Scientific 5-Step Tree Planting Technique
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  Over 70% of urban sapling failures occur due to incorrect planting depth, unloosened root balls, or lack of basin mulching. Follow this field-tested procedure.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: '01',
                    title: 'Excavate the Optimal Pit (60 x 60 x 60 cm)',
                    desc: 'Dig a pit at least twice the width of the sapling root bag. Separate the fertile topsoil (first 20 cm) from the subsoil. Allow the excavated pit to aerate in solar radiation for 4 to 7 days before planting.'
                  },
                  {
                    step: '02',
                    title: 'Soil Enrichment & Pit Refilling',
                    desc: 'Mix the excavated topsoil with 10–15 kg of well-decomposed cow manure or vermicompost, 100g neem cake (to deter white termites), and coarse river sand if planting in heavy clay. Fill the pit back to 50% capacity.'
                  },
                  {
                    step: '03',
                    title: 'Careful Root Ball Unsheathing',
                    desc: 'Slit the polybag carefully with a utility blade without cutting or crumbling the root ball. Gently loosen spiraled circling roots at the base with your fingers to stimulate outward root exploration.'
                  },
                  {
                    step: '04',
                    title: 'Collar Alignment & Gentle Compaction',
                    desc: 'Position the sapling so the root collar (where root meets stem) is exactly level with or 2 cm above the surrounding ground level. Firm the soil gently with your feet to eliminate large air pockets without suffocating the roots.'
                  },
                  {
                    step: '05',
                    title: 'Basin Construction, Staking & Mulching',
                    desc: 'Form a circular earthen rim (basin) of 80 cm diameter to channel water. Drive a sturdy bamboo stake outside the root ball and tie with flexible cloth. Spread a 10 cm layer of dry fallen leaves as moisture-retaining mulch.'
                  }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-4 rounded bg-bg border border-border">
                    <span className="text-2xl font-extrabold font-heading text-primary/40 shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-base font-bold font-heading text-charcoal mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TOPIC 4: SEASONS ================= */}
          {activeTopic === 'seasons' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Bioclimatic Calendar</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-charcoal mt-1 mb-4">
                  Plantation Seasons Across Indian Agro-Climatic Zones
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  Planting out of sync with regional monsoon dynamics forces reliance on intensive artificial irrigation and dramatically reduces 1-year sapling survival.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-bg rounded border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold font-heading text-charcoal">
                      South-West Monsoon (June – August) — Prime National Window
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-subtle text-primary">
                      Highest National Survival
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Applies to Western Ghats, Deccan Plateau, Central India, Northern Plains, and North-East India. Planting during the second week of regular rainfall allows roots to establish 90 days before cold or dry periods begin.
                  </p>
                </div>

                <div className="p-5 bg-bg rounded border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold font-heading text-charcoal">
                      North-East Retreating Monsoon (October – December) — Coastal Southern India
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sage-subtle text-sage">
                      Regional Optimum
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Ideal for Tamil Nadu, coastal Andhra Pradesh, and parts of southern Karnataka that receive the bulk of annual rainfall during winter cyclonic depressions.
                  </p>
                </div>

                <div className="p-5 bg-bg rounded border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold font-heading text-charcoal">
                      Winter Dormancy & Pre-Spring (January – February) — Sub-Himalayan Belt
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-olive-subtle text-charcoal">
                      Temperate Only
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Recommended only for bare-root deciduous temperate species (oak, walnut, deodar) in hill zones while trees are in deep physiological dormancy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= TOPIC 5: SAPLING CARE ================= */}
          {activeTopic === 'sapling_care' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Survival Protocol</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-charcoal mt-1 mb-4">
                  Sapling Maintenance: The Crucial First 100 Days
                </h2>
                <p className="text-sm text-muted leading-relaxed">
                  The initial 100 days decide whether a tree develops self-sustaining mycorrhizal symbioses or succumbs to transplant shock.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-bg p-5 rounded border border-border space-y-2">
                  <h4 className="font-bold font-heading text-charcoal text-sm">Deep Soaking vs Light Sprinkling</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Light daily sprinkling encourages shallow surface roots that scorch under summer heat. Instead, apply 15–20 liters once every 4 to 6 days directly into the root basin. This forces the taproot to grow deep into subsoil moisture reserves.
                  </p>
                </div>

                <div className="bg-bg p-5 rounded border border-border space-y-2">
                  <h4 className="font-bold font-heading text-charcoal text-sm">Organic Mulching Rings</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Maintain a 10 cm layer of dry leaves, straw, or coconut coir in an 80 cm radius around the stem. Keep mulch 5 cm away from the trunk collar itself to prevent fungal bark rot while suppressing competitive weeds.
                  </p>
                </div>

                <div className="bg-bg p-5 rounded border border-border space-y-2">
                  <h4 className="font-bold font-heading text-charcoal text-sm">Weed Clearance Radius</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Invasive grasses like <em>Cynodon dactylon</em> rob young saplings of 60% of available soil nitrogen. Hand-weed a 1-meter circle around each sapling every 30 days during the initial monsoon season.
                  </p>
                </div>

                <div className="bg-bg p-5 rounded border border-border space-y-2">
                  <h4 className="font-bold font-heading text-charcoal text-sm">Tree Guard & Grazing Protection</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Cattle and feral goats can destroy 50 saplings in under an hour. In community areas, erect wire-mesh or bamboo wattle guards anchored securely into the earth.
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-6 flex items-center justify-between">
                <div className="text-xs text-muted">
                  Ready to test your knowledge or volunteer for a live event?
                </div>
                <Link
                  to="/plantation-drives"
                  className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded hover:bg-primary-hover transition-colors"
                >
                  Join an Upcoming Plantation Drive &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
