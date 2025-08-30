import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Clock, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Anime } from '../types/anime';

export const Dashboard: React.FC = () => {
  const { user, removeFromWatchlist, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'watchlist' | 'history'>('watchlist');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        await refreshProfile();
      } catch (err) {
        setError('Erreur lors du chargement du profil utilisateur');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [refreshProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center text-white">Chargement du profil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Veuillez vous connecter</h1>
          <Link to="/login" className="text-primary-400 hover:text-primary-300">
            Aller à la connexion
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center text-red-400">{error}</div>
      </div>
    );
  }

  // Watchlist et historique dynamiques
  const watchlistAnime: Anime[] = (user.watchlist as any) || [];
  const historyAnime: Anime[] = (user.watch_history as any) || [];

  // Suppression asynchrone de la watchlist
  const handleRemoveFromWatchlist = async (animeId: string) => {
    setLoading(true);
    try {
      await removeFromWatchlist(animeId);
    } catch (err) {
      setError("Erreur lors de la suppression de l'anime de la watchlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenue, {user.username} !</h1>
          <p className="text-gray-400">Gérez votre collection d'anime et reprenez votre visionnage.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-700 mb-8">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'watchlist'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="inline h-4 w-4 mr-2" />
            Ma Watchlist ({watchlistAnime.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Clock className="inline h-4 w-4 mr-2" />
            Je peux faire la même adaptation pour :
Profile.tsx (affichage dynamique des infos utilisateur, gestion du chargement)
AnimeCard.tsx (ajout/suppression asynchrone de la watchlist, gestion du loading)
Header.tsx (affichage dynamique du menu utilisateur, gestion du logout)            Historique ({historyAnime.length})
          </button>
        </div>

        {/* Watchlist */}
        {activeTab === 'watchlist' && (
          <div>
            {watchlistAnime.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Votre watchlist est vide</h3>
                <p className="text-gray-400 mb-4">Ajoutez des anime à votre watchlist pour les retrouver facilement.</p>
                <Link to="/search" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Parcourir les anime
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {watchlistAnime.filter(anime => anime && anime.poster_url).map(anime => (
                  <div key={anime.id} className="bg-dark-800 rounded-lg p-4 hover:bg-dark-700 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img
                        src={anime?.poster_url || "url_par_defaut.jpg"}
                        alt={anime?.title || "Poster"}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <Link to={`/anime/${anime.slug || anime._id || anime.id}`} className="text-white font-semibold text-lg hover:text-primary-400 transition-colors">
                          {anime.title}
                        </Link>
                        <div className="flex items-center space-x-4 text-gray-400 text-sm mt-1">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {anime.release_year}
                          </span>
                          <span>{anime.rating} ⭐</span>
                          <span>{anime.total_episodes} épisodes</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {anime.genres && Array.isArray(anime.genres) && anime.genres.slice(0, 3).map((genre: any) => (
                            <span key={typeof genre === 'string' ? genre : genre.id} className="bg-dark-700 text-primary-400 px-2 py-1 rounded text-xs">
                              {typeof genre === 'string' ? genre : genre.name}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-300 text-sm mt-2 line-clamp-2">{anime.description}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Link
                          to={`/anime/${anime.slug || anime._id || anime.id}`}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                          <span>Regarder</span>
                        </Link>
                        <button
                          onClick={() => handleRemoveFromWatchlist(anime.slug)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Retirer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Historique */}
        {activeTab === 'history' && (
          <div>
            {historyAnime.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Aucun historique</h3>
                <p className="text-gray-400 mb-4">Commencez à regarder des anime pour remplir votre historique.</p>
                <Link to="/search" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Parcourir les anime
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {historyAnime.filter(anime => anime && anime.poster_url).map(anime => (
                  <div key={anime.id} className="bg-dark-800 rounded-lg p-4 hover:bg-dark-700 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img
                        src={anime?.poster_url || "url_par_defaut.jpg"}
                        alt={anime?.title || "Poster"}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <Link to={`/anime/${anime.slug || anime._id || anime.id}`} className="text-white font-semibold text-lg hover:text-primary-400 transition-colors">
                          {anime.title}
                        </Link>
                        <div className="flex items-center space-x-4 text-gray-400 text-sm mt-1">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {anime.release_year}
                          </span>
                          <span>{anime.rating} ⭐</span>
                          <span>{anime.total_episodes} épisodes</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {anime.genres && Array.isArray(anime.genres) && anime.genres.slice(0, 3).map((genre: any) => (
                            <span key={typeof genre === 'string' ? genre : genre.id} className="bg-dark-700 text-primary-400 px-2 py-1 rounded text-xs">
                              {typeof genre === 'string' ? genre : genre.name}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-300 text-sm mt-2 line-clamp-2">{anime.description}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Link
                          to={`/anime/${anime.slug || anime._id || anime.id}`}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                          <span>Continuer</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};