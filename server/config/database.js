// make connection to the mongoDB database
const mongoose = require("mongoose");
const config = require("./config")[process.env.NODE_ENV || "development"];
mongoose.Promise = global.Promise;

module.exports = {
  initializeDB: () => {
    mongoose.connect(
      config.db,
      { useNewUrlParser: true }
    );

    let db = mongoose.connection;
    db.once("open", err => {
      if (err) {
        console.log(err);
      }
      console.log(`User Management database is ready!`);
    });

    db.on("error", err => console.log("Database error: " + err));

    require("../models/User");
  }
};
