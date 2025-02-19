// Routes
module.exports.routes = {
  users: "/users",
  usersById: "/users/:id",
  posts: "/posts",
};

module.exports.routesAlt = {
  user: "/user",
  userById: "/user/:id",
  post: "/post",
};

// Success and Error Messages for Users
module.exports.userMessages = {
  getAllUsersError: "All users could not be loaded!",
  getCreateUserSuccess: "User is created successfully!",
  getCreateUserError: "User could not be created!",
  getUserError: "User could not be loaded!",
  updateUserSuccess: "User is updated successfully!",
  updateUserError: "User could not be updated!",
  deleteUserSuccess: "User is deleted successfully!",
  deleteUserError: "User could not be deleted!",
  invalidInput: "The provided data is not valid!",
  noUser: "No user found",
};

// General Error Messages
module.exports.errorMessages = {
  notFound: "Not Found",
  getAllPostsError: "Posts could not be loaded!",
};
