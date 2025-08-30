import React, { useState } from 'react';
import { Search, Play, Calendar, Star, Eye, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTrendingAnime, usePopularAnime, useLatestEpisodes, useGenres, useUpcomingAnime } from '../hooks/useAnime';
import { Sidebar } from './Sidebar';

export const NineAnimeHomepage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const [quickFilters, setQuickFilters] = useState({
    genre: 'All',
    season: 'All',
    studio: 'All',
    type: 'All',
    orderBy: 'Default'
  });

  const { anime: trendingAnime, loading: trendingLoading } = useTrendingAnime(10);
  const { anime: popularAnime, loading: popularLoading } = usePopularAnime(20);
  const { episodes: latestEpisodes, loading: episodesLoading } = useLatestEpisodes(20);
  const { genres } = useGenres();
  const { anime: upcomingAnime, loading: upcomingLoading } = useUpcomingAnime(4);

  const handleQuickFilterChange = (filterType: string, value: string) => {
    setQuickFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Hero Banner - Clevatess */}
          <div className="relative mb-6 sm:mb-8 rounded-lg overflow-hidden">
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
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 sm:px-6 rounded-lg flex items-center space-x-2 transition-colors inline-flex text-sm sm:text-base"
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Watch Now</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Popular Today */}
          <section className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">Popular Today</h2>
              <Link 
                to="/search"
                className="text-[#7c3aed] hover:text-[#6d28d9] text-xs sm:text-sm flex items-center"
              >
                View all
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </Link>
            </div>
            
            {popularLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-[#2a2a2a] rounded-lg h-48 sm:h-56 md:h-64 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {popularAnime.slice(0, 10).map((anime, index) => (
                  <Link 
                    key={anime._id || anime.id} 
                    to={`/anime/${anime.slug || anime._id || anime.id}`}
                    className="relative group cursor-pointer touch-manipulation"
                  >
                    <div className="relative">
                      <img
                        src={anime.poster_url || 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=300'}
                        alt={anime.title}
                        className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg"
                      />
                      <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-[#f97316] text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-bold">
                        SUB
                      </div>
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-black/70 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs">
                        {anime.anime_type}
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Play className="w-6 w-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-white text-xs sm:text-sm font-medium mt-2 line-clamp-2">{anime.title}</h3>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Latest Release */}
          <section className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">Latest Release</h2>
              <Link 
                to="/search"
                className="text-[#7c3aed] hover:text-[#6d28d9] text-xs sm:text-sm flex items-center"
              >
                View all
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </Link>
            </div>
            
            {episodesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-[#2a2a2a] rounded-lg h-24 sm:h-28 md:h-32 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {latestEpisodes
                  .filter(episode => episode && episode.anime_id)
                  .slice(0, 8)
                  .map((episode) => (
                    <Link 
                      key={episode.id} 
                      to={episode.anime_id ? `/anime/${episode.anime_id}` : '#'}
                      className="bg-[#2a2a2a] rounded-lg p-3 sm:p-4 hover:bg-[#333] transition-colors cursor-pointer touch-manipulation"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={episode?.anime?.poster_url || 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=100'}
                          alt={episode?.anime?.title || 'Titre inconnu'}
                          className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="text-white text-xs sm:text-sm font-medium line-clamp-2 mb-1">
                            {episode?.anime?.title || 'Titre inconnu'}
                          </h3>
                          <p className="text-gray-400 text-xs mb-1">
                            Episode {episode.episode_number}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="bg-[#f97316] text-white px-1.5 py-0.5 rounded text-xs">
                              {episode.subtitle_type}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {episode.air_date ? new Date(episode.air_date).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                }
              </div>
            )}
          </section>

          {/* Top Upcoming */}
          <section className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Top Upcoming</h2>
            {upcomingLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-[#2a2a2a] rounded-lg h-24 sm:h-28 md:h-32 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {upcomingAnime.slice(0, 4).map((anime) => (
                  <Link 
                    key={anime._id || anime.id} 
                    to={`/anime/${anime.slug || anime._id || anime.id}`}
                    className="bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#333] transition-colors cursor-pointer touch-manipulation"
                  >
                    <img
                      src={anime.poster_url || 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=300'}
                      alt={anime.title}
                      className="w-full h-24 sm:h-28 md:h-32 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="text-white text-xs sm:text-sm font-medium line-clamp-2 mb-1">{anime.title}</h3>
                      <p className="text-gray-400 text-xs">
                        {anime.anime_type} • {anime.start_date ? new Date(anime.start_date).toLocaleDateString() : 'TBA'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Recommendation */}
          <section className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Recommendation</h2>
            
            {/* Genre Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
              {['Comedy', 'Gourmet', 'Isekai (Maid)', 'Musical', 'Suspense'].map((tag) => (
                <button
                  key={tag}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-2.5 py-1 sm:px-3 rounded-full text-xs sm:text-sm transition-colors touch-manipulation"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {trendingAnime.slice(0, 5).map((anime) => (
                <Link 
                  key={anime._id || anime.id} 
                  to={`/anime/${anime.slug || anime._id || anime.id}`}
                  className="relative group cursor-pointer touch-manipulation"
                >
                  <div className="relative">
                    <img
                      src={anime.poster_url || 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=300'}
                      alt={anime.title}
                      className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg"
                    />
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-[#f97316] text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-bold">
                      SUB
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Play className="w-6 w-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-white text-xs sm:text-sm font-medium mt-2 line-clamp-2">{anime.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-gray-800 order-first lg:order-last">
          {/* Quick Filter */}
          <div className="bg-[#2a2a2a] rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Quick filter</h3>
            
            <div className="space-y-3">
              <div>
                <select 
                  value={quickFilters.genre}
                  onChange={(e) => handleQuickFilterChange('genre', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-2 py-2 sm:px-3 text-white text-xs sm:text-sm"
                >
                  <option value="All">Genre All</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.name}>{genre.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select 
                  value={quickFilters.season}
                  onChange={(e) => handleQuickFilterChange('season', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-2 py-2 sm:px-3 text-white text-xs sm:text-sm"
                >
                  <option value="All">Season All</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              
              <div>
                <select 
                  value={quickFilters.studio}
                  onChange={(e) => handleQuickFilterChange('studio', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-2 py-2 sm:px-3 text-white text-xs sm:text-sm"
                >
                  <option value="All">Studio All</option>
                  <option value="Mappa">Mappa</option>
                  <option value="Toei Animation">Toei Animation</option>
                  <option value="Pierrot">Pierrot</option>
                </select>
              </div>
              
              <div>
                <select 
                  value={quickFilters.type}
                  onChange={(e) => handleQuickFilterChange('type', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-2 py-2 sm:px-3 text-white text-xs sm:text-sm"
                >
                  <option value="All">Type All</option>
                  <option value="TV">TV</option>
                  <option value="Movie">Movie</option>
                  <option value="OVA">OVA</option>
                </select>
              </div>
              
              <div>
                <select 
                  value={quickFilters.orderBy}
                  onChange={(e) => handleQuickFilterChange('orderBy', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-2 py-2 sm:px-3 text-white text-xs sm:text-sm"
                >
                  <option value="Default">Order by Default</option>
                  <option value="Rating">Rating</option>
                  <option value="Views">Views</option>
                  <option value="Latest">Latest</option>
                </select>
              </div>
            </div>
            
            <button className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white py-2 rounded-lg mt-3 sm:mt-4 flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base touch-manipulation">
              <Search className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Spring Season 2025 */}
          <div className="bg-[#2a2a2a] rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="text-white font-bold mb-3 text-sm sm:text-base">Spring Season 2025</h3>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Spring Season 2025"
                className="w-full h-24 sm:h-28 md:h-32 object-cover rounded"
              />
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-[#f97316] text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-bold">
                SUMMER 2025
              </div>
            </div>
          </div>

          {/* Top Anime */}
          <div className="bg-[#2a2a2a] rounded-lg p-3 sm:p-4">
            <div className="flex items-center space-x-4 mb-4">
              <h3 className="text-white font-bold text-sm sm:text-base">Top Anime</h3>
              <div className="flex space-x-1 sm:space-x-2">
                {(['weekly', 'monthly', 'all'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-2 py-1 sm:px-3 rounded text-xs transition-colors touch-manipulation ${
                      selectedTab === tab
                        ? 'bg-[#7c3aed] text-white'
                        : 'text-gray-400 hover:text-white'
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
                  className="flex items-center space-x-2 sm:space-x-3 hover:bg-[#333] p-2 rounded cursor-pointer transition-colors touch-manipulation"
                >
                  <div className="text-[#7c3aed] font-bold text-xs sm:text-sm w-5 sm:w-6 flex-shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <img
                    src={anime.poster_url || 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=50'}
                    alt={anime.title}
                    className="w-6 h-8 sm:w-8 sm:h-10 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-xs font-medium line-clamp-2">{anime.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-gray-400 text-xs">{anime.anime_type}</span>
                      <span className="text-gray-400 text-xs">•</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400" />
                        <span className="text-gray-400 text-xs">{anime.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer A-Z List */}
      <div className="border-t border-gray-800 p-4 sm:p-6">
        <div className="text-center">
          <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">A-Z LIST</h3>
          <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">Searching anime by alphabet name A to Z.</p>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
              <button
                key={letter}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded text-xs sm:text-sm transition-colors touch-manipulation"
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