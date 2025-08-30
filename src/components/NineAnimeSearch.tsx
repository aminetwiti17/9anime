import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Filter, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// SUPPRIMER : import { mockAnime, getAllGenres } from '../data/mockData';
import { LazyImage } from './LazyImage';

interface SearchSuggestion {
  id: string;
  title: string;
  poster: string;
  year: number;
  type: string;
  rating: number;
  genres: string[];
}

interface NineAnimeSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NineAnimeSearch: React.FC<NineAnimeSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState(['Attack on Titan', 'Demon Slayer', 'Jujutsu Kaisen', 'One Piece', 'Naruto']);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  // Remplacer toutes les utilisations de mockAnime et getAllGenres par des valeurs vides ou des appels à des services API réels
  // Par exemple :
  // const genres = getAllGenres(); => const genres = [];
  const genres = [];
  const years = Array.from({ length: 25 }, (_, i) => 2024 - i);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const results = [];
        setSuggestions(results);
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Add to recent searches
    const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    
    // Navigate to search results
    const params = new URLSearchParams();
    params.set('q', searchQuery);
    if (selectedGenre !== 'All') params.set('genre', selectedGenre);
    if (selectedYear !== 'All') params.set('year', selectedYear);
    if (selectedType !== 'All') params.set('type', selectedType);
    
    navigate(`/search?${params.toString()}`);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const handleSuggestionClick = (anime: SearchSuggestion) => {
    navigate(`/anime/${anime.id}`);
    onClose();
  };

  const handleTrendingClick = (searchTerm: string) => {
    setQuery(searchTerm);
    handleSearch(searchTerm);
  };

  const handleRecentClick = (searchTerm: string) => {
    setQuery(searchTerm);
    handleSearch(searchTerm);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-dark-900 rounded-lg w-full max-w-2xl mx-4 shadow-2xl border border-dark-700">
        {/* Search Header */}
        <div className="p-6 border-b border-dark-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search anime..."
              className="w-full bg-dark-800 border border-dark-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 text-lg"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {query && (
              <button
                onClick={() => handleSearch(query)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Search
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-dark-800 border border-dark-600 rounded px-3 py-2 text-white text-sm"
              >
                <option value="All">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-dark-800 border border-dark-600 rounded px-3 py-2 text-white text-sm"
              >
                <option value="All">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-dark-800 border border-dark-600 rounded px-3 py-2 text-white text-sm"
              >
                <option value="All">All Types</option>
                <option value="TV">TV Series</option>
                <option value="Movie">Movies</option>
                <option value="OVA">OVA</option>
                <option value="Special">Specials</option>
              </select>
            </div>
          )}
        </div>

        {/* Search Content */}
        <div className="max-h-96 overflow-y-auto">
          {query.length >= 2 ? (
            // Search Results
            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-white font-medium mb-3">Search Results</h3>
                  {suggestions.map(anime => (
                    <div
                      key={anime.id}
                      onClick={() => handleSuggestionClick(anime)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-800 cursor-pointer transition-colors"
                    >
                      <LazyImage
                        src={anime.poster}
                        alt={anime.title}
                        className="w-12 h-16 rounded object-cover flex-shrink-0"
                        aspectRatio="3/4"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{anime.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <span>{anime.year}</span>
                          <span>•</span>
                          <span>{anime.type}</span>
                          <span>•</span>
                          <span>{anime.rating} ⭐</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {anime.genres.slice(0, 2).map(genre => (
                            <span key={genre} className="bg-dark-700 text-primary-400 px-2 py-0.5 rounded text-xs">
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No results found for "{query}"</p>
                </div>
              )}
            </div>
          ) : (
            // Default Content
            <div className="p-4 space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Recent Searches
                  </h3>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentClick(search)}
                        className="block w-full text-left text-gray-300 hover:text-white hover:bg-dark-800 px-3 py-2 rounded transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending Searches
                </h3>
                <div className="space-y-1">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(search)}
                      className="block w-full text-left text-gray-300 hover:text-white hover:bg-dark-800 px-3 py-2 rounded transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Anime */}
              <div>
                <h3 className="text-white font-medium mb-3">Popular Anime</h3>
                <div className="space-y-2">
                  []
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Footer */}
        <div className="p-4 border-t border-dark-700 bg-dark-800/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Press Enter to search • ESC to close</span>
            <span>0+ anime available</span>
          </div>
        </div>
      </div>
    </div>
  );
};