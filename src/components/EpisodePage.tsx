import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Calendar, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import { useEpisode } from '../hooks/useEpisode';
import { SEO } from './SEO';
import { LoadingSpinner } from './LoadingSpinner';

export const EpisodePage: React.FC = () => {
  const { animeId, episodeNumber } = useParams<{ animeId: string; episodeNumber: string }>();
  const navigate = useNavigate();
  
  const episodeNum = parseInt(episodeNumber || '1', 10);
  const { episode, animeTitle, loading, error } = useEpisode(animeId || '', episodeNum);

  const handleWatchClick = () => {
    if (!episode || !episode.sources.length) {
      alert('No video source available for this episode');
      return;
    }

    const primarySource = episode.sources[0];
    
    // Open external video source in new tab
    const newWindow = window.open(primarySource.url, '_blank', 'noopener,noreferrer');
    
    if (!newWindow) {
      // Fallback if popup was blocked
      alert('Please allow popups for this site to watch episodes');
    }
  };

  const handleGoBack = () => {
    navigate(`/anime/${animeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Episode Not Found</h1>
          <p className="text-gray-400 mb-6">
            {error || 'The requested episode could not be found.'}
          </p>
          <button
            onClick={handleGoBack}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Anime</span>
          </button>
        </div>
      </div>
    );
  }

  const seoTitle = `${animeTitle} Episode ${episode.number} - ${episode.title}`;
  const seoDescription = episode.description || `Watch ${animeTitle} Episode ${episode.number} online`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": seoTitle,
    "description": seoDescription,
    "thumbnailUrl": episode.thumbnail,
    "uploadDate": episode.airDate,
    "partOfSeries": {
      "@type": "TVSeries",
      "name": animeTitle
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        type="video.tv_show"
        image={episode.thumbnail}
        jsonLd={jsonLd}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <button
            onClick={handleGoBack}
            className="text-primary-400 hover:text-primary-300 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {animeTitle}</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Episode Header */}
          <div className="bg-dark-900 rounded-lg overflow-hidden mb-8">
            <div className="flex flex-col lg:flex-row">
              {/* Episode Thumbnail */}
              {episode.thumbnail && (
                <div className="lg:w-1/3">
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
              )}
              
              {/* Episode Info */}
              <div className="flex-1 p-6 lg:p-8">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {episode.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-400 text-sm">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Episode {episode.number}
                    </span>
                    {episode.airDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(episode.airDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>~24 min</span>
                    </div>
                  </div>
                </div>

                {/* Episode Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-white mb-3">Synopsis</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {episode.description || 'No description available for this episode.'}
                  </p>
                </div>

                {/* Watch Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleWatchClick}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3 text-lg"
                  >
                    <Play className="h-6 w-6" />
                    <span>Watch Episode</span>
                    <ExternalLink className="h-5 w-5" />
                  </button>
                  
                  {episode.sources.length > 1 && (
                    <div className="text-center sm:text-left">
                      <p className="text-gray-400 text-sm mb-2">
                        {episode.sources.length} server{episode.sources.length > 1 ? 's' : ''} available
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {episode.sources.map((source, index) => (
                          <button
                            key={index}
                            onClick={() => window.open(source.url, '_blank', 'noopener,noreferrer')}
                            className="bg-dark-700 hover:bg-dark-600 text-gray-300 px-3 py-1 rounded text-sm transition-colors"
                          >
                            Server {index + 1} {source.quality && `(${source.quality})`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Warning Notice */}
                <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <ExternalLink className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-yellow-400 font-medium mb-1">External Video Player</h3>
                      <p className="text-yellow-200 text-sm">
                        Clicking "Watch Episode" will open the video in a new tab on an external streaming server. 
                        Please ensure your popup blocker is disabled for the best experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Episode Navigation */}
          <div className="bg-dark-900 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Episode Navigation</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              {episodeNum > 1 && (
                <Link
                  to={`/anime/${animeId}/episode/${episodeNum - 1}`}
                  className="bg-dark-700 hover:bg-dark-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous Episode</span>
                </Link>
              )}
              
              <Link
                to={`/anime/${animeId}/episode/${episodeNum + 1}`}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>Next Episode</span>
                <Play className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};