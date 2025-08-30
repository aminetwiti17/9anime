import express from 'express';
import Episode from '../models/Episode.js';
import Anime from '../models/Anime.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

// @route   GET /api/v1/episodes/latest
// @desc    Get latest episodes
// @access  Public
router.get('/latest', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;
  
  const episodes = await Episode.find({ is_available: true })
    .populate('anime', 'title poster_url slug')
    .sort({ air_date: -1, createdAt: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    message: 'Latest episodes retrieved successfully',
    data: episodes,
    count: episodes.length
  });
}));

// @route   GET /api/v1/episodes/search
// @desc    Search episodes by title
// @access  Public
router.get('/search', asyncHandler(async (req, res) => {
  const { q, limit = 20 } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const episodes = await Episode.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ],
    is_available: true
  })
    .populate('anime', 'title poster_url slug')
    .limit(parseInt(limit));

  res.json({
    success: true,
    message: 'Search results retrieved successfully',
    data: episodes,
    count: episodes.length,
    query: q
  });
}));

// @route   GET /api/v1/episodes/anime/:animeId/episode/:episodeNumber
// @desc    Get specific episode by anime ID and episode number
// @access  Public
router.get('/anime/:animeId/episode/:episodeNumber', asyncHandler(async (req, res) => {
  const { animeId, episodeNumber } = req.params;

  console.log('🔍 Recherche épisode spécifique:', { animeId, episodeNumber });

  // Find anime first by ID or slug
  const anime = await Anime.findOne({ 
    $or: [{ _id: animeId }, { slug: animeId }] 
  });

  if (!anime) {
    console.log('❌ Anime non trouvé:', animeId);
    return res.status(404).json({
      success: false,
      message: 'Anime not found'
    });
  }

  console.log('✅ Anime trouvé:', { id: anime._id, title: anime.title, slug: anime.slug });

  // Find episode
  const episode = await Episode.findOne({ 
    anime: anime._id, 
    episode_number: parseInt(episodeNumber) 
  }).populate('anime', 'title poster_url slug');

  if (!episode) {
    console.log('❌ Épisode non trouvé:', { animeId: anime._id, episodeNumber });
    return res.status(404).json({
      success: false,
      message: 'Episode not found'
    });
  }

  console.log('✅ Épisode trouvé:', { id: episode._id, title: episode.title, episode_number: episode.episode_number });

  // Increment view count
  episode.view_count += 1;
  await episode.save();

  res.json({
    success: true,
    message: 'Episode retrieved successfully',
    data: episode
  });
}));

// @route   GET /api/v1/episodes/anime/slug/:slug
// @desc    Get episodes by anime slug (alternative route)
// @access  Public
router.get('/anime/slug/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { page = 1, limit = 50 } = req.query;

  // Find anime by slug
  const anime = await Anime.findOne({ slug });

  if (!anime) {
    return res.status(404).json({
      success: false,
      message: 'Anime not found with this slug'
    });
  }

  // Get episodes
  const skip = (page - 1) * limit;
  const episodes = await Episode.find({ anime: anime._id })
    .populate('anime', 'title poster_url slug')
    .sort({ episode_number: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Episode.countDocuments({ anime: anime._id });

  res.json({
    success: true,
    message: 'Episodes retrieved successfully by slug',
    data: episodes,
    pagination: {
      current_page: parseInt(page),
      per_page: parseInt(limit),
      total,
      total_pages: Math.ceil(total / limit)
    },
    anime_info: {
      id: anime._id,
      title: anime.title,
      slug: anime.slug
    }
  });
}));

// @route   GET /api/v1/episodes/anime/:animeId
// @desc    Get episodes by anime ID or slug
// @access  Public
router.get('/anime/:animeId', asyncHandler(async (req, res) => {
  const { animeId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  // Find anime first by ID or slug
  const anime = await Anime.findOne({ 
    $or: [{ _id: animeId }, { slug: animeId }] 
  });

  if (!anime) {
    return res.status(404).json({
      success: false,
      message: 'Anime not found'
    });
  }

  // Get episodes
  const skip = (page - 1) * limit;
  const episodes = await Episode.find({ anime: anime._id })
    .populate('anime', 'title poster_url slug')
    .sort({ episode_number: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Episode.countDocuments({ anime: anime._id });

  res.json({
    success: true,
    message: 'Episodes retrieved successfully',
    data: episodes,
    pagination: {
      current_page: parseInt(page),
      per_page: parseInt(limit),
      total,
      total_pages: Math.ceil(total / limit)
    },
    anime_info: {
      id: anime._id,
      title: anime.title,
      slug: anime.slug
    }
  });
}));

// @route   GET /api/v1/episodes/anime/:animeId/episode/:episodeNumber
// @desc    Get specific episode by anime ID and episode number
// @access  Public
router.get('/anime/:animeId/episode/:episodeNumber', asyncHandler(async (req, res) => {
  const { animeId, episodeNumber } = req.params;

  console.log('🔍 Recherche épisode spécifique:', { animeId, episodeNumber });

  // Find anime first by ID or slug
  const anime = await Anime.findOne({ 
    $or: [{ _id: animeId }, { slug: animeId }] 
  });

  if (!anime) {
    console.log('❌ Anime non trouvé:', animeId);
    return res.status(404).json({
      success: false,
      message: 'Anime not found'
    });
  }

  console.log('✅ Anime trouvé:', { id: anime._id, title: anime.title, slug: anime.slug });

  // Find episode
  const episode = await Episode.findOne({ 
    anime: anime._id, 
    episode_number: parseInt(episodeNumber) 
  }).populate('anime', 'title poster_url slug');

  if (!episode) {
    console.log('❌ Épisode non trouvé:', { animeId: anime._id, episodeNumber });
    return res.status(404).json({
      success: false,
      message: 'Episode not found'
    });
  }

  console.log('✅ Épisode trouvé:', { id: episode._id, title: episode.title, episode_number: episode.episode_number });

  // Increment view count
  episode.view_count += 1;
  await episode.save();

  res.json({
    success: true,
    message: 'Episode retrieved successfully',
    data: episode
  });
}));

// @route   GET /api/v1/episodes/:id
// @desc    Get episode by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const episode = await Episode.findById(id)
    .populate('anime', 'title poster_url slug');

  if (!episode) {
    return res.status(404).json({
      success: false,
      message: 'Episode not found'
    });
  }

  // Increment view count
  episode.view_count += 1;
  await episode.save();

  res.json({
    success: true,
    message: 'Episode retrieved successfully',
    data: episode
  });
}));

// @route   GET /api/v1/episodes
// @desc    Get all episodes with filters, sorting and pagination
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = 'air_date',
    order = 'desc',
    anime_id,
    genre,
    status,
    quality,
    subtitle_type,
    is_available = true
  } = req.query;

  // Build filter object
  const filter = { is_available: is_available === 'true' };
  
  if (anime_id) {
    filter.anime = anime_id;
  }
  
  if (status) {
    filter.status = status;
  }
  
  if (quality) {
    filter['video_sources.quality'] = quality;
  }
  
  if (subtitle_type) {
    filter.subtitle_type = subtitle_type;
  }

  // Build sort object
  const sortObj = {};
  sortObj[sort] = order === 'desc' ? -1 : 1;
  
  // Add secondary sort for consistent ordering
  if (sort !== 'createdAt') {
    sortObj.createdAt = -1;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Get episodes with population
  const episodes = await Episode.find(filter)
    .populate('anime', 'title poster_url slug genres status')
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Episode.countDocuments(filter);

  // If genre filter is applied, filter episodes by anime genre
  let filteredEpisodes = episodes;
  if (genre) {
    filteredEpisodes = episodes.filter(episode => 
      episode.anime && episode.anime.genres && 
      episode.anime.genres.some(g => g.toString() === genre)
    );
  }

  res.json({
    success: true,
    message: 'Episodes retrieved successfully',
    data: filteredEpisodes,
    count: filteredEpisodes.length,
    pagination: {
      current_page: parseInt(page),
      per_page: parseInt(limit),
      total,
      total_pages: Math.ceil(total / parseInt(limit))
    },
    filters: {
      sort,
      order,
      anime_id,
      genre,
      status,
      quality,
      subtitle_type,
      is_available
    }
  });
}));

// @route   POST /api/v1/episodes
// @desc    Create new episode (Admin only)
// @access  Private/Admin
router.post('/', asyncHandler(async (req, res) => {
  const episode = new Episode(req.body);
  await episode.save();

  await episode.populate('anime', 'title poster_url slug');

  res.status(201).json({
    success: true,
    message: 'Episode created successfully',
    data: episode
  });
}));

// @route   PUT /api/v1/episodes/:id
// @desc    Update episode (Admin only)
// @access  Private/Admin
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const episode = await Episode.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  ).populate('anime', 'title poster_url slug');

  if (!episode) {
    return res.status(404).json({
      success: false,
      message: 'Episode not found'
    });
  }

  res.json({
    success: true,
    message: 'Episode updated successfully',
    data: episode
  });
}));

// @route   DELETE /api/v1/episodes/:id
// @desc    Delete episode (Admin only)
// @access  Private/Admin
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const episode = await Episode.findByIdAndDelete(id);

  if (!episode) {
    return res.status(404).json({
      success: false,
      message: 'Episode not found'
    });
  }

  res.json({
    success: true,
    message: 'Episode deleted successfully',
    data: { id }
  });
}));

export default router;