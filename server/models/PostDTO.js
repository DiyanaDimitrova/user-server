const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const PostDTO = sequelize.define("Post", {
  image: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  titleUrl: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  authorUrl: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL array type
    allowNull: false,
    defaultValue: [],
  },
});

module.exports = { PostDTO };
