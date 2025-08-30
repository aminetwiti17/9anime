import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Season name is required'],
    trim: true,
    maxlength: [50, 'Season name cannot exceed 50 characters']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: 1900,
    max: new Date().getFullYear() + 5
  },
  season_type: {
    type: String,
    enum: ['Spring', 'Summer', 'Fall', 'Winter'],
    required: [true, 'Season type is required']
  }
}, {
  timestamps: true
});

// Compound unique index
seasonSchema.index({ name: 1, year: 1, season_type: 1 }, { unique: true });

export default mongoose.model('Season', seasonSchema);