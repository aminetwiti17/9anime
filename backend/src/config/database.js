import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection configuration
const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://admin:admin123456@localhost:27017/anistream_db?authSource=admin';
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    // MongoDB Connected successfully
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Close database connection
export const closeConnection = async () => {
  try {
    await mongoose.connection.close();
    // MongoDB connection closed
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};

// Get database stats
export const getDBStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize
    };
  } catch (error) {
    console.error('Error getting DB stats:', error);
    return null;
  }
};

export default connectDB;