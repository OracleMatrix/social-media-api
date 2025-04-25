const jwt = require("jsonwebtoken");
const Joi = require("joi");
const db = require("../models");
const Likes = db.likes;
const Posts = db.posts;
const Users = db.users;
const _ = require("lodash");

class LikesController {
  async createLike(req, res) {
    const schema = Joi.object({
      userId: Joi.number().required(),
      postId: Joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const postId = req.body.postId;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      const postExists = await Posts.findByPk(postId);
      if (!postExists) {
        return res.status(404).json({ message: "Post not found" });
      }
      const userExists = await Users.findByPk(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }
      const alreadyLiked = await Likes.findOne({
        where: { userId, postId },
      });

      if (alreadyLiked) {
        return res
          .status(400)
          .json({ message: "You have already liked this post" });
      }
      const like = await Likes.create({ userId, postId }).catch((err) => {
        return res.status(500).json({ message: err.message });
      });
      return res.status(201).json({
        message: "Post liked successfully",
        like,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getPostLikes(req, res) {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    try {
      const likes = await Likes.findAll({
        where: { postId },
        include: [
          {
            model: Users,
            attributes: { exclude: ["password"] },
          },
        ],
      });
      res.status(200).json({
        message: "Likes retrieved successfully",
        totalLikes: likes.length,
        likes: likes,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllLikes(req, res) {
    try {
      const likes = await Likes.findAll({
        include: [
          {
            model: Users,
            attributes: { exclude: ["password"] },
          },
          {
            model: Posts,
          },
        ],
      });
      res.status(200).json({
        message: "Likes retrieved successfully",
        totalLikes: likes.length,
        likes: likes,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteLike(req, res) {
    const likeId = req.params.id;
    if (!likeId) {
      return res.status(400).json({ message: "Like ID is required" });
    }

    try {
      const like = await Likes.findByPk(likeId);
      if (!like) {
        return res.status(404).json({ message: "Like not found" });
      }
      await like.destroy();
      res.status(200).json({ message: "Like deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new LikesController();
