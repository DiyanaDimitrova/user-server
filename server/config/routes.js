const controllers = require("../controllers");
const constants = require("./constants");

const { routes, errorMessages } = constants;

module.exports = {
  getRoutes: (app) => {
    // User routes
    app
      .route(routes.users)
      .get(controllers.user.getAllUsers)
      .post(controllers.user.createUser);

    app
      .route(routes.usersById)
      .get(controllers.user.getUser)
      .put(controllers.user.updateUser)
      .delete(controllers.user.deleteUser);

    // Post routes
    app.get(routes.posts, controllers.post.getAllPosts);

    // Catch-all 404 route
    app.all("*", (req, res) => {
      res.status(404).send(errorMessages.notFound);
    });
  },
};
