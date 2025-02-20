const constants = require("../config/constants");
const validator = require("../utils/validator");
const redis = require("../config/redis");
const { User } = require("../models/User");
const { UserDTO } = require("../models/UserDTO");

const { routes, userMessages, errorMessages } = constants;

module.exports = {
  // Retrieve all users
  getAllUsers: async (req, res) => {
    const cacheKey = "users";
    try {
      // Check if data is cached
      const cachedUsers = await redis.get(cacheKey);
      if (cachedUsers) {
        console.log("Serving users from cache...");
        return res.json({ users: JSON.parse(cachedUsers) });
      }

      // Fetch from database if not cached
      const users = await User.find(req.query);
      if (!users.length) {
        return res.status(404).json({ message: errorMessages.noUser });
      }

      // Cache the result for 1 hour
      await redis.set(cacheKey, JSON.stringify(users), "EX", 3600);

      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: errorMessages.getAllUsersError });
    }
  },

  // Retrieve user by ID
  getUser: async (req, res) => {
    const { id } = req.params;
    const cacheKey = `user:${id}`;

    if (!id) {
      return res.status(400).json({ message: userMessages.invalidInput });
    }

    try {
      // Check if data is cached
      const cachedUser = await redis.get(cacheKey);
      if (cachedUser) {
        console.log(`Serving user ${id} from cache...`);
        return res.json({ user: JSON.parse(cachedUser) });
      }

      // Fetch from database if not cached
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: userMessages.getUserError });
      }

      // Cache the result for 1 hour
      await redis.set(cacheKey, JSON.stringify(user), "EX", 3600);

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: userMessages.getUserError });
    }
  },

  // Create user
  createUser: async (req, res) => {
    const { email, givenName, familyName } = req.body;

    if (
      !validator.isValidName(givenName) ||
      !validator.isValidName(familyName) ||
      !validator.isValidEmail(email)
    ) {
      return res.status(400).json({ message: userMessages.invalidInput });
    }

    try {
      const user = await User.create(req.body);

      // Clear relevant caches
      await redis.del("users");

      res
        .status(201)
        .json({ user, message: userMessages.getCreateUserSuccess });
    } catch (error) {
      res.status(500).json({ message: userMessages.getCreateUserError });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const cacheKey = `user:${id}`;

    if (!id || !updates) {
      return res.status(400).json({ message: userMessages.invalidInput });
    }

    try {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: userMessages.updateUserError });
      }

      // Clear relevant caches
      await redis.del("users");
      await redis.del(cacheKey);

      res.json({ user, message: userMessages.updateUserSuccess });
    } catch (error) {
      res.status(500).json({ message: userMessages.updateUserError });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    const { id } = req.params;
    const cacheKey = `user:${id}`;

    if (!id) {
      return res.status(400).json({ message: userMessages.invalidInput });
    }

    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: userMessages.deleteUserError });
      }

      // Clear relevant caches
      await redis.del("users");
      await redis.del(cacheKey);

      res.json({ user, message: userMessages.deleteUserSuccess });
    } catch (error) {
      res.status(500).json({ message: userMessages.deleteUserError });
    }
  },

  getAllUsersAlt: async (req, res) => {
    const cacheKey = "usersAlt";
    try {
      // Check if data is cached
      const cachedUsers = await redis.get(cacheKey);
      if (cachedUsers) {
        console.log("Serving PostgreSQL users from cache...");
        return res.json({ users: JSON.parse(cachedUsers) });
      }

      // Fetch from database if not cached
      const users = await UserDTO.findAll({ where: req.query });
      if (!users.length) {
        return res.status(404).json({ message: errorMessages.noUser });
      }

      // Cache the result for 1 hour
      await redis.set(cacheKey, JSON.stringify(users), "EX", 3600);

      res.json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: errorMessages.getAllUsersError });
    }
  },

  // Retrieve user by ID
  getUserAlt: async (req, res) => {
    const { id } = req.params;
    const cacheKey = `userAlt:${id}`;

    if (!id) {
      return res.status(400).json({ message: userMessages.invalidInput });
    }

    try {
      // Check if data is cached
      const cachedUser = await redis.get(cacheKey);
      if (cachedUser) {
        console.log(`Serving PostgreSQL user ${id} from cache...`);
        return res.json({ user: JSON.parse(cachedUser) });
      }

      // Fetch from database if not cached
      const user = await UserDTO.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: userMessages.getUserError });
      }

      // Cache the result for 1 hour
      await redis.set(cacheKey, JSON.stringify(user), "EX", 3600);

      res.json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: userMessages.getUserError });
    }
  },

  // Create user
  createUserAlt: async (req, res) => {
    const { email, givenName, familyName } = req.body;

    if (
      !validator.isValidName(givenName) ||
      !validator.isValidName(familyName) ||
      !validator.isValidEmail(email)
    ) {
      return res.status(400).json({ message: userMessages.invalidInput });
    }

    try {
      const user = await UserDTO.create({ email, givenName, familyName });

      // Clear relevant caches
      await redis.del("usersAlt");

      res
        .status(201)
        .json({ user, message: userMessages.getCreateUserSuccess });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: userMessages.getCreateUserError });
    }
  },

  // Update user
  updateUserAlt: async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const cacheKey = `userAlt:${id}`;

    if (!id || !Object.keys(updates).length) {
      return res.status(400).json({ message: userMessages.invalidInput });
    }

    try {
      const [updatedRows, [updatedUser]] = await UserDTO.update(updates, {
        where: { id },
        returning: true,
      });

      if (!updatedRows) {
        return res.status(404).json({ message: userMessages.updateUserError });
      }

      // Clear relevant caches
      await redis.del("usersAlt");
      await redis.del(cacheKey);

      res.json({ user: updatedUser, message: userMessages.updateUserSuccess });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: userMessages.updateUserError });
    }
  },

  // Delete user
  deleteUserAlt: async (req, res) => {
    const { id } = req.params;
    const cacheKey = `userAlt:${id}`;

    if (!id) {
      return res.status(400).json({ message: userMessages.invalidInput });
    }

    try {
      const deletedRows = await UserDTO.destroy({ where: { id } });

      if (!deletedRows) {
        return res.status(404).json({ message: userMessages.deleteUserError });
      }

      // Clear relevant caches
      await redis.del("usersAlt");
      await redis.del(cacheKey);

      res.json({ message: userMessages.deleteUserSuccess });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: userMessages.deleteUserError });
    }
  },
};
