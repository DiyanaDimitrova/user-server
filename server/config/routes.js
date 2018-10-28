// routes, exposed by the project
const controllers = require("../controllers");
const constants = require("./constants");
const { users, usersById, posts, notFound } = constants;
module.exports = {
  getRoutes: app => {
    // user routes
    app.get(users, controllers.user.getAllUsers);
    app.get(usersById, controllers.user.getUser);
    app.post(users, controllers.user.createUser);
    app.put(usersById, controllers.user.updateUser);
    app.delete(usersById, controllers.user.deleteUser);

    // posts routes
    app.get(posts, controllers.post.getAllPosts);

    app.all("*", (req, res) => {
      res.status(404);
      res.send(notFound);
      res.end();
    });
  }
};
