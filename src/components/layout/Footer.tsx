import React from 'react';
import { Link } from 'react-router-dom';
import { BotanicalLogo } from '../common/BotanicalLogo';
import { ArrowUpRight, ShieldCheck, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-12 border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Editorial Mission */}
          <div className="lg:col-span-2 space-y-4">
            <BotanicalLogo variant="light" />
            <p className="text-sage-light text-sm leading-relaxed max-w-sm">
              ROOTS is a community-driven afforestation and soil intelligence platform. We combine soil chemistry, native botanical science, community drives, and verified tree survival tracking to rebuild outdoor biodiversity across India.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-sage-light">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-olive-light" />
                Scientific Field Audit Standards
              </span>
              <span>ICFRE Aligned</span>
            </div>
          </div>

          {/* Platform Exploration */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-sage-light">
              <li>
                <Link to="/soil-plants" className="hover:text-white transition-colors">
                  Soil & Tree Explorer
                </Link>
              </li>
              <li>
                <Link to="/discover-soil" className="hover:text-white transition-colors">
                  Discover Your Soil Tool
                </Link>
              </li>
              <li>
                <Link to="/plantation-drives" className="hover:text-white transition-colors">
                  Plantation Drives
                </Link>
              </li>
              <li>
                <Link to="/nearby" className="hover:text-white transition-colors">
                  Nearby Drives Map
                </Link>
              </li>
              <li>
                <Link to="/tree-adoption" className="hover:text-white transition-colors">
                  Adopt a Tree & Track Survival
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational Science Hub */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-heading">
              Science & Learn
            </h4>
            <ul className="space-y-2 text-sm text-sage-light">
              <li>
                <Link to="/learn" className="hover:text-white transition-colors">
                  Afforestation vs Reforestation
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-white transition-colors">
                  Soil Chemistry & pH Dynamics
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-white transition-colors">
                  Essential Macronutrients (NPK)
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-white transition-colors">
                  Indian Monsoon Planting Windows
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-white transition-colors">
                  Sapling Survival (First 100 Days)
                </Link>
              </li>
            </ul>
          </div>

          {/* Accountability & Verification */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-heading">
              Accountability
            </h4>
            <ul className="space-y-2 text-sm text-sage-light">
              <li>
                <Link to="/impact" className="hover:text-white transition-colors flex items-center gap-1">
                  Environmental Impact Audit
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Methodology & Scientific Model
                </Link>
              </li>
              <li>
                <Link to="/host-drive" className="hover:text-white transition-colors">
                  Organizer Guidelines
                </Link>
              </li>
              <li>
                <Link to="/volunteer-dashboard" className="hover:text-white transition-colors">
                  Volunteer Verification
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Academic / Scientific Attribution */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-sage-light gap-4">
          <p>
            &copy; {new Date().getFullYear()} ROOTS Platform. Rebuilding Our Outdoors Through Sustainability. Developed for scientific exhibition and community afforestation.
          </p>
          <div className="flex items-center space-x-6">
            <span>Open Source Conservation Infrastructure</span>
            <span className="w-1 h-1 rounded-full bg-sage-light"></span>
            <span>Zero Commercial Monetization</span>
            <span className="w-1 h-1 rounded-full bg-sage-light"></span>
            <span>Privacy Preserved (OSM / Leaflet)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
