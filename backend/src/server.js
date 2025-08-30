import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import animeRoutes from './routes/animeRoutes.js';
import episodeRoutes from './routes/episodeRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import studioRoutes from './routes/studioRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import streamRoutes from './routes/streamRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Import middleware
import { errorHandler } from './middleware/errorMiddleware.js';
import { notFound } from './middleware/notFoundMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ty-dev.fr', 'https://app.ty-dev.fr', 'http://62.169.27.8']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'MongoDB Connected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'AniStream API Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Favicon endpoint
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content for favicon
});

// Direct anime episodes route for frontend compatibility (by slug)
app.get('/anime/:slug/episodes', async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Import models dynamically to avoid circular dependencies
    const { default: Anime } = await import('./models/Anime.js');
    const { default: Episode } = await import('./models/Episode.js');

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

    console.log(`🔍 Anime trouvé par slug: ${anime.title} (ID: ${anime._id})`);

    // Get episodes with better error handling and logging
    const skip = (page - 1) * limit;
    
    // Recherche des épisodes avec l'ID de l'anime
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

    console.log(`📺 Épisodes trouvés par slug: ${episodes.length}/${total} pour l'anime ${anime.title}`);

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
  } catch (error) {
    console.error('❌ Error in /anime/:slug/episodes:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Direct anime episodes route for frontend compatibility (by ID)
app.get('/anime/:animeId/episodes', async (req, res) => {
  try {
    const { animeId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Import models dynamically to avoid circular dependencies
    const { default: Anime } = await import('./models/Anime.js');
    const { default: Episode } = await import('./models/Episode.js');

    // Find anime by ID or slug
    let anime = null;
    
    // Vérifier si c'est un ObjectId valide
    if (/^[0-9a-fA-F]{24}$/.test(animeId)) {
      anime = await Anime.findById(animeId);
    }
    
    // Si pas trouvé par ID, essayer par slug
    if (!anime) {
      anime = await Anime.findOne({ 
        slug: { $regex: new RegExp(`^${animeId}$`, 'i') } 
      });
    }

    if (!anime) {
      return res.status(404).json({
        success: false,
        message: 'Anime not found with this ID or slug'
      });
    }

    console.log(`🔍 Anime trouvé par ID/slug: ${anime.title} (ID: ${anime._id})`);

    // Get episodes with better error handling and logging
    const skip = (page - 1) * limit;
    
    // Recherche des épisodes avec l'ID de l'anime
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

    console.log(`📺 Épisodes trouvés par ID/slug: ${episodes.length}/${total} pour l'anime ${anime.title}`);

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
  } catch (error) {
    console.error('❌ Error in /anime/:animeId/episodes:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// API routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/anime`, animeRoutes);
app.use(`/api/${API_VERSION}/episodes`, episodeRoutes);
app.use(`/api/${API_VERSION}/genres`, genreRoutes);
app.use(`/api/${API_VERSION}/studios`, studioRoutes);
app.use(`/api/${API_VERSION}/search`, searchRoutes);
app.use(`/api/${API_VERSION}/stream`, streamRoutes);
app.use(`/api/${API_VERSION}/comments`, commentRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/upload`, uploadRoutes);
app.use(`/api/${API_VERSION}/payment`, paymentRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);

// API documentation
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'AniStream API Documentation',
    version: API_VERSION,
    database: 'MongoDB',
    endpoints: {
      auth: `/api/${API_VERSION}/auth`,
      users: `/api/${API_VERSION}/users`,
      anime: `/api/${API_VERSION}/anime`,
      episodes: `/api/${API_VERSION}/episodes`,
      genres: `/api/${API_VERSION}/genres`,
      studios: `/api/${API_VERSION}/studios`,
      search: `/api/${API_VERSION}/search`,
      stream: `/api/${API_VERSION}/stream`,
      comments: `/api/${API_VERSION}/comments`,
      analytics: `/api/${API_VERSION}/analytics`,
      upload: `/api/${API_VERSION}/upload`,
      payment: `/api/${API_VERSION}/payment`,
      admin: `/api/${API_VERSION}/admin`
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  // Server started successfully
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    // Process terminated
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    // Process terminated
  });
});

export default app;