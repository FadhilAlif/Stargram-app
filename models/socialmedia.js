'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SocialMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User)
    }
  }
  SocialMedia.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "name cannot be null/ omitted"
        },
        notEmpty: {
          msg: "name cannot be an emty string"
        }
    },
    },
    social_media_url: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "social_media_url be null/ omitted"
        },
        notEmpty: {
          msg: "social_media_url be an emty string"
        }
    },
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SocialMedia',
  });
  return SocialMedia;
};