const constants = require("../config/constants");
const validator = require("../utils/validator");
const { User } = require("../models/User");

const { routes, userMessages, errorMessages } = constants;

module.exports = {
  // Retrieve all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find(req.query);
      if (!users.length) {
        return res.status(404).json({ message: errorMessages.noUser });
      }
      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: errorMessages.getAllUsersError });
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
      res
        .status(201)
        .json({ user, message: userMessages.getCreateUserSuccess });
    } catch (error) {
      res.status(500).json({ message: userMessages.getCreateUserError });
    }
  },

  // Retrieve user by ID
  getUser: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: userMessages.invalidInput });
    }

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: userMessages.getUserError });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: userMessages.getUserError });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
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
      res.json({ user, message: userMessages.updateUserSuccess });
    } catch (error) {
      res.status(500).json({ message: userMessages.updateUserError });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: userMessages.invalidInput });
    }

    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: userMessages.deleteUserError });
      }
      res.json({ user, message: userMessages.deleteUserSuccess });
    } catch (error) {
      res.status(500).json({ message: userMessages.deleteUserError });
    }
  },
};
