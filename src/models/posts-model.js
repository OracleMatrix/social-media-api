const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class PostModel extends Model {
    static associate(models) {
      PostModel.belongsTo(models.users, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      PostModel.hasMany(models.comments, {
        foreignKey: "postId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      PostModel.hasMany(models.likes, {
        foreignKey: "postId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  PostModel.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
    },
    {
      sequelize,
      modelName: "posts",
    }
  );
  return PostModel;
};
