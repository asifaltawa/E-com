const mongoose = require('mongoose');
const Product = require('./models/Product');
const data = require('./data.json');
require('dotenv').config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB using the environment variable
        const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/ecommerce';
        await mongoose.connect(dbUrl);
        console.log('Connected to MongoDB at:', dbUrl);

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert products with numericId
        const products = data.products.map(product => {
            const { id, ...productData } = product;
            return {
                ...productData,
                numericId: parseInt(id)
            };
        });

        await Product.insertMany(products);
        console.log(`Seeded ${products.length} products successfully`);

        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase(); 