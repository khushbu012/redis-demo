const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connecting to mongoDB database`);
  } catch (error) {
    console.log(`Error in mongoDB ${error}`);
  }
};

module.exports = connectDB;
