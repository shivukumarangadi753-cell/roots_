import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BotanicalLogo } from '../common/BotanicalLogo';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  X, 
  Compass, 
  TreePine, 
  BookOpen, 
  Calendar, 
  User, 
  BarChart3, 
  PlusCircle, 
  ShieldCheck, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, role, switchRole, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Soil & Plants', path: '/soil-plants' },
    { name: 'Soil Identifier', path: '/discover-soil' },
    { name: 'Learn', path: '/learn' },
    { name: 'Plantation Drives', path: '/plantation-drives' },
    { name: 'Nearby Drives', path: '/nearby' },
    { name: 'Tree Adoption', path: '/tree-adoption' },
    { name: 'Impact', path: '/impact' },
    { name: 'About', path: '/about' },
  ];

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <BotanicalLogo />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm font-medium transition-colors rounded ${
                    isActive
                      ? 'text-primary bg-primary-subtle font-semibold'
                      : 'text-charcoal hover:text-primary hover:bg-bg'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Host Drive CTA for Organizers / Admins */}
            {(role === 'organizer' || role === 'admin') && (
              <Link
                to="/host-drive"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wide text-primary border border-primary/40 rounded hover:bg-primary-subtle transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Host a Drive
              </Link>
            )}

            {/* Role Demo Pill */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border border-border bg-bg text-charcoal hover:border-sage transition-colors"
                title="Change active role for demonstration"
              >
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="capitalize">{role}</span>
                <ChevronDown className="w-3 h-3 text-muted" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded-md shadow-card border border-border py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-border text-xs text-muted">
                    Switch Role (System Evaluation):
                  </div>
                  {(['volunteer', 'organizer', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-3 py-1.5 text-xs capitalize flex items-center justify-between ${
                        role === r ? 'bg-primary-subtle text-primary font-semibold' : 'text-charcoal hover:bg-bg'
                      }`}
                    >
                      <span>{r} View</span>
                      {role === r && <ShieldCheck className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                  
                  <div className="border-t border-border mt-1 pt-1">
                    <Link
                      to="/volunteer-dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-1.5 text-xs text-charcoal hover:bg-bg"
                    >
                      Volunteer Dashboard
                    </Link>
                    <Link
                      to="/impact"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-1.5 text-xs text-charcoal hover:bg-bg"
                    >
                      Impact Audit Metrics
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Volunteer Dashboard or Auth Button */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/volunteer-dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-hover transition-colors shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-muted hover:text-charcoal rounded hover:bg-bg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth?mode=login"
                  className="px-3 py-1.5 text-xs font-semibold text-charcoal hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-hover transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal hover:text-primary focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-surface px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-base font-medium text-charcoal hover:text-primary hover:bg-bg transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-border mt-3 space-y-2">
            <div className="text-xs text-muted px-3">Switch Demonstration Role:</div>
            <div className="grid grid-cols-3 gap-1 px-3">
              {(['volunteer', 'organizer', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-xs py-1.5 rounded capitalize text-center border ${
                    role === r 
                      ? 'border-primary bg-primary text-white font-semibold' 
                      : 'border-border text-charcoal bg-bg'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="pt-2 px-3 flex flex-col gap-2">
              <Link
                to="/volunteer-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-white bg-primary rounded hover:bg-primary-hover transition-colors"
              >
                Volunteer Dashboard
              </Link>
              {(role === 'organizer' || role === 'admin') && (
                <Link
                  to="/host-drive"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-primary border border-primary rounded hover:bg-primary-subtle transition-colors"
                >
                  Host a Plantation Drive
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
