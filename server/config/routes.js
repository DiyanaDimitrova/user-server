const controllers = require("../controllers");
const constants = require("./constants");
const redis = require("./redis");

const { routes, routesAlt, errorMessages } = constants;

const cacheMiddleware = (key) => async (req, res, next) => {
  try {
    const cachedData = await redis.get(key);
    if (cachedData) {
      console.log(`Serving ${key} from cache...`);
      return res.json(JSON.parse(cachedData));
    }
    next();
  } catch (err) {
    console.error("Redis error:", err);
    next();
  }
};

module.exports = {
  getRoutes: (app) => {
    // User routes for Mongo
    app
      .route(routes.users)
      .get(cacheMiddleware("users"), controllers.user.getAllUsers)
      .post(async (req, res, next) => {
        await redis.del("users"); // Clear cache on create
        next();
      }, controllers.user.createUser);

    app
      .route(routes.usersById)
      .get(controllers.user.getUser)
      .put(async (req, res, next) => {
        await redis.del("users"); // Clear cache on update
        next();
      }, controllers.user.updateUser)
      .delete(async (req, res, next) => {
        await redis.del("users"); // Clear cache on delete
        next();
      }, controllers.user.deleteUser);
    // Post routes for Mongo
    app.get(
      routes.posts,
      cacheMiddleware("posts"),
      controllers.post.getAllPosts
    );

    // User routes for PostgreSQL
    app
      .route(routesAlt.user)
      .get(cacheMiddleware("usersAlt"), controllers.user.getAllUsersAlt)
      .post(async (req, res, next) => {
        await redis.del("usersAlt");
        next();
      }, controllers.user.createUserAlt);

    app
      .route(routesAlt.userById)
      .get(controllers.user.getUserAlt)
      .put(async (req, res, next) => {
        await redis.del("usersAlt");
        next();
      }, controllers.user.updateUserAlt)
      .delete(async (req, res, next) => {
        await redis.del("usersAlt");
        next();
      }, controllers.user.deleteUserAlt);

    // Post routes for PostgreSQL
    app.get(
      routesAlt.post,
      cacheMiddleware("postsAlt"),
      controllers.post.getAllPostsAlt
    );

    // Catch-all 404 route
    app.all("*", (req, res) => {
      res.status(404).send(errorMessages.notFound);
    });
  },
};
