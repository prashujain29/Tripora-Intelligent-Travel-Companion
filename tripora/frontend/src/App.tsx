import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { DashboardPage } from './pages/DashboardPage';
import { TripStudioPage } from './pages/TripStudioPage';
import { MyJourneysPage } from './pages/MyJourneysPage';
import { ItineraryWorkspacePage } from './pages/ItineraryWorkspacePage';
import { BudgetStudioPage } from './pages/BudgetStudioPage';
import { AssistantPage } from './pages/AssistantPage';
import { ProfilePage } from './pages/ProfilePage';

// Scroll to top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-warm selection:bg-coral/20 selection:text-coral-800">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/studio" element={<TripStudioPage />} />
            <Route path="/trips" element={<MyJourneysPage />} />
            <Route path="/itinerary/:id" element={<ItineraryWorkspacePage />} />
            <Route path="/budget/:id" element={<BudgetStudioPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;

