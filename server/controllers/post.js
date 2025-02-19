const { Post } = require("../models/Post");
const { PostDTO } = require("../models/PostDTO");
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

      const query = tags ? { tags } : {};
      const posts = await Post.paginate(query, options);
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
  getAllPostsAlt: async (req, res) => {
    try {
      const posts = await PostDTO.findAll(); // Or Post.find() for Mongoose

      if (!posts) {
        return res
          .status(404)
          .json({ success: false, message: "No posts found" });
      }

      res.json({ success: true, data: posts });
    } catch (error) {
      console.log("object", error);
      res
        .status(500)
        .json({ success: false, error: constants.getAllPostsError });
    }
  },
};
