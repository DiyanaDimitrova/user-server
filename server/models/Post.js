// model of the Post collection
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const faker = require("faker");

// shema of the post
const postSchema = mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  titleUrl: { type: String, required: true },
  author: { type: String, required: true },
  authorUrl: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: Array }
});

postSchema.plugin(mongoosePaginate);
const Post = mongoose.model("Post", postSchema);

//creation of Post with fake data
const newPost = () => {
  const tags = [];
  for (let i = 0; i < 5; i++) {
    tags.push(faker.lorem.word());
  }
  return {
    image: faker.image.avatar(),
    title: faker.lorem.word(),
    titleUrl: faker.internet.url(),
    author: faker.name.findName(),
    authorUrl: faker.internet.url(),
    description: faker.lorem.sentence(),
    tags: tags
  };
};
//seed data for posts API
module.exports = Post;
module.exports.seedPosts = () => {
  Post.find({}).then(posts => {
    if (posts.length === 0) {
      Post.find({}).then(posts => {
        if (posts.length === 0) {
          const ITEMS = 100;
          for (let i = 0; i < ITEMS; i++) {
            Post.create(newPost());
          }
        }
      });
    }
  });
};
