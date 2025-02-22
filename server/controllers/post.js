const postService = require("../services/post");

module.exports = {
  // Retrieve all posts with pagination and optional tag filtering
  getAllPosts: async (req, res) => {
    try {
      const posts = await postService.getAllPosts(req.query);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Retrieve all posts for PostgreSQL with Redis caching
  getAllPostsAlt: async (req, res) => {
    try {
      const posts = await postService.getAllPostsAlt();
      res.json({ success: true, data: posts });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
