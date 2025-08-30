import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Calendar, Star, Eye, Clock, Download, Share2, Heart, MessageCircle, Flag } from 'lucide-react';
import { NineAnimeHeader } from '../components/NineAnimeHeader';
import { AnimeEpisodeList } from '../components/AnimeEpisodeList';
import { useAnimeBySlug, useIncrementViewCount } from '../hooks/useAnime';

export const NineAnimeDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedTab, setSelectedTab] = useState<'episodes' | 'overview' | 'characters'>('episodes');
  const [selectedSubType, setSelectedSubType] = useState<'SUB' | 'DUB'>('SUB');
  
  const { anime, loading, error } = useAnimeBySlug(slug || '');
  const { incrementViewCount } = useIncrementViewCount();

  React.useEffect(() => {
    if (anime && anime.id) {
      incrementViewCount('anime', anime.id);
    }
  }, [anime, incrementViewCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        <NineAnimeHeader />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7c3aed] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        <NineAnimeHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Anime not found</h1>
            <Link to="/" className="text-[#7c3aed] hover:text-[#6d28d9]">
              Return to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <NineAnimeHeader />
      
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Hero Section */}
          <div className="flex space-x-6 mb-8">
            <img
              src={anime?.poster_url || 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=300'}
              alt={anime.title}
              className="w-48 h-64 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-4">{anime.title}</h1>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-400">Genre:</span>
                  <span className="text-white ml-2">
                    {anime.genres && anime.genres.length > 0 ? anime.genres.map(g => typeof g === 'string' ? g : g.name).join(', ') : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Producer:</span>
                  <span className="text-white ml-2">{typeof anime.studio === 'string' ? anime.studio : anime.studio?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white ml-2">{anime.anime_type}</span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className="text-white ml-2 capitalize">{anime.status}</span>
                </div>
                <div>
                  <span className="text-gray-400">Released:</span>
                  <span className="text-white ml-2">{anime.release_year}</span>
                </div>
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white ml-2">{anime.episode_duration} min</span>
                </div>
                <div>
                  <span className="text-gray-400">Quality:</span>
                  <span className="text-white ml-2">HD</span>
                </div>
                <div>
                  <span className="text-gray-400">Updated:</span>
                  <span className="text-white ml-2">
                    {anime.updated_at ? new Date(anime.updated_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-bold">{anime.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">{anime.view_count?.toLocaleString() || '0'}</span>
                </div>
              </div>

              <div className="flex space-x-3 mb-6">
                <Link
                  to={`/anime/${anime.slug}/episode/1`}
                  className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-6 py-2 rounded flex items-center space-x-2 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Watch Now</span>
                </Link>
                <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-6 py-2 rounded flex items-center space-x-2 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>

              {/* Social Buttons */}
              <div className="flex space-x-2">
                <button className="bg-[#1877f2] text-white px-4 py-2 rounded text-sm">Facebook</button>
                <button className="bg-[#1da1f2] text-white px-4 py-2 rounded text-sm">Twitter</button>
                <button className="bg-[#25d366] text-white px-4 py-2 rounded text-sm">WhatsApp</button>
                <button className="bg-[#ff4500] text-white px-4 py-2 rounded text-sm">Reddit</button>
                <button className="bg-[#0088cc] text-white px-4 py-2 rounded text-sm">Telegram</button>
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Synopsis {anime.title}</h2>
            <p className="text-gray-300 leading-relaxed">
              {anime.description || anime.synopsis || 'No description available.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-700">
              {(['episodes', 'overview', 'characters'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-6 py-3 font-medium transition-colors ${
                    selectedTab === tab
                      ? 'text-[#7c3aed] border-b-2 border-[#7c3aed]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Episodes Tab */}
          {selectedTab === 'episodes' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  Watch {anime.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedSubType('SUB')}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      selectedSubType === 'SUB'
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
                    }`}
                  >
                    SUB
                  </button>
                  <button
                    onClick={() => setSelectedSubType('DUB')}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      selectedSubType === 'DUB'
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
                    }`}
                  >
                    DUB
                  </button>
                </div>
              </div>

              {/* Episode List Component */}
              <AnimeEpisodeList animeId={anime.slug} />
            </div>
          )}

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Details</h3>
                <dl className="space-y-3">
                  <div className="flex">
                    <dt className="text-gray-400 w-32">Type:</dt>
                    <dd className="text-white">{anime.anime_type}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-400 w-32">Episodes:</dt>
                    <dd className="text-white">{anime.total_episodes}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-400 w-32">Status:</dt>
                    <dd className="text-white capitalize">{anime.status}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-400 w-32">Year:</dt>
                    <dd className="text-white">{anime.release_year}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-400 w-32">Studio:</dt>
                    <dd className="text-white">{typeof anime.studio === 'string' ? anime.studio : anime.studio?.name || 'N/A'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-400 w-32">Duration:</dt>
                    <dd className="text-white">{anime.episode_duration} min</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-gray-400 w-32">Rating:</dt>
                    <dd className="text-white">{anime.rating}/10</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Synopsis</h3>
                <p className="text-gray-300 leading-relaxed">
                  {anime.description || anime.synopsis || 'No description available.'}
                </p>
              </div>
            </div>
          )}

          {/* Characters Tab */}
          {selectedTab === 'characters' && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Characters & Voice Actors</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Mock character data */}
                {[
                  { character: 'Main Character', actor: 'Voice Actor 1', image: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100' },
                  { character: 'Supporting Character', actor: 'Voice Actor 2', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
                  { character: 'Antagonist', actor: 'Voice Actor 3', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
                  { character: 'Side Character', actor: 'Voice Actor 4', image: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100' }
                ].map((char, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={char.image}
                      alt={char.character}
                      className="w-16 h-16 rounded-full mx-auto mb-2"
                    />
                    <h4 className="text-white text-sm font-medium">{char.character}</h4>
                    <p className="text-gray-400 text-xs">{char.actor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 p-6 border-l border-gray-800">
          {/* Quick Filter */}
          <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-4">Quick filter</h3>
            <div className="space-y-3">
              <select className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-white text-sm">
                <option>Genre All</option>
              </select>
              <select className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-white text-sm">
                <option>Season All</option>
              </select>
              <select className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-white text-sm">
                <option>Studio All</option>
              </select>
              <select className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-white text-sm">
                <option>Type All</option>
              </select>
              <select className="w-full bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-white text-sm">
                <option>Order by Default</option>
              </select>
            </div>
            <button className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white py-2 rounded-lg mt-4 transition-colors">
              Search
            </button>
          </div>

          {/* Spring Season Banner */}
          <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-3">Spring Season 2025</h3>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Spring Season 2025"
                className="w-full h-32 object-cover rounded"
              />
              <div className="absolute top-2 right-2 bg-[#f97316] text-white px-2 py-1 rounded text-xs font-bold">
                SUMMER 2025
              </div>
            </div>
          </div>

          {/* Top Anime */}
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <h3 className="text-white font-bold mb-4">Top Anime</h3>
            <div className="space-y-3">
              {/* Mock top anime list */}
              {[
                { rank: 1, title: 'One Piece', type: 'TV', rating: 9.1 },
                { rank: 2, title: 'Naruto Shippuden (Dub)', type: 'TV', rating: 8.7 },
                { rank: 3, title: 'One Piece (Dub)', type: 'TV', rating: 9.1 },
                { rank: 4, title: 'Boruto: Naruto Next Generations (Dub)', type: 'TV', rating: 7.2 },
                { rank: 5, title: 'Lord of Mysteries', type: 'ONA', rating: 8.5 }
              ].map((item) => (
                <div key={item.rank} className="flex items-center space-x-3 hover:bg-[#333] p-2 rounded cursor-pointer transition-colors">
                  <div className="text-[#7c3aed] font-bold text-sm w-6">
                    {String(item.rank).padStart(2, '0')}
                  </div>
                  <img
                    src="https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=50"
                    alt={item.title}
                    className="w-8 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-xs font-medium line-clamp-2">{item.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-gray-400 text-xs">{item.type}</span>
                      <span className="text-gray-400 text-xs">•</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-gray-400 text-xs">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};