const mongoose = require("mongoose");
const faker = require("faker");

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    givenName: { type: String, required: true, trim: true },
    familyName: { type: String, required: true, trim: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);

// Generate a new Post with fake data
const generateFakeUser = () => ({
  email: faker.internet.email(),
  givenName: faker.lorem.word(),
  familyName: faker.internet.url(),
});

// Seed database with fake posts
const seedUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const fakeUsers = Array.from({ length: 100 }, generateFakeUser); // Create 100 users
      await User.insertMany(fakeUsers);
      console.log("✅ Successfully seeded 100 fake users.");
    }
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  }
};

// Export the model and seeding function
module.exports = { User, seedUsers };
