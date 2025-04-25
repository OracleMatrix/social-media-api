const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class UserModel extends Model {
    static associate(models) {
      UserModel.hasMany(models.posts, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      UserModel.hasMany(models.comments, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      UserModel.hasMany(models.likes, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      UserModel.hasMany(models.follow, {
        foreignKey: "followerId",
        as: "follower",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      UserModel.hasMany(models.follow, {
        foreignKey: "followingId",
        as: "following",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
    async comparePssword(password) {
      const bcrypt = require("bcrypt");
      return await bcrypt.compare(password, this.password);
    }
  }

  UserModel.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlphanumeric: true,
          len: [6, 20],
        },
      },
    },
    {
      sequelize,
      modelName: "users",
      hooks: {
        beforeCreate: async (user) => {
          const bcrypt = require("bcrypt");
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        },
      },
    }
  );
  return UserModel;
};
