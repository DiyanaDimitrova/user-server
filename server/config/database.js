const mongoose = require("mongoose");
const config = require("./config")[process.env.NODE_ENV || "development"];

mongoose.Promise = global.Promise;

const connectToDB = async () => {
  try {
    await mongoose.connect(config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log("User Management database is ready!");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

const initializeModels = () => {
  require("../models/User").seedUsers();
  require("../models/Post").seedPosts();
};

module.exports = {
  initializeDB: () => {
    connectToDB();
    initializeModels();
  },
};
