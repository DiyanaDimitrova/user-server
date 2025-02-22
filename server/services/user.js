const redis = require("../config/redis");
const { User } = require("../models/User");
const { UserDTO } = require("../models/UserDTO");
const { userMessages, errorMessages } = require("../config/constants");
const validator = require("../utils/validator");

class UserService {
  // Get all users
  async getAllUsers(query) {
    const cacheKey = "users";
    const cachedUsers = await redis.get(cacheKey);

    if (cachedUsers) {
      console.log("Serving users from cache...");
      return JSON.parse(cachedUsers);
    }

    const users = await User.find(query);
    if (!users.length) {
      throw new Error(userMessages.noUser);
    }

    await redis.set(cacheKey, JSON.stringify(users), "EX", 3600);
    return users;
  }

  // Get user by ID
  async getUser(id) {
    const cacheKey = `user:${id}`;
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      console.log(`Serving user ${id} from cache...`);
      return JSON.parse(cachedUser);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new Error(userMessages.getUserError);
    }

    await redis.set(cacheKey, JSON.stringify(user), "EX", 3600);
    return user;
  }

  // Create user
  async createUser(data) {
    const { email, givenName, familyName } = data;

    if (
      !validator.isValidName(givenName) ||
      !validator.isValidName(familyName) ||
      !validator.isValidEmail(email)
    ) {
      throw new Error(userMessages.invalidInput);
    }

    const user = await User.create(data);
    await redis.del("users");
    return user;
  }

  // Update user
  async updateUser(id, updates) {
    const cacheKey = `user:${id}`;
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!user) {
      throw new Error(userMessages.updateUserError);
    }

    await redis.del("users");
    await redis.del(cacheKey);
    return user;
  }

  // Delete user
  async deleteUser(id) {
    const cacheKey = `user:${id}`;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new Error(userMessages.deleteUserError);
    }

    await redis.del("users");
    await redis.del(cacheKey);
    return user;
  }

  // Get all users (Alt)
  async getAllUsersAlt(query) {
    const cacheKey = "usersAlt";
    const cachedUsers = await redis.get(cacheKey);

    if (cachedUsers) {
      console.log("Serving PostgreSQL users from cache...");
      return JSON.parse(cachedUsers);
    }

    const users = await UserDTO.findAll({ where: query });
    if (!users.length) {
      throw new Error(errorMessages.noUser);
    }

    await redis.set(cacheKey, JSON.stringify(users), "EX", 3600);
    return users;
  }

  // Get user by ID (Alt)
  async getUserAlt(id) {
    const cacheKey = `userAlt:${id}`;
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      console.log(`Serving PostgreSQL user ${id} from cache...`);
      return JSON.parse(cachedUser);
    }

    const user = await UserDTO.findByPk(id);
    if (!user) {
      throw new Error(userMessages.getUserError);
    }

    await redis.set(cacheKey, JSON.stringify(user), "EX", 3600);
    return user;
  }

  // Create user (Alt)
  async createUserAlt(data) {
    const { email, givenName, familyName } = data;

    if (
      !validator.isValidName(givenName) ||
      !validator.isValidName(familyName) ||
      !validator.isValidEmail(email)
    ) {
      throw new Error(userMessages.invalidInput);
    }

    const user = await UserDTO.create({ email, givenName, familyName });
    await redis.del("usersAlt");
    return user;
  }

  // Update user (Alt)
  async updateUserAlt(id, updates) {
    const cacheKey = `userAlt:${id}`;
    const [updatedRows, [updatedUser]] = await UserDTO.update(updates, {
      where: { id },
      returning: true,
    });

    if (!updatedRows) {
      throw new Error(userMessages.updateUserError);
    }

    await redis.del("usersAlt");
    await redis.del(cacheKey);
    return updatedUser;
  }

  // Delete user (Alt)
  async deleteUserAlt(id) {
    const cacheKey = `userAlt:${id}`;
    const deletedRows = await UserDTO.destroy({ where: { id } });

    if (!deletedRows) {
      throw new Error(userMessages.deleteUserError);
    }

    await redis.del("usersAlt");
    await redis.del(cacheKey);
  }
}

module.exports = new UserService();
