'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User)
      this.belongsTo(models.Photo)
    }
  }
  Comment.init({
    UserId: DataTypes.INTEGER,
    PhotoId: DataTypes.INTEGER,
    comment: {
      type:DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "comment cannot be null/ omitted"
        },
        notEmpty: {
          msg: "comment cannot be an emty string"
        }
    },
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};