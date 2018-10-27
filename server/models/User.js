// model of the User collection
const mongoose = require("mongoose");

// shema of the user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  givenName: { type: String, required: true },
  familyName: { type: String, required: true },
  created: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
