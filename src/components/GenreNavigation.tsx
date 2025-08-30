import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronRight, TrendingUp, Star, Clock, Fire } from 'lucide-react';

interface Genre {
  id: string;
  name: string;
  count: number;
  icon?: string;
  color?: string;
}

export const GenreNavigation: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'popular' | 'recent' | 'trending'>('all');

  const genres: Genre[] = [
    { id: 'action', name: 'Action', count: 156, icon: '⚔️', color: 'from-red-500 to-red-600' },
    { id: 'adventure', name: 'Adventure', count: 89, icon: '🗺️', color: 'from-blue-500 to-blue-600' },
    { id: 'comedy', name: 'Comedy', count: 234, icon: '😄', color: 'from-yellow-500 to-yellow-600' },
    { id: 'drama', name: 'Drama', count: 167, icon: '🎭', color: 'from-purple-500 to-purple-600' },
    { id: 'fantasy', name: 'Fantasy', count: 123, icon: '🐉', color: 'from-indigo-500 to-indigo-600' },
    { id: 'horror', name: 'Horror', count: 45, icon: '👻', color: 'from-gray-500 to-gray-600' },
    { id: 'romance', name: 'Romance', count: 189, icon: '💕', color: 'from-pink-500 to-pink-600' },
    { id: 'sci-fi', name: 'Sci-Fi', count: 78, icon: '🚀', color: 'from-cyan-500 to-cyan-600' },
    { id: 'slice-of-life', name: 'Slice of Life', count: 92, icon: '🌸', color: 'from-green-500 to-green-600' },
    { id: 'sports', name: 'Sports', count: 34, icon: '⚽', color: 'from-orange-500 to-orange-600' },
    { id: 'mystery', name: 'Mystery', count: 67, icon: '🔍', color: 'from-teal-500 to-teal-600' },
    { id: 'thriller', name: 'Thriller', count: 43, icon: '😱', color: 'from-red-600 to-red-700' }
  ];

  const categories = [
    { id: 'all', name: 'Tous', icon: Filter, count: genres.length },
    { id: 'popular', name: 'Populaires', icon: TrendingUp, count: 89 },
    { id: 'recent', name: 'Récents', icon: Clock, count: 156 },
    { id: 'trending', name: 'Tendance', icon: Fire, count: 67 }
  ];

  const filteredGenres = genres.filter(genre => {
    switch (selectedCategory) {
      case 'popular':
        return genre.count > 100;
      case 'recent':
        return ['action', 'adventure', 'fantasy'].includes(genre.id);
      case 'trending':
        return ['comedy', 'romance', 'drama'].includes(genre.id);
      default:
        return true;
    }
  });

  return (
    <div className="bg-dark-800 rounded-xl p-4 mb-6">
      {/* Header avec catégories */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-bold text-white">🏷️ Navigation par Genres</h3>
        </div>
        
        {/* Filtres de catégories */}
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
              <span className="bg-dark-600 px-2 py-1 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grille de genres */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredGenres.map(genre => (
          <Link
            key={genre.id}
            to={`/genre/${genre.id}`}
            className="group relative overflow-hidden rounded-lg bg-dark-700 hover:bg-dark-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25"
          >
            {/* Background avec gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
            
            {/* Contenu */}
            <div className="relative p-4 text-center">
              <div className="text-3xl mb-2">{genre.icon}</div>
              <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-primary-400 transition-colors">
                {genre.name}
              </h4>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                <span>{genre.count}</span>
                <span>animes</span>
              </div>
            </div>

            {/* Indicateur de hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ChevronRight className="w-4 h-4 text-primary-400" />
            </div>
          </Link>
        ))}
      </div>

      {/* Statistiques rapides */}
      <div className="mt-6 pt-4 border-t border-dark-700">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-dark-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary-400">
              {genres.length}
            </div>
            <div className="text-xs text-gray-400">Genres</div>
          </div>
          <div className="bg-dark-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">
              {genres.reduce((sum, g) => sum + g.count, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Total Animes</div>
          </div>
          <div className="bg-dark-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">
              {Math.max(...genres.map(g => g.count))}
            </div>
            <div className="text-xs text-gray-400">Plus Populaire</div>
          </div>
          <div className="bg-dark-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(genres.reduce((sum, g) => sum + g.count, 0) / genres.length)}
            </div>
            <div className="text-xs text-gray-400">Moyenne</div>
          </div>
        </div>
      </div>
    </div>
  );
};
