const mongoose = require('mongoose');
const dotenv = require('dotenv');
//mongoose is object relational mapping library for MongoDB and Node.js
dotenv.config({ path: '../.env' });

const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;