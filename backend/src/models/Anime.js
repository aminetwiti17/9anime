import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [255, 'Title cannot exceed 255 characters']
  },
  english_title: {
    type: String,
    trim: true,
    maxlength: [255, 'English title cannot exceed 255 characters']
  },
  japanese_title: {
    type: String,
    trim: true,
    maxlength: [255, 'Japanese title cannot exceed 255 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  synopsis: {
    type: String,
    trim: true
  },
  poster_url: {
    type: String,
    trim: true
  },
  banner_url: {
    type: String,
    trim: true
  },
  anime_type: {
    type: String,
    enum: ['TV', 'Movie', 'OVA', 'ONA', 'Special', 'Music'],
    default: 'TV'
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'upcoming', 'hiatus'],
    default: 'ongoing'
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  popularity_score: {
    type: Number,
    default: 0
  },
  total_episodes: {
    type: Number,
    default: 0,
    min: 0
  },
  episode_duration: {
    type: Number,
    default: 24,
    min: 1
  },
  start_date: {
    type: Date
  },
  end_date: {
    type: Date
  },
  release_year: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear() + 5
  },
  studio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio'
  },
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Season'
  },
  genres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre'
  }],
  source_material: {
    type: String,
    trim: true
  },
  age_rating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'R+', 'NC-17'],
    default: 'PG-13'
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  is_trending: {
    type: Boolean,
    default: false
  },
  view_count: {
    type: Number,
    default: 0,
    min: 0
  },
  meta_title: {
    type: String,
    trim: true
  },
  meta_description: {
    type: String,
    trim: true
  },
  keywords: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for better performance
animeSchema.index({ slug: 1 });
animeSchema.index({ status: 1 });
animeSchema.index({ anime_type: 1 });
animeSchema.index({ rating: -1 });
animeSchema.index({ view_count: -1 });
animeSchema.index({ is_trending: 1 });
animeSchema.index({ is_featured: 1 });
animeSchema.index({ release_year: -1 });
animeSchema.index({ title: 'text', english_title: 'text', japanese_title: 'text' });

export default mongoose.model('Anime', animeSchema);