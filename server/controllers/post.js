const { Post } = require("../models/Post");
const constants = require("../config/constants");

module.exports = {
  // Retrieve all posts with pagination and optional tag filtering
  getAllPosts: async (req, res) => {
    try {
      const { page = 1, limit = 10, tags } = req.query;
      const options = {
        page: Number(page),
        limit: Number(limit),
      };

      console.log("Post model methods:", Object.keys(Post));

      const query = tags ? { tags } : {};
      const posts = await Post.paginate(query, options);
      console.log("posts", posts);
      res.json({
        total: posts.totalDocs,
        limit: posts.limit,
        page: posts.page,
        totalPages: posts.totalPages,
        posts: posts.docs,
      });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: constants.getAllPostsError });
    }
  },
};
