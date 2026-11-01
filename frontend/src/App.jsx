import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import EcoChatWidget from './components/EcoChatWidget';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import PlasticPollution from './pages/PlasticPollution';
import Alternatives from './pages/Alternatives';
import AwarenessTips from './pages/AwarenessTips';
import EducationCenter from './pages/EducationCenter';
import Campaigns from './pages/Campaigns';
import CleanupEvents from './pages/CleanupEvents';
import WasteReports from './pages/WasteReports';
import PledgePage from './pages/PledgePage';
import EcoTracker from './pages/EcoTracker';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CommunityHub from './pages/CommunityHub';
import EcoAssistantPage from './pages/EcoAssistantPage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#f7faf8] text-slate-800 relative">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/plastic-pollution" element={<PlasticPollution />} />
                <Route path="/education" element={<EducationCenter />} />
                <Route path="/alternatives" element={<Alternatives />} />
                <Route path="/awareness-tips" element={<AwarenessTips />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/cleanup-events" element={<CleanupEvents />} />
                <Route path="/waste-reports" element={<WasteReports />} />
                <Route path="/pledge" element={<PledgePage />} />
                <Route path="/community" element={<CommunityHub />} />
                <Route path="/eco-assistant" element={<EcoAssistantPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected User Pages */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user-dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/eco-tracker"
                  element={
                    <ProtectedRoute>
                      <EcoTracker />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Pages */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />

            {/* Persistent Floating Eco AI Assistant Widget */}
            <EcoChatWidget />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
