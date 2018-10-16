// controller about users
const constants = require("../config/constants");
const validator = require("../utils/validator");

let User = require("../models/User");
const {
  getAllUsersError,
  getCreateUserSuccess,
  getCreateUserError,
  getUserError,
  updateUserSuccess,
  updateUserError,
  deleteUserSuccess,
  deleteUserError,
  invalidInput
} = constants;

module.exports = {
  // retrieve all users
  getAllUsers: (req, res) => {
    User.find(req.query)
      .then(users => {
        if (users.length === 0) {
          throw new Error("No user Found");
        }
        res.json({ users: users });
      })
      .catch(err => {
        res.status(500).json({ message: getAllUsersError });
      });
  },

  // create user
  createUser: (req, res) => {
    let { body: user } = req;
    const { email, givenName, familyName } = user;
    if (
      validator.isValidName(givenName) &&
      validator.isValidName(familyName) &&
      validator.isValidEmail(email)
    ) {
      User.create(user)
        .then(user => {
          res.json({ user, message: getCreateUserSuccess });
        })
        .catch(err => {
          res.status(500).json({ message: getCreateUserError });
        });
    } else {
      res.status(500).json({ message: invalidInput });
    }
  },

  // retrieve user by id
  getUser: (req, res) => {
    const { id } = req.params;
    if (id) {
      User.findById(req.params.id)
        .then(user => {
          res.json({ user });
        })
        .catch(err => {
          res.status(err.statusCode || 500).json({ message: getUserError });
        });
    } else {
      res.status(500).json({ message: invalidInput });
    }
  },

  // update properties of the user
  updateUser: (req, res) => {
    let { body: user } = req;
    let { id } = req.params;
    if (id && user) {
      User.findByIdAndUpdate(id, { $set: user }, { new: true })
        .exec()
        .then(user => {
          res.json({ user, message: updateUserSuccess });
        })
        .catch(err => {
          res.status(err.statusCode || 500).json({ message: updateUserError });
        });
    } else {
      res.status(500).json({ message: invalidInput });
    }
  },

  // delete user
  deleteUser: (req, res) => {
    const { id } = req.params;
    if (id) {
      User.findByIdAndRemove(req.params.id)
        .then(user => {
          res.json({ user, message: deleteUserSuccess });
        })
        .catch(err => {
          res.status(err.statusCode || 500).json({ message: deleteUserError });
        });
    } else {
      res.status(500).json({ message: invalidInput });
    }
  }
};
