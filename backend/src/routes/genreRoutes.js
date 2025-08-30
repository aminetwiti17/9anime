import express from 'express';
import Genre from '../models/Genre.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

// @route   GET /api/v1/genres
// @desc    Get all genres
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 });

  res.json({
    success: true,
    message: 'Genres retrieved successfully',
    data: genres,
    count: genres.length
  });
}));

// @route   GET /api/v1/genres/:id
// @desc    Get genre by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const genre = await Genre.findById(id);

  if (!genre) {
    return res.status(404).json({
      success: false,
      message: 'Genre not found'
    });
  }

  res.json({
    success: true,
    message: 'Genre retrieved successfully',
    data: genre
  });
}));

// @route   POST /api/v1/genres
// @desc    Create new genre (Admin only)
// @access  Private/Admin
router.post('/', asyncHandler(async (req, res) => {
  const genre = new Genre(req.body);
  await genre.save();

  res.status(201).json({
    success: true,
    message: 'Genre created successfully',
    data: genre
  });
}));

export default router;