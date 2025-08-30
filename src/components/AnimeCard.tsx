import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, Star, Plus, Check } from 'lucide-react';
import { LazyImage } from './LazyImage';
import { useAuth } from '../contexts/AuthContext';

interface AnimeCardProps {
  anime: {
    id: string;
    title: string;
    poster: string;
    year: string;
    rating: string;
    totalEpisodes: string;
    genres: string[];
    type: string;
    status: string;
    description: string;
    slug?: string;
    poster_url?: string;
    season?: string;
  };
  showPlayButton?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ 
  anime, 
  showPlayButton = true, 
  className = '',
  variant = 'default'
}) => {
  const { user, isAuthenticated, addToWatchlist, removeFromWatchlist } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const isInWatchlist = user?.watchlist?.some((id: string) => id === anime.id) || false;

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(anime.id);
      } else {
        await addToWatchlist(anime.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const cardClasses = {
    default: 'group relative bg-dark-800 rounded-lg overflow-hidden hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/20 touch-manipulation',
    compact: 'group relative bg-dark-800 rounded-lg overflow-hidden hover:scale-[1.01] sm:hover:scale-102 transition-all duration-200 touch-manipulation',
    featured: 'group relative bg-dark-800 rounded-xl overflow-hidden hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/30 touch-manipulation'
  };

  const imageClasses = {
    default: 'w-full h-48 sm:h-56 md:h-64 object-cover',
    compact: 'w-full h-40 sm:h-44 md:h-48 object-cover',
    featured: 'w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover'
  };

  return (
    <div 
      className={`${cardClasses[variant]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <LazyImage
          src={anime.poster}
          alt={anime.title}
          className={imageClasses[variant]}
          aspectRatio="3/4"
        />
        
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Action buttons */}
          <div className="absolute inset-0 flex items-center justify-center">
            {showPlayButton && (
              <Link
                to={`/anime/${anime.id}`}
                className={`bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 sm:p-3 transform transition-all duration-300 touch-manipulation ${
                  isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                }`}
                aria-label={`Watch ${anime.title}`}
              >
                <Play className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              </Link>
            )}
          </div>

          {/* Watchlist button */}
          {isAuthenticated && (
            <button
              onClick={handleWatchlistToggle}
              className={`absolute top-2 right-2 sm:top-3 sm:right-3 bg-dark-900/80 hover:bg-dark-800 text-white rounded-full p-1.5 sm:p-2 transition-all duration-300 touch-manipulation ${
                isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
              }`}
              aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                isInWatchlist ? (
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                ) : (
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                )
              )}
            </button>
          )}
        </div>
        
        {/* Enhanced badges system */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {/* Type badge with enhanced styling */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
            {anime.type}
          </div>
          
          {/* Season badge if available */}
          {anime.season && (
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
              {anime.season}
            </div>
          )}
        </div>

        {/* Status and quality badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {/* Status badge with enhanced styling */}
          <div className={`px-2 py-1 rounded-lg text-xs font-bold shadow-lg ${
            anime.status === 'ongoing' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
            anime.status === 'completed' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
            'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
          }`}>
            {anime.status === 'ongoing' ? '🟢 En cours' : 
             anime.status === 'completed' ? '🔵 Terminé' : '🟡 À venir'}
          </div>
          
          {/* Audio quality badges */}
          <div className="flex gap-1">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
              SUB
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
              DUB
            </div>
          </div>
        </div>

        {/* Rating badge overlay */}
        <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold">
          ⭐ {anime.rating}
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <Link to={`/anime/${anime.slug || anime.id}`}>
          <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg mb-2 hover:text-primary-400 transition-colors line-clamp-2 leading-tight">
            {anime.title}
          </h3>
        </Link>
        
        <div className="space-y-2 mb-3">
          {/* Primary meta row */}
          <div className="flex items-center text-gray-400 text-xs sm:text-sm">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
            <span>{anime.year || 'N/A'}</span>
            <span className="mx-2">•</span>
            <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-400 flex-shrink-0" />
            <span>{anime.rating || 'N/A'}</span>
            <span className="mx-2">•</span>
            <span className="truncate">{anime.totalEpisodes || 0} eps</span>
          </div>
          
          {/* Additional info row */}
          <div className="flex items-center text-gray-500 text-xs">
            <span className="bg-dark-600 px-2 py-1 rounded-full mr-2">
              {anime.type} • {anime.status}
            </span>
            {anime.season && (
              <span className="bg-dark-600 px-2 py-1 rounded-full">
                {anime.season}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {anime.genres && anime.genres.length > 0 ? (
            <>
              {anime.genres.slice(0, 3).map((genre) => (
                <span key={genre} className="bg-dark-700 text-primary-400 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs">
                  {genre}
                </span>
              ))}
              {anime.genres.length > 3 && (
                <span className="bg-dark-700 text-gray-400 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs">
                  +{anime.genres.length - 3}
                </span>
              )}
            </>
          ) : (
            <span className="bg-dark-700 text-gray-400 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs">
              Aucun genre
            </span>
          )}
        </div>
        
        {variant === 'default' && (
          <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {anime.description}
          </p>
        )}
      </div>
    </div>
  );
};