const { Post } = require("../models/Post");
const { PostDTO } = require("../models/PostDTO");
const redis = require("../config/redis"); // Import the Redis client
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
      const cacheKey = `posts:${page}:${limit}:${tags || "all"}`; // Unique cache key based on query

      // Check if the data is in the cache
      redis.get(cacheKey, async (err, cachedPosts) => {
        if (err) {
          console.error("Redis error: ", err);
          return res.status(500).json({ message: constants.getAllPostsError });
        }

        if (cachedPosts) {
          // If the data exists in the cache, return it
          console.log("Cache hit: Returning cached posts");
          return res.json(JSON.parse(cachedPosts));
        }

        // If not in the cache, fetch from the database
        const posts = await Post.paginate(query, options);

        // Store the result in the cache for future requests
        redis.setex(
          cacheKey,
          3600,
          JSON.stringify({
            total: posts.totalDocs,
            limit: posts.limit,
            page: posts.page,
            totalPages: posts.totalPages,
            posts: posts.docs,
          })
        );

        console.log("Cache miss: Fetching posts from DB");

        // Return the result from the database
        res.json({
          total: posts.totalDocs,
          limit: posts.limit,
          page: posts.page,
          totalPages: posts.totalPages,
          posts: posts.docs,
        });
      });
    } catch (error) {
      res.status(500).json({ message: constants.getAllPostsError });
    }
  },

  // Retrieve all posts for PostgreSQL with Redis caching
  getAllPostsAlt: async (req, res) => {
    try {
      const cacheKey = `postsAlt:all`; // Cache key for posts in PostgreSQL

      // Check if the data is in the cache
      redis.get(cacheKey, async (err, cachedPosts) => {
        if (err) {
          console.error("Redis error: ", err);
          return res
            .status(500)
            .json({ success: false, message: constants.getAllPostsError });
        }

        if (cachedPosts) {
          // If the data exists in the cache, return it
          console.log("Cache hit: Returning cached posts");
          return res.json({ success: true, data: JSON.parse(cachedPosts) });
        }

        // If not in the cache, fetch from the database
        const posts = await PostDTO.findAll();

        if (!posts) {
          return res
            .status(404)
            .json({ success: false, message: "No posts found" });
        }

        // Store the result in the cache for future requests
        redis.setex(cacheKey, 3600, JSON.stringify(posts));

        console.log("Cache miss: Fetching posts from DB");

        // Return the result from the database
        res.json({ success: true, data: posts });
      });
    } catch (error) {
      console.log("Error fetching posts:", error);
      res
        .status(500)
        .json({ success: false, error: constants.getAllPostsError });
    }
  },
};
