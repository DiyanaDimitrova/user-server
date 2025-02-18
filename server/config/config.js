// config file of the project
const path = require("path");

const rootPath = path.normalize(path.join(__dirname, "/../../"));
const user = "TestUser";
const password = "Test1234";
const db = "Cluster0";

module.exports = {
  development: {
    rootPath: rootPath,
    db: `mongodb+srv://${user}:${password}@cluster0.j5yds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    port: 3001,
  },
  test: {
    rootPath: rootPath,
    db: `mongodb+srv://${user}:${password}@cluster0.j5yds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
    port: 3002,
  },
  production: {
    rootPath: rootPath,
    db: `mongodb+srv://${user}:${password}@cluster0.j5yds.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
`,
    port: process.env.PORT,
  },
};
