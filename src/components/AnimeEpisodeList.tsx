import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, Clock, ExternalLink } from 'lucide-react';
import { useAnimeEpisodes } from '../hooks/useEpisode';
import { LoadingSpinner } from './LoadingSpinner';

interface AnimeEpisodeListProps {
  animeId: string;
}

export const AnimeEpisodeList: React.FC<AnimeEpisodeListProps> = ({ animeId }) => {
  const { animeData, loading, error } = useAnimeEpisodes(animeId);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !animeData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Failed to load episodes</p>
      </div>
    );
  }

  const handleDirectWatch = (episodeId: string, sources: any[]) => {
    if (!sources || !sources.length) {
      alert('No video source available for this episode');
      return;
    }

    const primarySource = sources[0];
    window.open(primarySource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Episodes ({animeData.episodes?.length || 0})
        </h3>
        <div className="text-gray-400 text-sm">
          Click episode title for details, or watch button for direct streaming
        </div>
      </div>

      <div className="grid gap-4">
        {animeData.episodes && animeData.episodes.length > 0 ? (
          animeData.episodes.map((episode) => (
          <div
            key={episode.id}
            className="bg-dark-800 hover:bg-dark-700 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Ep {episode.number}
                  </span>
                  <Link
                    to={`/anime/${animeId}/episode/${episode.number}`}
                    className="text-white font-medium hover:text-primary-400 transition-colors"
                  >
                    {episode.title}
                  </Link>
                </div>
                
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                  {episode.description}
                </p>
                
                <div className="flex items-center space-x-4 text-gray-500 text-xs">
                  {episode.airDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(episode.airDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>~24 min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ExternalLink className="h-3 w-3" />
                    <span>{episode.sources?.length || 0} source{(episode.sources?.length || 0) > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to={`/anime/${animeId}/episode/${episode.number}`}
                  className="bg-dark-700 hover:bg-dark-600 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Details
                </Link>
                <button
                  onClick={() => handleDirectWatch(episode.id, episode.sources)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Watch</span>
                </button>
              </div>
            </div>
          </div>
        ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">Aucun épisode disponible pour le moment</p>
            <p className="text-gray-500 text-sm mt-2">
              Debug: animeData = {JSON.stringify(animeData, null, 2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};