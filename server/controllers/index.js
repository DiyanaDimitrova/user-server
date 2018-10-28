// expose all conrollers in the project
const userController = require("./user");
const postController = require("./post");

module.exports = {
  user: userController,
  post: postController
};
