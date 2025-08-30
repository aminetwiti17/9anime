import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Grid, List as ListIcon, SlidersHorizontal, X } from 'lucide-react';
import { AnimeCard } from '../components/AnimeCard';
import { NineAnimeSearch } from '../components/NineAnimeSearch';
import { Anime } from '../types/anime';

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'All');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || 'All');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'All');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [results, setResults] = useState<Anime[]>([]);
  const [genres] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    let filteredResults = results;

    if (query) {
      // filteredResults = searchAnime(query); // This line was removed as per the edit hint
    }

    if (selectedGenre !== 'All') {
      filteredResults = filteredResults.filter((anime: Anime) => 
        anime.genres.includes(selectedGenre)
      );
    }

    if (selectedYear !== 'All') {
      filteredResults = filteredResults.filter((anime: Anime) => 
        anime.release_year?.toString() === selectedYear
      );
    }

    if (selectedType !== 'All') {
      filteredResults = filteredResults.filter((anime: Anime) => 
        anime.anime_type === selectedType
      );
    }

    if (selectedStatus !== 'All') {
      filteredResults = filteredResults.filter(anime => 
        anime.status === selectedStatus
      );
    }

    // Sort results
    filteredResults.sort((a: Anime, b: Anime) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return (b.release_year || 0) - (a.release_year || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'episodes':
          return (b.total_episodes || 0) - (a.total_episodes || 0);
        default:
          return b.rating - a.rating;
      }
    });

    setResults(filteredResults);
  }, [query, selectedGenre, selectedYear, selectedType, selectedStatus, sortBy]);

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedGenre !== 'All') params.set('genre', selectedGenre);
    if (selectedYear !== 'All') params.set('year', selectedYear);
    if (selectedType !== 'All') params.set('type', selectedType);
    if (selectedStatus !== 'All') params.set('status', selectedStatus);
    setSearchParams(params);
  };

  useEffect(() => {
    updateSearchParams();
  }, [selectedGenre, selectedYear, selectedType, selectedStatus]);

  const clearFilters = () => {
    setSelectedGenre('All');
    setSelectedYear('All');
    setSelectedType('All');
    setSelectedStatus('All');
    setSortBy('relevance');
  };

  const hasActiveFilters = selectedGenre !== 'All' || selectedYear !== 'All' || 
                          selectedType !== 'All' || selectedStatus !== 'All';

  const years: number[] = Array.from({ length: 25 }, (_, i) => 2024 - i);

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header - 9anime Style */}
        <div className="bg-dark-900 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">
              {query ? `Search Results for "${query}"` : 'Browse Anime'}
            </h1>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>New Search</span>
            </button>
          </div>
          
          {/* Current Search Info */}
          {query && (
            <div className="bg-dark-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">Searching for:</span>
                  <span className="text-white font-medium">"{query}"</span>
                  {hasActiveFilters && (
                    <span className="text-primary-400 text-sm">with filters applied</span>
                  )}
                </div>
                <span className="text-gray-400">{results.length} results</span>
              </div>
            </div>
          )}

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters ? 'bg-primary-600 text-white' : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {[selectedGenre, selectedYear, selectedType, selectedStatus].filter(f => f !== 'All').length}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}

            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-gray-400 text-sm">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-gray-400 hover:text-white'
                }`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-dark-800 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="All">All Genres</option>
                    {genres.map((genre: string) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="All">All Years</option>
                    {years.map((year: number) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="All">All Types</option>
                    <option value="TV">TV Series</option>
                    <option value="Movie">Movies</option>
                    <option value="OVA">OVA</option>
                    <option value="Special">Specials</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="All">All Status</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="title">Title A-Z</option>
                    <option value="year">Year (Newest)</option>
                    <option value="rating">Rating (Highest)</option>
                    <option value="episodes">Episodes (Most)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {results.filter(anime => anime && anime.poster_url).map((anime: Anime) => (
              <AnimeCard key={anime.id} anime={{
                ...anime,
                poster: anime.poster_url || '',
                year: anime.release_year?.toString() || '',
                totalEpisodes: anime.total_episodes?.toString() || '',
                type: anime.anime_type,
                genres: anime.genres.map(g => typeof g === 'string' ? g : g.name),
                rating: anime.rating?.toString() || '',
                status: anime.status,
                description: anime.description || '',
                title: anime.title,
                id: anime.id,
                slug: anime.slug,
                poster_url: anime.poster_url
              }} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {results.filter(anime => anime && anime.poster_url).map((anime: Anime) => (
              <div key={anime.id} className="bg-dark-800 rounded-lg p-4 hover:bg-dark-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <img
                    src={anime?.poster_url || 'url_par_defaut.jpg'}
                    alt={anime?.title || 'Poster'}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">{anime.title}</h3>
                    <div className="flex items-center space-x-4 text-gray-400 text-sm mb-2">
                      <span>{anime.release_year}</span>
                      <span>•</span>
                      <span>{anime.rating} ⭐</span>
                      <span>•</span>
                      <span>{anime.total_episodes} episodes</span>
                      <span>•</span>
                      <span className="capitalize">{anime.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {anime.genres.slice(0, 4).map((genre: string | { name: string }) => (
                        <span key={typeof genre === 'string' ? genre : genre.name} className="bg-dark-700 text-primary-400 px-2 py-1 rounded text-xs">
                          {typeof genre === 'string' ? genre : genre.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2">{anime.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search terms or filters.</p>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Try New Search
            </button>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <NineAnimeSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};