import React from 'react';
import { 
  ShieldCheck, 
  TreePine, 
  Droplets, 
  Layers, 
  Microscope, 
  Users, 
  BookOpen, 
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="py-16 bg-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero / Mission Statement */}
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
            Institutional Rationale
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-charcoal leading-tight">
            Science-Led Ecological Restoration for the Real World
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
            ROOTS (Rebuilding Our Outdoors Through Sustainability) was architected to solve the fatal flaw of modern afforestation campaigns: counting saplings planted rather than trees sustained.
          </p>
        </div>

        {/* Editorial Narrative Section */}
        <div className="bg-surface rounded-lg border border-border p-8 sm:p-12 space-y-8">
          <div>
            <h2 className="text-2xl font-bold font-heading text-charcoal mb-4">
              The Genesis of ROOTS
            </h2>
            <div className="space-y-4 text-sm text-charcoal leading-relaxed">
              <p>
                Every monsoon across India, millions of tree saplings are planted in televised photo-ops. Yet silvicultural studies show that over 65% to 80% of these seedlings perish within the first 180 days due to mismatched soil conditions, neglect, drought, or invasive species competition.
              </p>
              <p>
                ROOTS re-engineers this pipeline by bridging <strong>pedology (soil science)</strong>, <strong>botanical taxonomy</strong>, and <strong>decentralized community guardianship</strong> into a unified digital infrastructure suitable for college chemistry/environmental exhibitions and nationwide NGO deployments.
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <h3 className="text-xl font-bold font-heading text-charcoal mb-6">
              Our Four Foundational Tenets
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-bg p-5 rounded border border-border space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm font-heading">
                  <Layers className="w-4 h-4" />
                  1. Soil-First Matching Engine
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  No sapling is recommended without assessing the underlying soil texture, chemical pH bracket, and drainage behavior. A tree planted in incompatible soil is guaranteed to fail.
                </p>
              </div>

              <div className="bg-bg p-5 rounded border border-border space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm font-heading">
                  <TreePine className="w-4 h-4" />
                  2. Strict Native Species Exclusivity
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  We prohibit commercial exotic monocultures (such as eucalyptus or acacia) in community drives. We champion endemic Indian keystone species like Neem, Banyan, Arjun, and Tamarind.
                </p>
              </div>

              <div className="bg-bg p-5 rounded border border-border space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm font-heading">
                  <ShieldCheck className="w-4 h-4" />
                  3. Verified 365-Day Survival Audits
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Every sapling receives a unique identification code. Growth checkpoints at Days 30, 90, 180, and 365 require physical measurements and photographic evidence to calculate actual survival rates.
                </p>
              </div>

              <div className="bg-bg p-5 rounded border border-border space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm font-heading">
                  <Users className="w-4 h-4" />
                  4. Community & Academic Collaboration
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Connecting university research laboratories, chemistry departments, and local citizen volunteers to convert academic soil data into tangible green cover.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Project Exhibition Callout */}
        <div className="bg-primary text-white rounded-xl p-8 sm:p-10 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-olive-light">
            <Microscope className="w-4 h-4" />
            Exhibition & Technical Foundation
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">
            Designed for Chemistry & Environmental Science Evaluation
          </h2>
          <p className="text-sm text-sage-light leading-relaxed max-w-3xl">
            This platform serves as a complete demonstrable exemplar for college chemistry projects (evaluating soil pH, cation exchange, macronutrient NPK dynamics, and organic humus degradation) while maintaining the architectural rigor of an enterprise PostgreSQL / Supabase production system.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/discover-soil"
              className="px-5 py-2.5 bg-white text-primary text-xs font-semibold rounded hover:bg-bg transition-colors"
            >
              Test Soil Diagnostic Tool
            </Link>
            <Link
              to="/impact"
              className="px-5 py-2.5 border border-white/40 text-white text-xs font-semibold rounded hover:bg-white/10 transition-colors"
            >
              View Environmental Metrics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
