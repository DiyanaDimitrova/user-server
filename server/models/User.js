// model of the User collection
const mongoose = require("mongoose");

// shema of the user
let userSchema = mongoose.Schema({
  email: { type: String, required: true },
  givenName: { type: String, required: true },
  familyName: { type: String, required: true },
  created: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
