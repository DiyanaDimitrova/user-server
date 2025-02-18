const mongoose = require("mongoose");
// const mongoosePaginate = require("mongoose-paginate");
const mongoosePaginate = require("mongoose-paginate-v2");
const faker = require("faker");

// Define Post Schema
const postSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  titleUrl: { type: String, required: true },
  author: { type: String, required: true },
  authorUrl: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] }, // Ensure tags are stored as an array of strings
});

// Apply pagination plugin
postSchema.plugin(mongoosePaginate);

// Create Post model
const Post = mongoose.model("Post", postSchema);

// Generate a new Post with fake data
const generateFakePost = () => ({
  image: faker.image.avatar(),
  title: faker.lorem.word(),
  titleUrl: faker.internet.url(),
  author: faker.name.findName(),
  authorUrl: faker.internet.url(),
  description: faker.lorem.words(),
  tags: Array.from({ length: 4 }, () => faker.lorem.word()), // Generate 4 random tags
});

// Seed database with fake posts
const seedPosts = async () => {
  try {
    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      const fakePosts = Array.from({ length: 100 }, generateFakePost); // Create 100 posts
      await Post.insertMany(fakePosts);
      console.log("✅ Successfully seeded 100 fake posts.");
    }
  } catch (error) {
    console.error("❌ Error seeding posts:", error);
  }
};

// Export the model and seeding function
module.exports = { Post, seedPosts };
