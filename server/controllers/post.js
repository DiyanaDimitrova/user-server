// controller about posts
const Post = require("../models/Post");
const constants = require("../config/constants");

module.exports = {
  // retrieve all posts
  getAllPosts: (req, res) => {
    const { page, limit, tags } = req.query;
    Post.paginate(tags ? { tags: tags } : {}, {
      page: Number(page),
      limit: Number(limit)
    })
      .then(posts => {
        const { docs, total, limit, page, pages } = posts;
        res.json({
          total: total,
          limit: limit,
          page: page,
          pages: pages,
          posts: docs
        });
      })
      .catch(err => {
        res.status(500).json({ message: constants.getAllPostsError });
      });
  }
};
