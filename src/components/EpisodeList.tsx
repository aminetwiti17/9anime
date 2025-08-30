import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, Lock, Check, Eye, Calendar, Clock, Star } from 'lucide-react';

interface Episode {
  id: string;
  number: number;
  title: string;
  thumbnail?: string;
  airDate?: string;
  duration?: string;
  rating?: number;
  isWatched?: boolean;
  isLocked?: boolean;
  description?: string;
}

interface EpisodeListProps {
  episodes: Episode[];
  animeId: string;
  currentEpisode?: number;
  className?: string;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  animeId,
  currentEpisode,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'number' | 'date' | 'rating'>('number');
  const [filterWatched, setFilterWatched] = useState<'all' | 'watched' | 'unwatched'>('all');

  // Tri et filtrage des épisodes
  const sortedAndFilteredEpisodes = episodes
    .filter(episode => {
      if (filterWatched === 'watched') return episode.isWatched;
      if (filterWatched === 'unwatched') return !episode.isWatched;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          if (!a.airDate || !b.airDate) return 0;
          return new Date(b.airDate).getTime() - new Date(a.airDate).getTime();
        case 'rating':
          if (!a.rating || !b.rating) return 0;
          return b.rating - a.rating;
        default:
          return a.number - b.number;
      }
    });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getEpisodeStatus = (episode: Episode) => {
    if (episode.isLocked) return 'locked';
    if (episode.isWatched) return 'watched';
    if (episode.number === currentEpisode) return 'current';
    return 'available';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'watched': return 'text-green-400 bg-green-400/10';
      case 'current': return 'text-primary-400 bg-primary-400/10';
      case 'locked': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-blue-400 bg-blue-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'watched': return <Check className="h-4 w-4" />;
      case 'current': return <Eye className="h-4 w-4" />;
      case 'locked': return <Lock className="h-4 w-4" />;
      default: return <Play className="h-4 w-4" />;
    }
  };

  if (viewMode === 'grid') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Contrôles */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-800 rounded-xl p-4">
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">Vue:</span>
            <div className="flex space-x-1">
              {[
                { value: 'all', label: 'Tous' },
                { value: 'watched', label: 'Regardés' },
                { value: 'unwatched', label: 'Non regardés' }
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterWatched(filter.value as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filterWatched === filter.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-dark-700 text-white px-3 py-1 rounded-lg text-sm border border-dark-600 focus:border-primary-500 focus:outline-none"
            >
              <option value="number">Numéro</option>
              <option value="date">Date</option>
              <option value="rating">Note</option>
            </select>

            <div className="flex space-x-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Grille d'épisodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedAndFilteredEpisodes.map(episode => {
            const status = getEpisodeStatus(episode);
            const isCurrent = episode.number === currentEpisode;
            
            return (
              <div
                key={episode.id}
                className={`bg-dark-800 rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 ${
                  isCurrent ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/25' : 'hover:shadow-lg'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={episode.thumbnail || 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=300'}
                    alt={episode.title}
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Overlay avec statut */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      <span>Ep {episode.number}</span>
                    </span>
                  </div>
                  
                  {/* Bouton play */}
                  {!episode.isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Link
                        to={`/anime/${animeId}/episode/${episode.number}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                      >
                        <Play className="h-6 w-6" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                    {episode.title}
                  </h3>
                  
                  <div className="space-y-2 text-xs text-gray-400">
                    {episode.airDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(episode.airDate)}</span>
                      </div>
                    )}
                    
                    {episode.duration && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{episode.duration}</span>
                      </div>
                    )}
                    
                    {episode.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span>{episode.rating}/10</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistiques */}
        <div className="bg-dark-800 rounded-xl p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{episodes.length}</div>
              <div className="text-xs text-gray-400">Total Épisodes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {episodes.filter(e => e.isWatched).length}
              </div>
              <div className="text-xs text-gray-400">Regardés</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {episodes.filter(e => !e.isWatched && !e.isLocked).length}
              </div>
              <div className="text-xs text-gray-400">Disponibles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">
                {episodes.filter(e => e.isLocked).length}
              </div>
              <div className="text-xs text-gray-400">Verrouillés</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue liste
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Contrôles */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-800 rounded-xl p-4">
        <div className="flex items-center space-x-4">
          <span className="text-white font-medium">Vue:</span>
          <div className="flex space-x-1">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'watched', label: 'Regardés' },
              { value: 'unwatched', label: 'Non regardés' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterWatched(filter.value as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterWatched === filter.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-white font-medium">Trier par:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-dark-700 text-white px-3 py-1 rounded-lg text-sm border border-dark-600 focus:border-primary-500 focus:outline-none"
          >
            <option value="number">Numéro</option>
            <option value="date">Date</option>
            <option value="rating">Note</option>
          </select>

          <div className="flex space-x-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Liste d'épisodes */}
      <div className="space-y-2">
        {sortedAndFilteredEpisodes.map(episode => {
          const status = getEpisodeStatus(episode);
          const isCurrent = episode.number === currentEpisode;
          
          return (
            <div
              key={episode.id}
              className={`bg-dark-800 rounded-xl p-4 transition-all duration-200 hover:bg-dark-700 ${
                isCurrent ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/25' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <img
                    src={episode.thumbnail || 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=100'}
                    alt={episode.title}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  
                  {/* Statut overlay */}
                  <div className="absolute -top-1 -right-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                    </span>
                  </div>
                </div>

                {/* Informations */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-white font-semibold text-lg">
                      Episode {episode.number}
                    </h3>
                    {isCurrent && (
                      <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        En cours
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-gray-300 font-medium mb-2 line-clamp-2">
                    {episode.title}
                  </h4>
                  
                  {episode.description && (
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {episode.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400">
                    {episode.airDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(episode.airDate)}</span>
                      </div>
                    )}
                    
                    {episode.duration && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{episode.duration}</span>
                      </div>
                    )}
                    
                    {episode.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span>{episode.rating}/10</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  {!episode.isLocked ? (
                    <Link
                      to={`/anime/${animeId}/episode/${episode.number}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 hover:scale-105"
                    >
                      <Play className="h-4 w-4" />
                      <span>Regarder</span>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-600 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed flex items-center space-x-2"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Verrouillé</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
