import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NineAnimeHomepage } from './components/NineAnimeHomepage';
import { NineAnimeDetails } from './pages/NineAnimeDetails';
import { EnhancedEpisodePage } from './components/EnhancedEpisodePage';
import { SearchResults } from './pages/SearchResults';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-[#1a1a1a] text-white">
              <Header />
              <main role="main" className="pt-16">
                <Routes>
                  <Route path="/" element={<NineAnimeHomepage />} />
                  <Route path="/anime/:slug" element={<NineAnimeDetails />} />
                  <Route path="/anime/:animeId/episode/:episodeNumber" element={<EnhancedEpisodePage />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;