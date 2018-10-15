// routes, exposed by the project
const controllers = require("../controllers");
const constants = require("./constants");
module.exports = {
  getRoutes: app => {
    // user routes
    app.get(constants.users, controllers.user.getAllUsers);
    app.get(constants.usersById, controllers.user.getUser);
    app.post(constants.users, controllers.user.createUser);
    app.put(constants.usersById, controllers.user.updateUser);
    app.delete(constants.usersById, controllers.user.deleteUser);

    app.all("*", (req, res) => {
      res.status(404);
      res.send("Not Found");
      res.end();
    });
  }
};
