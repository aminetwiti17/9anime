import { body, param, query, validationResult } from 'express-validator';
import { asyncHandler } from './errorMiddleware.js';

// Validation rules for anime
export const validateAnime = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be less than 255 characters'),
  body('slug')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('anime_type')
    .optional()
    .isIn(['TV', 'Movie', 'OVA', 'ONA', 'Special', 'Music'])
    .withMessage('Invalid anime type'),
  body('status')
    .optional()
    .isIn(['ongoing', 'completed', 'upcoming', 'hiatus'])
    .withMessage('Invalid status'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  body('release_year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Invalid release year'),
  body('age_rating')
    .optional()
    .isIn(['G', 'PG', 'PG-13', 'R', 'R+', 'NC-17'])
    .withMessage('Invalid age rating')
];

// Validation rules for user registration
export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Validation rules for user login
export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for search queries
export const validateSearchQuery = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search query must not be empty'),
  query('genre')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Genre must not be empty'),
  query('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Invalid year'),
  query('type')
    .optional()
    .isIn(['TV', 'Movie', 'OVA', 'ONA', 'Special', 'Music'])
    .withMessage('Invalid anime type'),
  query('status')
    .optional()
    .isIn(['ongoing', 'completed', 'upcoming', 'hiatus'])
    .withMessage('Invalid status'),
  query('sort')
    .optional()
    .isIn(['relevance', 'title', 'year', 'rating', 'popularity'])
    .withMessage('Invalid sort option'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Validation rules for pagination
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Validation rules for MongoDB ObjectId
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

// Generic validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Combined validation middleware
export const validate = (validationRules) => [
  ...validationRules,
  handleValidationErrors
];
