import React from 'react';
import { AnimeCard } from './AnimeCard';

interface Anime {
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
}

interface AnimeGridProps {
  animes: Anime[];
  loading?: boolean;
  variant?: 'default' | 'compact' | 'dense';
  title?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  className?: string;
}

export const AnimeGrid: React.FC<AnimeGridProps> = ({
  animes,
  loading = false,
  variant = 'default',
  title,
  showViewAll = false,
  viewAllLink,
  className = ''
}) => {
  const getGridClasses = () => {
    switch (variant) {
      case 'dense':
        return 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-3';
      case 'compact':
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4';
      default:
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4';
    }
  };

  const getSkeletonCount = () => {
    switch (variant) {
      case 'dense':
        return 20;
      case 'compact':
        return 12;
      default:
        return 10;
    }
  };

  if (loading) {
    return (
      <div className={className}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
          </div>
        )}
        <div className={getGridClasses()}>
          {[...Array(getSkeletonCount())].map((_, i) => (
            <div key={i} className="bg-dark-700 rounded-lg animate-pulse">
              <div className="w-full h-40 sm:h-48 md:h-56 bg-dark-600 rounded-t-lg" />
              <div className="p-3 sm:p-4 space-y-2">
                <div className="h-4 bg-dark-600 rounded" />
                <div className="h-3 bg-dark-600 rounded w-2/3" />
                <div className="h-3 bg-dark-600 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
          {showViewAll && viewAllLink && (
            <a 
              href={viewAllLink}
              className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors"
            >
              Voir tout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      )}
      
      <div className={getGridClasses()}>
        {animes.map((anime) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            variant={variant === 'dense' ? 'compact' : variant}
            className="transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/20"
          />
        ))}
      </div>
      
      {animes.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">Aucun anime trouvé</div>
          <div className="text-gray-500 text-sm">Essayez de modifier vos critères de recherche</div>
        </div>
      )}
    </div>
  );
};
