// controller about users
const constants = require("../config/constants");
let User = require("../models/User");
const {
  getAllUsersError,
  getCreateUserSuccess,
  getCreateUserError,
  getUserError,
  updateUserSuccess,
  updateUserError,
  deleteUserSuccess,
  deleteUserError
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
    User.create(user)
      .then(user => {
        res.json({ user, message: getCreateUserSuccess });
      })
      .catch(err => {
        res.status(500).json({ message: getCreateUserError });
      });
  },

  // retrieve user by id
  getUser: (req, res) => {
    User.findById(req.params.id)
      .then(user => {
        res.json({ user });
      })
      .catch(err => {
        res.status(err.statusCode || 500).json({ message: getUserError });
      });
  },

  // update properties of the user
  updateUser: (req, res) => {
    let { body: user } = req;
    let { id } = req.params;
    User.findByIdAndUpdate(id, { $set: user }, { new: true })
      .exec()
      .then(user => {
        res.json({ user, message: updateUserSuccess });
      })
      .catch(err => {
        res.status(err.statusCode || 500).json({ message: updateUserError });
      });
  },

  // delete user
  deleteUser: (req, res) => {
    User.findByIdAndRemove(req.params.id)
      .then(user => {
        res.json({ user, message: deleteUserSuccess });
      })
      .catch(err => {
        res.status(err.statusCode || 500).json({ message: deleteUserError });
      });
  }
};
