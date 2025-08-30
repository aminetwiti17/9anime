import express from 'express';

const router = express.Router();

// @route   GET /api/v1/comments/anime/:animeId
// @desc    Get comments for anime
// @access  Public
router.get('/anime/:animeId', async (req, res) => {
  try {
    // TODO: Implement real comment retrieval from database
    res.status(501).json({
      success: false,
      message: 'Not implemented - requires database integration'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/v1/comments
// @desc    Create new comment
// @access  Private
router.post('/', async (req, res) => {
  try {
    // TODO: Implement real comment creation in database
    res.status(501).json({
      success: false,
      message: 'Not implemented - requires database integration'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;