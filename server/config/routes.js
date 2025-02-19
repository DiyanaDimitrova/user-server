const controllers = require("../controllers");
const constants = require("./constants");

const { routes, routesAlt, errorMessages } = constants;

module.exports = {
  getRoutes: (app) => {
    // User routes for Mongo
    app
      .route(routes.users)
      .get(controllers.user.getAllUsers)
      .post(controllers.user.createUser);

    app
      .route(routes.usersById)
      .get(controllers.user.getUser)
      .put(controllers.user.updateUser)
      .delete(controllers.user.deleteUser);

    // Post routes for Mongo
    app.get(routes.posts, controllers.post.getAllPosts);

    // User routes for PostgreSQL
    app
      .route(routesAlt.user)
      .get(controllers.user.getAllUsersAlt)
      .post(controllers.user.createUserAlt);

    app
      .route(routesAlt.userById)
      .get(controllers.user.getUserAlt)
      .put(controllers.user.updateUserAlt)
      .delete(controllers.user.deleteUserAlt);

    // Post routes for PostgreSQL
    app.get(routesAlt.post, controllers.post.getAllPostsAlt);

    // Catch-all 404 route
    app.all("*", (req, res) => {
      res.status(404).send(errorMessages.notFound);
    });
  },
};
