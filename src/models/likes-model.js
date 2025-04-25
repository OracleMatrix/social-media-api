const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class LikesModel extends Model {
    static associate(models) {
      LikesModel.belongsTo(models.users, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      LikesModel.belongsTo(models.posts, {
        foreignKey: "postId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  LikesModel.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      postId: {
        type: DataTypes.INTEGER,
        references: {
          model: "posts",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "likes",
    }
  );
  return LikesModel;
};
