//index file of the project
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const database = require("./server/config/database");
const db = require("./server/config/db");
const routes = require("./server/config/routes");
const config = require("./server/config/config")[
  process.env.NODE_ENV || "development"
];

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
database.initializeDB();
db.connectDB();
routes.getRoutes(app);

app.listen(config.port, () =>
  console.log(`User Management app listening on port ${config.port}!`)
);

module.exports = app;
