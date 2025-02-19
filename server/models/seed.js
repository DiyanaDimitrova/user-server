const faker = require("faker");
const { sequelize, connectDB } = require("../config/db");
const Post = require("./PostDTO");
const User = require("./UserDTO");

const generateFakePost = () => ({
  image: faker.image.avatar(),
  title: faker.lorem.word(),
  titleUrl: faker.internet.url(),
  author: faker.name.findName(),
  authorUrl: faker.internet.url(),
  description: faker.lorem.sentence(),
  tags: Array.from({ length: 4 }, () => faker.lorem.word()),
});

const generateFakeUser = () => ({
  email: faker.internet.email(),
  givenName: faker.name.firstName(),
  familyName: faker.name.lastName(),
});

const seedDatabase = async () => {
  await connectDB();
  await sequelize.sync({ force: true }); // WARNING: Deletes existing data!

  try {
    // Seed Users
    const userCount = await User.count();
    if (userCount === 0) {
      const users = Array.from({ length: 100 }, generateFakeUser);
      await User.bulkCreate(users);
      console.log("✅ Seeded 100 fake users.");
    }

    // Seed Posts
    const postCount = await Post.count();
    if (postCount === 0) {
      const posts = Array.from({ length: 100 }, generateFakePost);
      await Post.bulkCreate(posts);
      console.log("✅ Seeded 100 fake posts.");
    }
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
