// make connection to the mongoDB database
const mongoose = require("mongoose");
const config = require("./config")[process.env.NODE_ENV || "development"];
mongoose.Promise = global.Promise;

module.exports = {
  initializeDB: () => {
    mongoose.set("useFindAndModify", false);
    mongoose.connect(
      config.db,
      { useNewUrlParser: true, useFindAndModify: false }
    );

    let db = mongoose.connection;
    db.once("open", err => {
      if (err) {
        console.log(err);
      }
      console.log(`Holiday Extras MongoDB is ready `);
    });

    db.on("error", err => console.log("Database error: " + err));

    require("../models/User");
  }
};
