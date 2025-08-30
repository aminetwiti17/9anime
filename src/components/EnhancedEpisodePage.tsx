import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Play, ArrowLeft, Calendar, Clock, ExternalLink, AlertCircle, 
  Heart, Share2, Download, Settings, Volume2, Maximize2,
  ChevronLeft, ChevronRight, Star, Eye, MessageCircle, Bookmark
} from 'lucide-react';
import { useEpisode } from '../hooks/useEpisode';
import { SEO } from './SEO';
import { LoadingSpinner } from './LoadingSpinner';
import { AnimeCard } from './AnimeCard';
import { VideoPlayer } from './VideoPlayer';

interface EpisodeSource {
  url: string;
  quality: string;
  server: string;
  type: 'stream' | 'download';
}

interface EpisodeComment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export const EnhancedEpisodePage: React.FC = () => {
  const { animeId, episodeNumber } = useParams<{ animeId: string; episodeNumber: string }>();
  const navigate = useNavigate();
  
  const episodeNum = parseInt(episodeNumber || '1', 10);
  const { episode, animeTitle, loading, error } = useEpisode(animeId || '', episodeNum);

  // États locaux
  const [selectedSource, setSelectedSource] = useState<EpisodeSource | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'comments' | 'related'>('info');

  // Données mockées pour la démonstration
  const mockSources: EpisodeSource[] = [
    { url: 'https://example.com/stream1', quality: '1080p', server: 'Server 1', type: 'stream' },
    { url: 'https://example.com/stream2', quality: '720p', server: 'Server 2', type: 'stream' },
    { url: 'https://example.com/stream3', quality: '480p', server: 'Server 3', type: 'stream' },
    { url: 'https://example.com/download1', quality: '1080p', server: 'Download', type: 'download' }
  ];

  const mockComments: EpisodeComment[] = [
    {
      id: '1',
      user: 'AnimeFan2024',
      avatar: 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=50',
      content: 'Cet épisode était incroyable ! L\'animation était parfaite.',
      timestamp: '2 heures',
      likes: 24
    },
    {
      id: '2',
      user: 'OtakuMaster',
      avatar: 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=50',
      content: 'J\'ai adoré le développement des personnages dans cet épisode.',
      timestamp: '5 heures',
      likes: 18
    }
  ];

  const mockRelatedEpisodes = [
    {
      id: '1',
      title: 'Episode 1 - Le Début',
      poster: 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=300',
      year: '2024',
      rating: '9.2',
      totalEpisodes: '24',
      genres: ['Action', 'Adventure'],
      type: 'TV',
      status: 'ongoing',
      description: 'Premier épisode de la série',
      season: 'Spring 2024'
    }
  ];

  useEffect(() => {
    if (mockSources.length > 0) {
      setSelectedSource(mockSources[0]);
    }
  }, []);

  const handleWatchClick = () => {
    if (!selectedSource) {
      alert('Veuillez sélectionner une source vidéo');
      return;
    }

    if (selectedSource.type === 'download') {
      // Téléchargement
      const link = document.createElement('a');
      link.href = selectedSource.url;
      link.download = `${animeTitle}-Episode-${episodeNumber}.mp4`;
      link.click();
    } else {
      // Streaming
      const newWindow = window.open(selectedSource.url, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        alert('Veuillez autoriser les popups pour regarder les épisodes');
      }
    }
  };

  const handleGoBack = () => {
    navigate(`/anime/${animeId}`);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${animeTitle} Episode ${episodeNumber}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
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
          <h1 className="text-2xl font-bold text-white mb-2">Épisode Non Trouvé</h1>
          <p className="text-gray-400 mb-6">
            {error || 'L\'épisode demandé n\'a pas pu être trouvé.'}
          </p>
          <button
            onClick={handleGoBack}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-all duration-200 inline-flex items-center space-x-2 hover:shadow-lg hover:shadow-primary-500/25"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à l'Anime</span>
          </button>
        </div>
      </div>
    );
  }

  const seoTitle = `${animeTitle} Episode ${episode.number} - ${episode.title}`;
  const seoDescription = episode.description || `Regardez ${animeTitle} Episode ${episode.number} en ligne`;

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
            className="text-primary-400 hover:text-primary-300 transition-all duration-200 flex items-center space-x-2 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour à {animeTitle}</span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Lecteur Vidéo Intégré */}
          <div className="bg-dark-900 rounded-2xl overflow-hidden mb-8 shadow-xl shadow-black/20">
            <div className="p-4 border-b border-dark-700">
              <h2 className="text-xl font-bold text-white">Lecteur Vidéo</h2>
            </div>
            <div className="p-4">
              <VideoPlayer
                src={selectedSource?.url || ''}
                poster={episode.thumbnail}
                title={`${animeTitle} - Episode ${episode.number}`}
                className="w-full h-96 md:h-[500px] lg:h-[600px]"
              />
            </div>
          </div>

          {/* Episode Header avec Design Moderne */}
          <div className="bg-gradient-to-br from-dark-900 to-dark-800 rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-black/20">
            <div className="flex flex-col lg:flex-row">
              {/* Episode Thumbnail avec Overlay */}
              {episode.thumbnail && (
                <div className="lg:w-2/5 relative group">
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-full h-80 lg:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges overlay */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Episode {episode.number}
                    </span>
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      HD
                    </span>
                  </div>

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-200">
                      <Play className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Episode Info */}
              <div className="flex-1 p-6 lg:p-8">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
                    {episode.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
                    <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      Episode {episode.number}
                    </span>
                    {episode.airDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(episode.airDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>~24 min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>9.2</span>
                    </div>
                  </div>
                </div>

                {/* Episode Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-3">Synopsis</h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {episode.description || 'Aucune description disponible pour cet épisode.'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <button
                    onClick={handleWatchClick}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-3 text-lg hover:shadow-2xl hover:shadow-primary-500/25 hover:scale-105"
                  >
                    <Play className="h-6 w-6" />
                    <span>Regarder l'Épisode</span>
                    <ExternalLink className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={handleLike}
                    className={`p-4 rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      isLiked 
                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/25' 
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{isLiked ? 'Aimé' : 'J\'aime'}</span>
                  </button>

                  <button
                    onClick={handleBookmark}
                    className={`p-4 rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      isBookmarked 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    <span>{isBookmarked ? 'Sauvegardé' : 'Sauvegarder'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="bg-dark-700 hover:bg-dark-600 text-gray-300 p-4 rounded-xl transition-all duration-200 flex items-center space-x-2 hover:text-white"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Partager</span>
                  </button>
                </div>

                {/* Source Selection */}
                <div className="bg-dark-800 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Sources Disponibles</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {mockSources.map((source, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSource(source)}
                        className={`p-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                          selectedSource === source
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-bold">{source.server}</div>
                          <div className="text-xs opacity-80">{source.quality}</div>
                          <div className="text-xs opacity-60">{source.type}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-dark-900 rounded-2xl p-6 mb-8 shadow-xl shadow-black/20">
            <div className="flex space-x-1 mb-6">
              {[
                { id: 'info', label: 'Informations', icon: Eye },
                { id: 'comments', label: 'Commentaires', icon: MessageCircle },
                { id: 'related', label: 'Épisodes Similaires', icon: Play }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-dark-800 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Détails Techniques</h4>
                      <div className="space-y-2 text-gray-300">
                        <div className="flex justify-between">
                          <span>Qualité:</span>
                          <span className="text-primary-400">1080p</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span className="text-primary-400">MP4</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Durée:</span>
                          <span className="text-primary-400">24:30</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Audio:</span>
                          <span className="text-primary-400">Japonais</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-dark-800 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Statistiques</h4>
                      <div className="space-y-2 text-gray-300">
                        <div className="flex justify-between">
                          <span>Vues:</span>
                          <span className="text-green-400">12,456</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Likes:</span>
                          <span className="text-red-400">892</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Commentaires:</span>
                          <span className="text-blue-400">156</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Note:</span>
                          <span className="text-yellow-400">9.2/10</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-dark-800 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Action', 'Drama', 'Emotion', 'Climax'].map(tag => (
                          <span key={tag} className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <h4 className="text-lg font-semibold text-white">Commentaires ({mockComments.length})</h4>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Ajouter un commentaire
                    </button>
                  </div>
                  
                  {mockComments.map(comment => (
                    <div key={comment.id} className="bg-dark-800 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={comment.avatar} 
                          alt={comment.user}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-white">{comment.user}</span>
                            <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-300 mb-3">{comment.content}</p>
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors">
                              <Heart className="h-4 w-4" />
                              <span className="text-sm">{comment.likes}</span>
                            </button>
                            <button className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                              Répondre
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'related' && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Épisodes Similaires</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockRelatedEpisodes.map(anime => (
                      <AnimeCard key={anime.id} anime={anime} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Episode Navigation */}
          <div className="bg-gradient-to-r from-dark-900 to-dark-800 rounded-2xl p-6 shadow-xl shadow-black/20">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Navigation des Épisodes</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {episodeNum > 1 && (
                <Link
                  to={`/anime/${animeId}/episode/${episodeNum - 1}`}
                  className="bg-dark-700 hover:bg-dark-600 text-white px-8 py-4 rounded-xl transition-all duration-200 flex items-center space-x-3 hover:scale-105 hover:shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="font-medium">Épisode Précédent</span>
                </Link>
              )}
              
              <Link
                to={`/anime/${animeId}/episode/${episodeNum + 1}`}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl transition-all duration-200 flex items-center space-x-3 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/25"
              >
                <span className="font-medium">Épisode Suivant</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
