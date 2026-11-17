import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { SoilExplorer } from './pages/SoilExplorer';
import { SoilIdentification } from './pages/SoilIdentification';
import { LearnHub } from './pages/LearnHub';
import { PlantationDrives } from './pages/PlantationDrives';
import { HostDrive } from './pages/HostDrive';
import { NearbyDrives } from './pages/NearbyDrives';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { TreeAdoption } from './pages/TreeAdoption';
import { TreeDetail } from './pages/TreeDetail';
import { ImpactDashboard } from './pages/ImpactDashboard';
import { AuthPage } from './pages/AuthPage';
import { About } from './pages/About';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-bg text-charcoal font-body antialiased">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/soil-plants" element={<SoilExplorer />} />
              <Route path="/discover-soil" element={<SoilIdentification />} />
              <Route path="/learn" element={<LearnHub />} />
              <Route path="/plantation-drives" element={<PlantationDrives />} />
              <Route path="/host-drive" element={<HostDrive />} />
              <Route path="/nearby" element={<NearbyDrives />} />
              <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
              <Route path="/tree-adoption" element={<TreeAdoption />} />
              <Route path="/tree/:id" element={<TreeDetail />} />
              <Route path="/impact" element={<ImpactDashboard />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
