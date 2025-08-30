import React, { useState } from 'react';
import { useSearch } from '../hooks/useSearch';

export const SlugSearchTest: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'text' | 'slug' | 'partial'>('text');
  
  const {
    searchResults,
    suggestions,
    loading,
    error,
    totalResults,
    searchByText,
    searchBySlug,
    searchByPartialSlug,
    getSuggestions,
    getSlugSuggestions
  } = useSearch();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    switch (searchType) {
      case 'text':
        await searchByText(searchQuery);
        break;
      case 'slug':
        await searchBySlug(searchQuery);
        break;
      case 'partial':
        await searchByPartialSlug(searchQuery);
        break;
    }
  };

  const handleGetSuggestions = async () => {
    if (searchType === 'slug') {
      await getSlugSuggestions(searchQuery);
    } else {
      await getSuggestions(searchQuery, searchType === 'text' ? 'title' : 'all');
    }
  };

  return (
    <div className="p-6 bg-dark-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Test de Recherche par Slug</h2>
      
      <div className="space-y-4">
        {/* Contrôles de recherche */}
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Entrez un titre ou un slug..."
            className="flex-1 px-4 py-2 bg-dark-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
          />
          
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="px-4 py-2 bg-dark-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
          >
            <option value="text">Recherche par texte</option>
            <option value="slug">Recherche par slug</option>
            <option value="partial">Recherche partielle par slug</option>
          </select>
          
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
          
          <button
            onClick={handleGetSuggestions}
            className="px-6 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg"
          >
            Suggestions
          </button>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-dark-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Suggestions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-dark-800 p-3 rounded-lg">
                  <div className="font-medium text-white">{suggestion.title}</div>
                  <div className="text-sm text-gray-400">Slug: {suggestion.slug}</div>
                  {suggestion.rating && (
                    <div className="text-sm text-yellow-400">⭐ {suggestion.rating}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Résultats de recherche */}
        {searchResults.length > 0 && (
          <div className="bg-dark-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Résultats ({totalResults} trouvé{totalResults > 1 ? 's' : ''})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((anime) => (
                <div key={anime._id || anime.id} className="bg-dark-800 p-4 rounded-lg">
                  {anime.poster_url && (
                    <img
                      src={anime.poster_url}
                      alt={anime.title}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}
                  <div className="font-bold text-white text-lg mb-2">{anime.title}</div>
                  <div className="text-sm text-gray-400 mb-2">Slug: {anime.slug}</div>
                  <div className="text-sm text-gray-400 mb-2">Type: {anime.anime_type}</div>
                  <div className="text-sm text-gray-400 mb-2">Statut: {anime.status}</div>
                  {anime.rating && (
                    <div className="text-sm text-yellow-400">⭐ {anime.rating}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* État de chargement */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Recherche en cours...</p>
          </div>
        )}
      </div>
    </div>
  );
};
