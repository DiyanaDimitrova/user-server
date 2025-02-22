const { Post } = require("../models/Post");
const { PostDTO } = require("../models/PostDTO");
const redis = require("../config/redis");
const constants = require("../config/constants");

class PostService {
  // Retrieve all posts with pagination and optional tag filtering (MongoDB)
  async getAllPosts(queryParams) {
    const { page = 1, limit = 10, tags } = queryParams;
    const options = {
      page: Number(page),
      limit: Number(limit),
    };
    const query = tags ? { tags } : {};
    const cacheKey = `posts:${page}:${limit}:${tags || "all"}`;

    try {
      // Check cache first
      const cachedPosts = await redis.get(cacheKey);
      if (cachedPosts) {
        console.log("Cache hit: Returning cached posts");
        return JSON.parse(cachedPosts);
      }

      // Fetch from database if not cached
      const posts = await Post.paginate(query, options);

      const response = {
        total: posts.totalDocs,
        limit: posts.limit,
        page: posts.page,
        totalPages: posts.totalPages,
        posts: posts.docs,
      };

      // Cache the result for 1 hour
      await redis.set(cacheKey, JSON.stringify(response), "EX", 3600);

      console.log("Cache miss: Fetching posts from DB");
      return response;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error(constants.getAllPostsError);
    }
  }

  // Retrieve all posts for PostgreSQL with Redis caching
  async getAllPostsAlt() {
    const cacheKey = `postsAlt:all`;

    try {
      // Check cache first
      const cachedPosts = await redis.get(cacheKey);
      if (cachedPosts) {
        console.log("Cache hit: Returning cached posts");
        return JSON.parse(cachedPosts);
      }

      // Fetch from database if not cached
      const posts = await PostDTO.findAll();

      if (!posts) {
        throw new Error("No posts found");
      }

      // Cache the result for 1 hour
      await redis.set(cacheKey, JSON.stringify(posts), "EX", 3600);

      console.log("Cache miss: Fetching posts from DB");
      return posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error(constants.getAllPostsError);
    }
  }
}

module.exports = new PostService();
