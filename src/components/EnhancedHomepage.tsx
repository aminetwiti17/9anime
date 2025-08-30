import React, { useState } from 'react';
import { Search, Play, Calendar, Star, Eye, Clock, ChevronRight, TrendingUp, Fire } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTrendingAnime, usePopularAnime, useLatestEpisodes, useGenres, useUpcomingAnime } from '../hooks/useAnime';
import { Sidebar } from './Sidebar';
import { AnimeGrid } from './AnimeGrid';
import { GenreNavigation } from './GenreNavigation';

export const EnhancedHomepage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const [gridDensity, setGridDensity] = useState<'default' | 'compact' | 'dense'>('default');

  const { anime: trendingAnime, loading: trendingLoading } = useTrendingAnime(20);
  const { anime: popularAnime, loading: popularLoading } = usePopularAnime(30);
  const { episodes: latestEpisodes, loading: episodesLoading } = useLatestEpisodes(30);
  const { genres } = useGenres();
  const { anime: upcomingAnime, loading: upcomingLoading } = useUpcomingAnime(8);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Hero Banner - Clevatess */}
          <div className="relative rounded-xl overflow-hidden">
            <div 
              className="h-48 sm:h-56 md:h-64 lg:h-72 bg-cover bg-center relative"
              style={{
                backgroundImage: 'url(https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=1200)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 max-w-xs sm:max-w-md">
                <h1 className="text-white text-xl sm:text-2xl font-bold mb-2">Clevatess</h1>
                <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                  Rick, who has dreamed of becoming a hero since childhood, is chosen by the king of the Orvinus 
                  Kingdom to become a legendary sword. He travels with...
                </p>
                <Link 
                  to="/anime/1"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 sm:px-6 rounded-lg flex items-center space-x-2 transition-all duration-300 inline-flex text-sm sm:text-base hover:shadow-lg hover:shadow-primary-500/25"
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Watch Now</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation par Genres */}
          <GenreNavigation />

          {/* Popular Today avec grille optimisée */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary-400" />
                  Popular Today
                </h2>
                
                {/* Contrôles de densité */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setGridDensity('dense')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      gridDensity === 'dense'
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    Dense
                  </button>
                  <button
                    onClick={() => setGridDensity('compact')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      gridDensity === 'compact'
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    Compact
                  </button>
                  <button
                    onClick={() => setGridDensity('default')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      gridDensity === 'default'
                        ? 'bg-primary-600 text-white shadow-lg shadow-lg shadow-primary-500/25'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    Normal
                  </button>
                </div>
              </div>
              
              <Link 
                to="/search"
                className="text-primary-400 hover:text-primary-300 text-xs sm:text-sm flex items-center gap-1 transition-colors"
              >
                Voir tout
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
            
            <AnimeGrid
              animes={popularAnime}
              loading={popularLoading}
              variant={gridDensity}
              showViewAll={true}
              viewAllLink="/search"
            />
          </section>

          {/* Latest Release avec badges améliorés */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-400" />
                Latest Release
              </h2>
              <Link 
                to="/search"
                className="text-primary-400 hover:text-primary-300 text-xs sm:text-sm flex items-center gap-1 transition-colors"
              >
                Voir tout
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
            
            <AnimeGrid
              animes={latestEpisodes.map(episode => ({
                ...episode,
                title: `${episode.title} - Episode ${episode.episodeNumber}`,
                season: 'Spring 2025'
              }))}
              loading={episodesLoading}
              variant="compact"
              showViewAll={true}
              viewAllLink="/latest"
            />
          </section>

          {/* Upcoming Anime */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Upcoming Anime
              </h2>
              <Link 
                to="/upcoming"
                className="text-primary-400 hover:text-primary-300 text-xs sm:text-sm flex items-center gap-1 transition-colors"
              >
                Voir tout
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
            
            <AnimeGrid
              animes={upcomingAnime}
              loading={upcomingLoading}
              variant="compact"
              showViewAll={true}
              viewAllLink="/upcoming"
            />
          </section>

          {/* Top Anime avec onglets */}
          <section className="bg-dark-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Fire className="w-5 h-5 text-orange-400" />
                Top Anime
              </h2>
              <div className="flex space-x-1 sm:space-x-2">
                {(['weekly', 'monthly', 'all'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-3 py-2 rounded-lg text-xs sm:text-sm transition-all duration-200 ${
                      selectedTab === tab
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                        : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {trendingAnime.slice(0, 10).map((anime, index) => (
                <Link 
                  key={anime.id} 
                  to={`/anime/${anime.id}`}
                  className="flex items-center space-x-3 hover:bg-dark-700 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="text-primary-400 font-bold text-sm w-6 flex-shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <img
                    src={anime.poster_url || 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=50'}
                    alt={anime.title}
                    className="w-8 h-10 sm:w-10 sm:h-12 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium line-clamp-2">{anime.title}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-gray-400 text-xs bg-dark-600 px-2 py-1 rounded-full">
                        {anime.anime_type}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-gray-400 text-xs">{anime.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
        
        {/* Sidebar */}
        <Sidebar />
      </div>

      {/* Footer A-Z List */}
      <div className="border-t border-dark-700 p-4 sm:p-6">
        <div className="text-center">
          <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">A-Z LIST</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Searching anime by alphabet name A to Z.</p>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
              <button
                key={letter}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded text-xs sm:text-sm transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/25"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
