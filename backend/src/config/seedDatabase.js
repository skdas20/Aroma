const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const perfumesData = require('../data/perfumes');

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');

    // Insert perfume data
    const products = await Product.insertMany(perfumesData);
    console.log(`🌸 Successfully seeded ${products.length} perfumes to database`);

    // List seeded products
    products.forEach(product => {
      console.log(`   - ${product.name} (${product.category}) - $${product.price}`);
    });

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
