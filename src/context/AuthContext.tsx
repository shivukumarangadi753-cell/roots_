import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { localDb } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  signup: (data: { email: string; full_name: string; role: UserRole; organization?: string }) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => localDb.getCurrentUser());

  useEffect(() => {
    if (user) {
      localDb.setCurrentUser(user);
    }
  }, [user]);

  const login = async (email: string, designatedRole?: UserRole): Promise<boolean> => {
    // In our robust local/demo layer, we authenticate the user immediately
    const updated: UserProfile = {
      id: user?.id || `usr-${Date.now().toString(36)}`,
      email,
      full_name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: designatedRole || user?.role || 'volunteer',
      organization: designatedRole === 'organizer' ? 'State Afforestation Trust' : user?.organization,
      trees_planted_count: user?.trees_planted_count || 4,
      phone: '+91 98450 11223',
      bio: 'Conservation advocate and active participant in native species restoration.'
    };
    setUser(updated);
    localDb.setCurrentUser(updated);
    return true;
  };

  const signup = async (data: { email: string; full_name: string; role: UserRole; organization?: string }): Promise<boolean> => {
    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      organization: data.organization,
      trees_planted_count: 0,
      phone: '',
      bio: 'Newly registered ROOTS platform member.'
    };
    setUser(newUser);
    localDb.setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    // Reset to demo profile or clear
    const resetUser: UserProfile = {
      id: 'usr-guest',
      email: 'guest@roots.org',
      full_name: 'Guest Volunteer',
      role: 'volunteer',
      trees_planted_count: 0
    };
    setUser(resetUser);
    localDb.setCurrentUser(resetUser);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    localDb.setCurrentUser(updated);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localDb.setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'volunteer',
        isAuthenticated: Boolean(user && user.id !== 'usr-guest'),
        login,
        signup,
        logout,
        switchRole,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
