const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGO_URI = process.env['MONGO_URI'];
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB...')
  } catch(err) {
    console.log(err);
  }
}

module.exports = connectDB;