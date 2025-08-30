import mongoose from 'mongoose';

const studioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Studio name is required'],
    unique: true,
    trim: true,
    maxlength: [255, 'Studio name cannot exceed 255 characters']
  },
  description: {
    type: String,
    trim: true
  },
  founded_year: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear()
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  logo_url: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

studioSchema.index({ name: 1 });

export default mongoose.model('Studio', studioSchema);