// config file of the project
const path = require("path");

let rootPath = path.normalize(path.join(__dirname, "/../../"));
const user = "he_user";
const password = "he_user1234";

module.exports = {
  development: {
    rootPath: rootPath,
    db: "mongodb://didi:didi@ds243805.mlab.com:43805/rise-art",
    port: 3001
  },
  test: {
    rootPath: rootPath,
    db: `mongodb://${user}:${password}@ds231643.mlab.com:31643/he-test`,
    port: 3001
  },
  production: {
    rootPath: rootPath,
    db: "mongodb://didi:didi@ds243805.mlab.com:43805/rise-art",
    port: 3001
  }
};
