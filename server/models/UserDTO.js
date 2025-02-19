const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const UserDTO = sequelize.define("User", {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  givenName: { type: DataTypes.STRING, allowNull: false },
  familyName: { type: DataTypes.STRING, allowNull: false },
});

module.exports = { UserDTO };
