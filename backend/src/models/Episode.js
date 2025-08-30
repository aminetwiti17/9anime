import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
  anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime',
    required: [true, 'Anime reference is required']
  },
  episode_number: {
    type: Number,
    required: [true, 'Episode number is required'],
    min: [1, 'Episode number must be at least 1']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [255, 'Title cannot exceed 255 characters']
  },
  description: {
    type: String,
    trim: true
  },
  thumbnail_url: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    default: 24,
    min: 1
  },
  air_date: {
    type: Date
  },
  is_filler: {
    type: Boolean,
    default: false
  },
  is_recap: {
    type: Boolean,
    default: false
  },
  is_available: {
    type: Boolean,
    default: true
  },
  subtitle_type: {
    type: String,
    enum: ['SUB', 'DUB', 'RAW'],
    default: 'SUB'
  },
  view_count: {
    type: Number,
    default: 0,
    min: 0
  },
  video_sources: [{
    server_name: {
      type: String,
      required: true,
      trim: true
    },
    server_location: {
      type: String,
      trim: true
    },
    quality: {
      type: String,
      enum: ['360p', '480p', '720p', '1080p', '4K'],
      default: '1080p'
    },
    subtitle_type: {
      type: String,
      enum: ['SUB', 'DUB', 'RAW'],
      default: 'SUB'
    },
    video_url: {
      type: String,
      required: true,
      trim: true
    },
    embed_url: {
      type: String,
      trim: true
    },
    is_active: {
      type: Boolean,
      default: true
    },
    priority: {
      type: Number,
      default: 1,
      min: 1
    }
  }]
}, {
  timestamps: true
});

// Compound index for anime and episode number
episodeSchema.index({ anime: 1, episode_number: 1 }, { unique: true });
episodeSchema.index({ air_date: -1 });
episodeSchema.index({ view_count: -1 });

export default mongoose.model('Episode', episodeSchema);