import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Genre name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Genre name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#7c3aed',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color']
  }
}, {
  timestamps: true
});

genreSchema.index({ name: 1 });

export default mongoose.model('Genre', genreSchema);