const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class CommentsModel extends Model {
    static associate(models) {
      CommentsModel.belongsTo(models.users, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      CommentsModel.belongsTo(models.posts, {
        foreignKey: "postId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  CommentsModel.init(
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
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "comments",
    }
  );

  return CommentsModel;
};
