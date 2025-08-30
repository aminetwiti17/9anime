import express from 'express';
import Anime from '../models/Anime.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

// @route   GET /api/v1/search
// @desc    Search anime with advanced filters including slug search
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  try {
    const {
      q = '',
      genre,
      year,
      type,
      status,
      slug,
      sort = 'relevance',
      page = 1,
      limit = 20
    } = req.query;

    // Build query object
    let query = {};

    // Text search (title, description, etc.)
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { english_title: { $regex: q, $options: 'i' } },
        { japanese_title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { synopsis: { $regex: q, $options: 'i' } }
      ];
    }

    // Slug search (exact or partial)
    if (slug) {
      if (slug.includes('*') || slug.includes('%')) {
        // Partial slug search
        const slugPattern = slug.replace(/[*%]/g, '.*');
        query.slug = { $regex: slugPattern, $options: 'i' };
      } else {
        // Exact slug search
        query.slug = { $regex: `^${slug}$`, $options: 'i' };
      }
    }

    // Apply filters
    if (genre) {
      query.genres = genre;
    }

    if (year) {
      query.release_year = parseInt(year);
    }

    if (type) {
      query.anime_type = type;
    }

    if (status) {
      query.status = status;
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'title':
        sortObj.title = 1;
        break;
      case 'year':
        sortObj.release_year = -1;
        break;
      case 'rating':
        sortObj.rating = -1;
        break;
      case 'popularity':
        sortObj.popularity_score = -1;
        break;
      case 'views':
        sortObj.view_count = -1;
        break;
      case 'slug':
        sortObj.slug = 1;
        break;
      default:
        // Relevance sorting (by rating and popularity)
        sortObj.rating = -1;
        sortObj.popularity_score = -1;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
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
      message: 'Search completed successfully',
      data: anime,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total,
        total_pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        query: q,
        slug,
        genre,
        year,
        type,
        status,
        sort
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}));

// @route   GET /api/v1/search/suggestions
// @desc    Get search suggestions including slug suggestions
// @access  Public
router.get('/suggestions', asyncHandler(async (req, res) => {
  try {
    const { q = '', type = 'all' } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        message: 'Suggestions retrieved successfully',
        data: []
      });
    }

    let query = {};
    let projection = {};

    switch (type) {
      case 'slug':
        // Search only by slug
        query.slug = { $regex: q, $options: 'i' };
        projection = { slug: 1, title: 1, poster_url: 1 };
        break;
      case 'title':
        // Search only by title
        query.title = { $regex: q, $options: 'i' };
        projection = { title: 1, slug: 1, poster_url: 1 };
        break;
      default:
        // Search in multiple fields
        query.$or = [
          { title: { $regex: q, $options: 'i' } },
          { slug: { $regex: q, $options: 'i' } },
          { english_title: { $regex: q, $options: 'i' } }
        ];
        projection = { title: 1, slug: 1, poster_url: 1, rating: 1, release_year: 1 };
    }

    const suggestions = await Anime.find(query, projection)
      .sort({ popularity_score: -1, rating: -1 })
      .limit(10);

    res.json({
      success: true,
      message: 'Suggestions retrieved successfully',
      data: suggestions,
      query: q,
      type
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}));

// @route   GET /api/v1/search/slug/:slug
// @desc    Search anime by exact slug
// @access  Public
router.get('/slug/:slug', asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;
    
    const anime = await Anime.findOne({ slug })
      .populate('genres', 'name color')
      .populate('studio', 'name')
      .populate('season', 'name year season_type');

    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found with this slug'
      });
    }

    res.json({
      success: true,
      message: 'Anime found by slug',
      data: anime
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}));

// @route   GET /api/v1/search/slug-suggestions
// @desc    Get slug suggestions for autocomplete
// @access  Public
router.get('/slug-suggestions', asyncHandler(async (req, res) => {
  try {
    const { q = '', limit = 5 } = req.query;

    if (!q || q.length < 1) {
      return res.json({
        success: true,
        message: 'Slug suggestions retrieved successfully',
        data: []
      });
    }

    const suggestions = await Anime.find(
      { slug: { $regex: q, $options: 'i' } },
      { slug: 1, title: 1, poster_url: 1 }
    )
      .sort({ popularity_score: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      message: 'Slug suggestions retrieved successfully',
      data: suggestions,
      query: q
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}));

// @route   GET /api/v1/search/generate-slug
// @desc    Generate slug from title (utility for admin)
// @access  Public
router.get('/generate-slug', asyncHandler(async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title parameter is required'
      });
    }

    // Generate slug from title
    const generateSlug = (text) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    };

    let slug = generateSlug(title);
    let counter = 1;
    let originalSlug = slug;

    // Check if slug exists and generate unique one
    while (await Anime.findOne({ slug })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    res.json({
      success: true,
      message: 'Slug generated successfully',
      data: {
        title,
        slug,
        isUnique: true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}));

export default router;