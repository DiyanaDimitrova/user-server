const { userMessages } = require("../config/constants");
const userService = require("../services/user");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers(req.query);
      res.json({ users });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await userService.getUser(req.params.id);
      res.json({ user });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({ user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json({ user });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      await userService.deleteUser(req.params.id);
      res.json({ message: userMessages.deleteUserSuccess });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getAllUsersAlt: async (req, res) => {
    try {
      const users = await userService.getAllUsersAlt(req.query);
      res.json({ users });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getUserAlt: async (req, res) => {
    try {
      const user = await userService.getUserAlt(req.params.id);
      res.json({ user });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  createUserAlt: async (req, res) => {
    try {
      const user = await userService.createUserAlt(req.body);
      res.status(201).json({ user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateUserAlt: async (req, res) => {
    try {
      const user = await userService.updateUserAlt(req.params.id, req.body);
      res.json({ user });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  deleteUserAlt: async (req, res) => {
    try {
      await userService.deleteUserAlt(req.params.id);
      res.json({ message: userMessages.deleteUserSuccess });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};
