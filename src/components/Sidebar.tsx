import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Star, Eye, Calendar, Filter } from 'lucide-react';

interface Anime {
  id: string;
  title: string;
  image: string;
  rating: number;
  type: string;
  episodes: number;
  views: number;
}

interface Genre {
  id: string;
  name: string;
  count: number;
}

export const Sidebar: React.FC = () => {
  // Données mockées - à remplacer par vos vraies données
  const topAnimes: Anime[] = [
    { id: '1', title: 'One Piece', image: '/images/one-piece.jpg', rating: 9.2, type: 'TV', episodes: 1000, views: 1500000 },
    { id: '2', title: 'Demon Slayer', image: '/images/demon-slayer.jpg', rating: 8.9, type: 'TV', episodes: 26, views: 1200000 },
    { id: '3', title: 'Attack on Titan', image: '/images/attack-on-titan.jpg', rating: 9.0, type: 'TV', episodes: 25, views: 1100000 },
    { id: '4', title: 'Jujutsu Kaisen', image: '/images/jujutsu-kaisen.jpg', rating: 8.8, type: 'TV', episodes: 24, views: 980000 },
    { id: '5', title: 'My Hero Academia', image: '/images/my-hero-academia.jpg', rating: 8.5, type: 'TV', episodes: 25, views: 850000 }
  ];

  const genres: Genre[] = [
    { id: 'action', name: 'Action', count: 156 },
    { id: 'adventure', name: 'Adventure', count: 89 },
    { id: 'comedy', name: 'Comedy', count: 234 },
    { id: 'drama', name: 'Drama', count: 167 },
    { id: 'fantasy', name: 'Fantasy', count: 123 },
    { id: 'horror', name: 'Horror', count: 45 },
    { id: 'romance', name: 'Romance', count: 189 },
    { id: 'sci-fi', name: 'Sci-Fi', count: 78 },
    { id: 'slice-of-life', name: 'Slice of Life', count: 92 },
    { id: 'sports', name: 'Sports', count: 34 }
  ];

  return (
    <aside className="w-full lg:w-80 xl:w-96 bg-dark-800 border-l border-dark-700 p-4 lg:p-6 space-y-6">
      {/* Top Anime Section */}
      <div className="bg-dark-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-bold text-white">🔥 Top Anime</h3>
        </div>
        <div className="space-y-3">
          {topAnimes.map((anime, index) => (
            <div key={anime.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-600 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                #{index + 1}
              </div>
              <img 
                src={anime.image} 
                alt={anime.title}
                className="w-12 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=300';
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{anime.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>{anime.rating}</span>
                  <span>•</span>
                  <span>{anime.type}</span>
                  <span>•</span>
                  <Eye className="w-3 h-3" />
                  <span>{anime.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Genres Section */}
      <div className="bg-dark-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-bold text-white">🏷️ Genres</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {genres.map(genre => (
            <Link 
              key={genre.id} 
              to={`/genre/${genre.id}`}
              className="flex items-center justify-between p-2 rounded-lg bg-dark-600 hover:bg-dark-500 transition-colors group"
            >
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{genre.name}</span>
              <span className="text-xs text-gray-500 bg-dark-700 px-2 py-1 rounded-full">{genre.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-dark-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-bold text-white">📊 Statistiques</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-dark-600 rounded-lg">
            <div className="text-2xl font-bold text-primary-400">1,234</div>
            <div className="text-xs text-gray-400">Animes</div>
          </div>
          <div className="text-center p-3 bg-dark-600 rounded-lg">
            <div className="text-2xl font-bold text-primary-400">5,678</div>
            <div className="text-xs text-gray-400">Épisodes</div>
          </div>
          <div className="text-center p-3 bg-dark-600 rounded-lg">
            <div className="text-2xl font-bold text-primary-400">89</div>
            <div className="text-xs text-gray-400">Genres</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-700 rounded-xl p-4">
        <h3 className="text-lg font-bold text-white mb-4">⚡ Actions Rapides</h3>
        <div className="space-y-2">
          <Link 
            to="/schedule" 
            className="flex items-center gap-3 p-3 bg-dark-600 hover:bg-dark-500 rounded-lg transition-colors group"
          >
            <Calendar className="w-5 h-5 text-primary-400" />
            <span className="text-gray-300 group-hover:text-white transition-colors">Programme de la semaine</span>
          </Link>
          <Link 
            to="/latest" 
            className="flex items-center gap-3 p-3 bg-dark-600 hover:bg-dark-500 rounded-lg transition-colors group"
          >
            <Eye className="w-5 h-5 text-primary-400" />
            <span className="text-gray-300 group-hover:text-white transition-colors">Derniers épisodes</span>
          </Link>
          <Link 
            to="/upcoming" 
            className="flex items-center gap-3 p-3 bg-dark-600 hover:bg-dark-500 rounded-lg transition-colors group"
          >
            <Star className="w-5 h-5 text-primary-400" />
            <span className="text-gray-300 group-hover:text-white transition-colors">Animes à venir</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
