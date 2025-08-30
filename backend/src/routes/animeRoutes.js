import express from 'express';
import Anime from '../models/Anime.js';
import Episode from '../models/Episode.js';
import Genre from '../models/Genre.js';
import Studio from '../models/Studio.js';
import Season from '../models/Season.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

// @route   GET /api/v1/anime
// @desc    Get all anime with pagination and filters
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    genre,
    status,
    type,
    year,
    sort = 'rating',
    order = 'desc',
    search
  } = req.query;

  // Build query
  let query = {};

  if (genre) {
    const genreDoc = await Genre.findOne({ name: new RegExp(genre, 'i') });
    if (genreDoc) {
      query.genres = genreDoc._id;
    }
  }

  if (status) {
    query.status = status;
  }

  if (type) {
    query.anime_type = type;
  }

  if (year) {
    query.release_year = parseInt(year);
  }

  if (search) {
    query.$text = { $search: search };
  }

  // Build sort
  const sortOrder = order === 'desc' ? -1 : 1;
  const sortObj = { [sort]: sortOrder };

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const anime = await Anime.find(query)
    .populate('genres', 'name color')
    .populate('studio', 'name')
    .populate('season', 'name year season_type')
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Anime.countDocuments(query);

  res.json({
    success: true,
    message: 'Anime retrieved successfully',
    data: anime,
    pagination: {
      current_page: parseInt(page),
      per_page: parseInt(limit),
      total,
      total_pages: Math.ceil(total / limit)
    }
  });
}));

// @route   GET /api/v1/anime/trending
// @desc    Get trending anime
// @access  Public
router.get('/trending', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const trendingAnime = await Anime.find({ is_trending: true })
    .populate('genres', 'name color')
    .populate('studio', 'name')
    .sort({ popularity_score: -1, view_count: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    message: 'Trending anime retrieved successfully',
    data: trendingAnime
  });
}));

// @route   GET /api/v1/anime/featured
// @desc    Get featured anime
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const featuredAnime = await Anime.find({ is_featured: true })
    .populate('genres', 'name color')
    .populate('studio', 'name')
    .sort({ rating: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    message: 'Featured anime retrieved successfully',
    data: featuredAnime
  });
}));

// @route   POST /api/v1/anime
// @desc    Create new anime (Admin only)
// @access  Private/Admin
router.post('/', asyncHandler(async (req, res) => {
  const animeData = req.body;

  // Validate required fields
  if (!animeData.title || !animeData.slug) {
    return res.status(400).json({
      success: false,
      message: 'Title and slug are required'
    });
  }

  // Check if anime with same slug exists
  const existingAnime = await Anime.findOne({ slug: animeData.slug });
  if (existingAnime) {
    return res.status(400).json({
      success: false,
      message: 'Anime with this slug already exists'
    });
  }

  const anime = new Anime(animeData);
  await anime.save();

  res.status(201).json({
    success: true,
    message: 'Anime created successfully',
    data: anime
  });
}));

// @route   GET /api/v1/anime/slug/:slug
// @desc    Get anime by slug
// @access  Public
router.get('/slug/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  
  // Recherche de l'anime par slug
  const anime = await Anime.findOne({ slug })
    .populate('genres', 'name color')
    .populate('studio', 'name founded_year')
    .populate('season', 'name year season_type');

  if (!anime) {
    return res.status(404).json({
      success: false,
      message: 'Anime not found with this slug'
    });
  }

  // Increment view count - Utiliser updateOne au lieu de save() pour éviter les conflits
  try {
    await Anime.updateOne(
      { _id: anime._id },
      { $inc: { view_count: 1 } }
    );
  } catch (error) {
    // Si il y a une erreur, on continue
  }

  // Get episodes count - Gestion robuste des erreurs
  let episodesCount = 0;
  try {
    episodesCount = await Episode.countDocuments({ anime: anime._id });
  } catch (error) {
    // Si il y a une erreur, on continue avec 0 épisodes
    episodesCount = 0;
  }

  // Préparer la réponse
  const responseData = {
    ...anime.toObject(),
    episodes_count: episodesCount
  };
  
  res.json({
    success: true,
    message: 'Anime retrieved successfully by slug',
    data: responseData
  });
}));

// @route   GET /api/v1/anime/slug/:slug/episodes
// @desc    Get episodes by anime slug
// @access  Public
router.get('/slug/:slug/episodes', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { page = 1, limit = 50 } = req.query;

  // Find anime first with case-insensitive search
  const anime = await Anime.findOne({ 
    slug: { $regex: new RegExp(`^${slug}$`, 'i') } 
  });

  if (!anime) {
    return res.status(404).json({
      success: false,
      message: 'Anime not found with this slug'
    });
  }

  console.log(`🔍 Anime trouvé via API: ${anime.title} (ID: ${anime._id})`);

  // Get episodes with better filtering
  const skip = (page - 1) * limit;
  const episodes = await Episode.find({ 
    anime: anime._id,
    is_available: true // Seulement les épisodes disponibles
  })
    .populate('anime', 'title poster_url slug')
    .sort({ episode_number: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Episode.countDocuments({ 
    anime: anime._id,
    is_available: true 
  });

  console.log(`📺 Épisodes trouvés via API: ${episodes.length}/${total} pour l'anime ${anime.title}`);

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

// @route   GET /api/v1/anime/id/:id
// @desc    Get anime by ID
// @access  Public
router.get('/id/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate ObjectId format
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  const anime = await Anime.findById(id)
    .populate('genres', 'name color')
    .populate('studio', 'name founded_year')
    .populate('season', 'name year season_type');

  if (!anime) {
    return res.status(404).json({
      success: false,
      message: 'Anime not found with this ID'
    });
  }

  // Increment view count - Utiliser updateOne au lieu de save() pour éviter les conflits
  try {
    await Anime.updateOne(
      { _id: anime._id },
      { $inc: { view_count: 1 } }
    );
  } catch (error) {
    // Continuer même si l'incrémentation échoue
  }

  // Get episodes count
  let episodesCount = 0;
  try {
    episodesCount = await Episode.countDocuments({ anime: anime._id });
  } catch (error) {
    // Si il y a une erreur, on continue avec 0 épisodes
    episodesCount = 0;
  }

  res.json({
    success: true,
    message: 'Anime retrieved successfully by ID',
    data: {
      ...anime.toObject(),
      episodes_count: episodesCount
    }
  });
}));

// @route   PUT /api/v1/anime/id/:id
// @desc    Update anime (Admin only)
// @access  Private/Admin
router.put('/id/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate ObjectId format
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  const updateData = req.body;

  const anime = await Anime.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!anime) {
    return res.status(404).json({
      success: false,
      message: 'Anime not found'
    });
  }

  res.json({
    success: true,
    message: 'Anime updated successfully',
    data: anime
  });
}));

// @route   DELETE /api/v1/anime/id/:id
// @desc    Delete anime (Admin only)
// @access  Private/Admin
router.delete('/id/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  const anime = await Anime.findByIdAndDelete(id);

  if (!anime) {
    return res.status(404).json({
      success: false,
      message: 'Anime not found'
    });
  }

  res.json({
    success: true,
    message: 'Anime deleted successfully',
    data: { id }
  });
}));

export default router;