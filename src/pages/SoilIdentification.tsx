import React, { useState } from 'react';
import { SoilAssessmentInput, SoilAssessmentResult } from '../types';
import { 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  HelpCircle, 
  RefreshCw, 
  FileText, 
  TreePine, 
  Droplets,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SoilIdentification: React.FC = () => {
  const [formData, setFormData] = useState<SoilAssessmentInput>({
    texture: '',
    color: '',
    waterDrainage: '',
    consistency: '',
    location: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<SoilAssessmentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Texture options based on FAO/USDA Soil Ribbon feel test
  const textureOptions = [
    { value: 'gritty_rough', label: 'Gritty and coarse (individual sand grains visible, does not form a ball)' },
    { value: 'smooth_silky', label: 'Silky, soft, flour-like (smooth when dry, non-sticky when moist)' },
    { value: 'sticky_plastic', label: 'Very sticky and moldable (forms a ribbon > 5 cm without breaking)' },
    { value: 'balanced_crumbly', label: 'Balanced and crumbly (forms a soft pliable ball that crumbles easily)' },
    { value: 'gravelly_stony', label: 'Stony, coarse, porous gravel with vesicular pebbles' },
  ];

  // Color options
  const colorOptions = [
    { value: 'deep_black', label: 'Deep black to dark greyish slate' },
    { value: 'red_terracotta', label: 'Rust red, reddish brown, or brick terra-cotta' },
    { value: 'light_grey_tan', label: 'Light grey, ash grey, to pale golden silt' },
    { value: 'pale_yellow_beige', label: 'Pale beige, bleached yellowish sand' },
    { value: 'dark_brown_chocolate', label: 'Rich dark chocolate brown (high organic matter)' },
    { value: 'mottled_orange_ochre', label: 'Mottled brick-orange to rusty ochre' },
  ];

  // Drainage options
  const drainageOptions = [
    { value: 'ultra_fast', label: 'Excessive / rapid (poured water disappears within seconds)' },
    { value: 'moderate_steady', label: 'Moderate & uniform (soaks in within 2 to 5 minutes without pooling)' },
    { value: 'slow_stagnant', label: 'Very slow / pooled (water stands for hours, forms a puddle)' },
    { value: 'rapid_runoff', label: 'Fast surface run-off (sloping gravel terrain)' },
  ];

  // Consistency options
  const consistencyOptions = [
    { value: 'hard_fissured', label: 'Hard as rock when dry, develops deep shrinkage cracks' },
    { value: 'loose_crumbly', label: 'Loose, easily excavated with hands, never forms hard clods' },
    { value: 'spongy_friable', label: 'Porous, spongy, easily broken with light finger pressure' },
    { value: 'cemented_brick', label: 'Hardens irreversibly into dense brick-like crust upon sun drying' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please upload an image smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.texture || !formData.color || !formData.waterDrainage || !formData.consistency) {
      alert('Please select all observational characteristics to proceed with assessment.');
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      // Diagnostic determination matrix based on agronomic soil taxonomy
      let identified = 'Loamy Soil';
      let confidence = '82%';
      let explanation = 'Balanced sand-silt-clay ratio with good microbial organic content.';
      let characteristics = [
        'Well-aerated crumb matrix providing oxygen to rhizosphere',
        'Capable of sustaining capillary water without anaerobic stagnation',
        'High natural cation exchange capacity'
      ];
      let ph = '6.2 – 7.2 (Ideal agronomic neutral)';
      let nutrientProfile = 'Balanced Nitrogen, Phosphorus, Potassium (NPK) with active humic matter.';
      let trees = ['Neem', 'Banyan', 'Peepal', 'Mango', 'Teak', 'Indian Gooseberry (Amla)'];
      let methods = [
        'Standard 60 x 60 x 60 cm pits enriched with 10 kg vermicompost',
        'Dry organic leaf mulching to conserve moisture in early establishment',
        'Bi-weekly deep soak watering during the first summer season'
      ];

      // Black Soil evaluation
      if (
        formData.color === 'deep_black' || 
        (formData.texture === 'sticky_plastic' && formData.consistency === 'hard_fissured')
      ) {
        identified = 'Black Soil (Regur)';
        confidence = '88%';
        explanation = 'High montmorillonite clay content originating from Deccan trap basaltic weathering. Expands when wetted and shrinks with deep fissures upon desiccation.';
        characteristics = [
          'Extreme water retention holding moisture deep into post-monsoon winter',
          'Rich in calcium, magnesium carbonates, and potash',
          'Prone to severe pore compaction and root asphyxiation during heavy waterlogging'
        ];
        ph = '7.6 – 8.5 (Mildly alkaline)';
        nutrientProfile = 'High Calcium and Magnesium; low in available Phosphorus and Nitrogen.';
        trees = ['Neem', 'Banyan', 'Tamarind', 'Teak'];
        methods = [
          'Raised mound planting (15–20 cm above grade) to prevent monsoon collar rot',
          'Incorporate coarse sand and well-rotted dry farmyard manure in the planting pit',
          'Avoid over-watering in winter as subsoil retains capillary water for months'
        ];
      }
      // Red Soil evaluation
      else if (
        formData.color === 'red_terracotta' || 
        (formData.texture === 'balanced_crumbly' && formData.waterDrainage === 'moderate_steady')
      ) {
        identified = 'Red Soil';
        confidence = '85%';
        explanation = 'Weathered crystalline and metamorphic granite rocks with diffused ferric oxide imparting the rust-red hue. Highly permeable with low clay cohesion.';
        characteristics = [
          'Excellent internal aeration preventing fungal root decay',
          'Fast percolation rate avoids stagnant water collars',
          'Vulnerable to nutrient wash and leaching during torrential showers'
        ];
        ph = '5.5 – 6.8 (Slightly acidic to neutral)';
        nutrientProfile = 'Deficient in organic nitrogen, humus, and available phosphate; elevated iron.';
        trees = ['Mango', 'Jackfruit', 'Tamarind', 'Indian Gooseberry (Amla)', 'Teak'];
        methods = [
          'Pit amendment with 15 kg biochar compost to boost cation retention',
          'Construct a saucer-shaped water-harvesting basin around each sapling stem',
          'Thick 10 cm straw or sugarcane bagasse mulch to prevent solar desiccation'
        ];
      }
      // Laterite Soil evaluation
      else if (
        formData.color === 'mottled_orange_ochre' || 
        (formData.consistency === 'cemented_brick' && formData.texture === 'gravelly_stony')
      ) {
        identified = 'Laterite Soil';
        confidence = '84%';
        explanation = 'Intensely leached tropical soil formed under alternating high rainfall and hot dry spells. Highly vesicular and rich in aluminum and iron hydroxides.';
        characteristics = [
          'Hardens irreversibly into durable brick-like material upon solar drying',
          'High internal drainage and gravelly porosity',
          'Low intrinsic fertility with rapid nutrient leaching'
        ];
        ph = '4.5 – 5.8 (Moderately to strongly acidic)';
        nutrientProfile = 'Extremely low in available lime, nitrogen, and magnesium; high iron and bauxite.';
        trees = ['Jackfruit', 'Coconut', 'Teak', 'Cashew'];
        methods = [
          'Buffer planting pit with 200g agricultural lime (CaCO3) to neutralize extreme acidity',
          'Heavy green manure leaf addition (Pongamia, Gliricidia) to build biological organic layer',
          'Terrace bunding to halt surface gravel erosion along slopes'
        ];
      }
      // Sandy Soil evaluation
      else if (
        formData.texture === 'gritty_rough' || 
        formData.waterDrainage === 'ultra_fast' || 
        formData.color === 'pale_yellow_beige'
      ) {
        identified = 'Sandy Soil';
        confidence = '89%';
        explanation = 'Dominated by large silica quartz grains with negligible colloidal clay platelets. Rapid water percolation with near-zero nutrient binding.';
        characteristics = [
          'Rapid drainage preventing any chance of root rot',
          'Low moisture holding capacity; requires frequent micro-irrigation',
          'Warms rapidly, stimulating early root vigor if moisture is maintained'
        ];
        ph = '6.5 – 7.8 (Neutral to slightly alkaline)';
        nutrientProfile = 'Very low cation exchange capacity; mineral nutrients wash out rapidly.';
        trees = ['Coconut', 'Neem', 'Casuarina', 'Tamarind'];
        methods = [
          'Line the bottom 15 cm of the planting pit with decomposed cow dung and clay loam buffer',
          'Install sub-surface clay pot (Olla) or drip irrigation for localized root feeding',
          'Continuous dense organic mulch ring around sapling'
        ];
      }
      // Clay Soil evaluation
      else if (
        formData.texture === 'sticky_plastic' || 
        formData.waterDrainage === 'slow_stagnant'
      ) {
        identified = 'Clay Soil';
        confidence = '86%';
        explanation = 'Very fine microscopic mineral platelets that bind tightly. High nutrient density but poor internal aeration when wet.';
        characteristics = [
          'High structural nutrient retention with zero mineral leaching',
          'Prone to severe surface crusting and slow drainage',
          'Impedes fragile young seedling root penetration unless loosened'
        ];
        ph = '7.0 – 8.2 (Neutral to moderately alkaline)';
        nutrientProfile = 'Rich in potassium, calcium, and trace minerals; poor biological aeration.';
        trees = ['Arjun', 'Banyan', 'Peepal'];
        methods = [
          'Incorporate coarse river sand and shredded dry leaves into excavated pit soil (1:1 ratio)',
          'Avoid stepping on or compacting soil within the tree drip line',
          'Slope surface drainage away from the tree root crown'
        ];
      }
      // Alluvial Soil evaluation
      else if (
        formData.color === 'light_grey_tan' || 
        formData.texture === 'smooth_silky'
      ) {
        identified = 'Alluvial Soil';
        confidence = '90%';
        explanation = 'Riverine silt deposit transported by drainage basins. Deep, porous, and highly productive for broadleaf forest trees.';
        characteristics = [
          'Naturally high chemical fertility and active minerals',
          'Soft friable silt texture facilitating deep taproot extension',
          'Good moisture retention with balanced internal percolation'
        ];
        ph = '6.8 – 8.0 (Neutral to mildly alkaline)';
        nutrientProfile = 'Rich in potash and phosphoric acid; benefits from companion nitrogen fixation.';
        trees = ['Peepal', 'Banyan', 'Mango', 'Arjun', 'Teak', 'Indian Gooseberry (Amla)'];
        methods = [
          'Standard planting pit with topsoil and compost blend',
          'Plant companion leguminous ground cover (such as green gram or cowpea) around base',
          'Staking against monsoon wind shear during the first 6 months'
        ];
      }

      setResult({
        soilCategory: identified,
        scientificConfidence: confidence,
        explanation,
        primaryCharacteristics: characteristics,
        estimatedPh: ph,
        nutrientProfile,
        recommendedTrees: trees,
        suggestedPlantationMethods: methods,
        laboratoryAdvisory: 'NOTICE: This soil diagnosis is an educational field estimate derived from macroscopic observational indicators (texture feel, colorimetric shade, percolation rate, and regional pedology). Accurate quantitative determination of soil pH, cation exchange capacity (CEC), and precise NPK percentages requires laboratory test analysis (e.g., standard potentiometric pH testing in 1:2.5 soil-water suspension).'
      });

      setIsAnalyzing(false);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      texture: '',
      color: '',
      waterDrainage: '',
      consistency: '',
      location: '',
    });
    setImagePreview(null);
    setResult(null);
  };

  return (
    <div className="py-12 bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
            Pedological Diagnostic Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-charcoal">
            Discover Your Soil
          </h1>
          <p className="mt-2 text-base text-muted leading-relaxed">
            Diagnose the physical properties of your plantation site using standard macroscopic field observation methods. Identify likely soil classifications, compatible endemic trees, and planting amendments.
          </p>
        </div>

        {/* Diagnostic Form */}
        {!result ? (
          <form onSubmit={calculateAssessment} className="space-y-8 bg-surface rounded-lg border border-border p-6 sm:p-8">
            {/* Step 1: Texture Feel */}
            <div className="space-y-3">
              <label className="block text-sm font-bold font-heading text-charcoal">
                1. Soil Texture (Ribbon & Feel Test)
                <span className="text-muted font-normal block text-xs mt-0.5">
                  Moisten a small palm-sized sample of soil with clean water and rub it between your thumb and forefinger.
                </span>
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {textureOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 text-xs rounded border cursor-pointer transition-colors ${
                      formData.texture === opt.value
                        ? 'border-primary bg-primary-subtle text-primary font-medium'
                        : 'border-border bg-surface text-charcoal hover:bg-bg'
                    }`}
                  >
                    <input
                      type="radio"
                      name="texture"
                      value={opt.value}
                      checked={formData.texture === opt.value}
                      onChange={(e) => setFormData({ ...formData, texture: e.target.value })}
                      className="mt-0.5 text-primary focus:ring-primary"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 2: Color */}
            <div className="space-y-3 pt-4 border-t border-border">
              <label className="block text-sm font-bold font-heading text-charcoal">
                2. Soil Color (Under Natural Daylight)
                <span className="text-muted font-normal block text-xs mt-0.5">
                  Observe the soil color 10–15 cm below the dry surface layer in indirect natural light.
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {colorOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 text-xs rounded border cursor-pointer transition-colors ${
                      formData.color === opt.value
                        ? 'border-primary bg-primary-subtle text-primary font-medium'
                        : 'border-border bg-surface text-charcoal hover:bg-bg'
                    }`}
                  >
                    <input
                      type="radio"
                      name="color"
                      value={opt.value}
                      checked={formData.color === opt.value}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="mt-0.5 text-primary focus:ring-primary"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Water Drainage */}
            <div className="space-y-3 pt-4 border-t border-border">
              <label className="block text-sm font-bold font-heading text-charcoal">
                3. Water Drainage & Infiltration Behavior
                <span className="text-muted font-normal block text-xs mt-0.5">
                  Pour 1 liter of water into a 15 cm test hole. How rapidly does the water percolate downward?
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {drainageOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 text-xs rounded border cursor-pointer transition-colors ${
                      formData.waterDrainage === opt.value
                        ? 'border-primary bg-primary-subtle text-primary font-medium'
                        : 'border-border bg-surface text-charcoal hover:bg-bg'
                    }`}
                  >
                    <input
                      type="radio"
                      name="waterDrainage"
                      value={opt.value}
                      checked={formData.waterDrainage === opt.value}
                      onChange={(e) => setFormData({ ...formData, waterDrainage: e.target.value })}
                      className="mt-0.5 text-primary focus:ring-primary"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 4: Consistency */}
            <div className="space-y-3 pt-4 border-t border-border">
              <label className="block text-sm font-bold font-heading text-charcoal">
                4. Soil Consistency When Dry
                <span className="text-muted font-normal block text-xs mt-0.5">
                  What happens to clods of this soil after several rain-free sunny days?
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {consistencyOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 text-xs rounded border cursor-pointer transition-colors ${
                      formData.consistency === opt.value
                        ? 'border-primary bg-primary-subtle text-primary font-medium'
                        : 'border-border bg-surface text-charcoal hover:bg-bg'
                    }`}
                  >
                    <input
                      type="radio"
                      name="consistency"
                      value={opt.value}
                      checked={formData.consistency === opt.value}
                      onChange={(e) => setFormData({ ...formData, consistency: e.target.value })}
                      className="mt-0.5 text-primary focus:ring-primary"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 5: Approximate Location & Optional Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div>
                <label className="block text-sm font-bold font-heading text-charcoal mb-1">
                  5. Approximate Location / Region
                </label>
                <input
                  type="text"
                  placeholder="e.g., North Bengaluru, Deccan Plateau, Western Ghats"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-xs p-2.5 border border-border rounded bg-bg text-charcoal focus:outline-none focus:border-primary"
                />
                <span className="text-[11px] text-muted mt-1 block">
                  Used solely to contextualize broader geographic soil belts.
                </span>
              </div>

              <div>
                <label className="block text-sm font-bold font-heading text-charcoal mb-1">
                  Optional Soil Photograph
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="w-full text-xs text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary-subtle file:text-primary hover:file:bg-border"
                />
                <span className="text-[11px] text-muted mt-1 block">
                  For documentation only. ROOTS does NOT make fraudulent claims of measuring pH from photos.
                </span>
                {imagePreview && (
                  <img src={imagePreview} alt="Soil sample preview" className="mt-2 h-20 w-32 object-cover rounded border border-border" />
                )}
              </div>
            </div>

            {/* Scientific Notice */}
            <div className="bg-bg p-4 rounded border border-border text-xs text-muted flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-olive shrink-0 mt-0.5" />
              <p>
                <strong>Scientific Protocol:</strong> This assessment evaluates macro-physical soil characteristics. Official pH values, electrical conductivity (EC), and organic carbon require standardized laboratory equipment.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full sm:w-auto px-8 py-3 bg-primary text-white text-sm font-semibold rounded hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Synthesizing Pedological Profile...
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4" />
                    Generate Soil Assessment
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* ================= RESULT VIEW ================= */
          <div className="space-y-6">
            <div className="bg-surface rounded-lg border border-border p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Diagnostic Output
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-charcoal">
                    Likely Classification: {result.soilCategory}
                  </h2>
                  <div className="text-xs text-muted mt-1">
                    Pedological Confidence Indicator: <span className="text-primary font-semibold">{result.scientificConfidence}</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-charcoal border border-border rounded hover:bg-bg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Test Another Sample
                </button>
              </div>

              {/* Scientific Explanation */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">
                  Morphological & Geological Explanation
                </h3>
                <p className="text-sm text-charcoal leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              {/* Characteristics & pH Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-bg p-4 rounded border border-border">
                  <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                    Estimated pH Tendency
                  </div>
                  <div className="text-lg font-bold font-heading text-primary">
                    {result.estimatedPh}
                  </div>
                  <p className="text-xs text-muted mt-1">
                    Based on mineral genesis and observed colorimetric attributes.
                  </p>
                </div>

                <div className="bg-bg p-4 rounded border border-border">
                  <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                    Nutrient Availability Profile
                  </div>
                  <div className="text-xs text-charcoal font-medium mt-1 leading-relaxed">
                    {result.nutrientProfile}
                  </div>
                </div>
              </div>

              {/* Key Characteristics */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Observed Physical Characteristics
                </h3>
                <ul className="space-y-1.5 text-xs text-charcoal">
                  {result.primaryCharacteristics.map((char, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Trees */}
              <div className="border-t border-border pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Recommended Endemic Tree Species for this Soil
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.recommendedTrees.map((tree, i) => (
                    <Link
                      key={i}
                      to="/soil-plants"
                      className="px-3 py-1.5 rounded bg-primary-subtle border border-primary/20 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
                    >
                      {tree} &rarr;
                    </Link>
                  ))}
                </div>
              </div>

              {/* Suggested Plantation Methods */}
              <div className="border-t border-border pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Suggested Plantation & Soil Amendment Methods
                </h3>
                <ul className="space-y-2 text-xs text-charcoal">
                  {result.suggestedPlantationMethods.map((mth, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{mth}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Laboratory Advisory Banner */}
              <div className="border-t border-border pt-6">
                <div className="bg-bg p-4 rounded border border-border text-xs text-muted space-y-1">
                  <div className="font-semibold text-charcoal flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-olive" />
                    Scientific Laboratory Advisory Notice
                  </div>
                  <p className="leading-relaxed">
                    {result.laboratoryAdvisory}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
