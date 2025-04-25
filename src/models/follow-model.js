const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class FollowModel extends Model {
    static associate(models) {
      FollowModel.belongsTo(models.users, {
        foreignKey: "followerId",
        as: "follower",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      FollowModel.belongsTo(models.users, {
        foreignKey: "followingId",
        as: "following",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  FollowModel.init(
    {
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
    },
    {
      sequelize,
      modelName: "follow",
    }
  );
  return FollowModel;
};
