const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aroma-perfume';
      await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
      process.exit(0);
    });
      } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error; // Throw error instead of exiting, let server handle it
  }
};

module.exports = connectDatabase;