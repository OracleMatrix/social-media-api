const jwt = require("jsonwebtoken");
const Joi = require("joi");
const _ = require("lodash");
const db = require("../models");

const CommentModel = db.comments;
const PostModel = db.posts;
const UserModel = db.users;

class CommentController {
  async createComment(req, res) {
    try {
      const validateCommentSchema = Joi.object({
        content: Joi.string().required(),
        postId: Joi.number().required(),
        userId: Joi.number().required(),
      });
      const { err } = validateCommentSchema.validate(req.body);
      if (err)
        return res.status(400).send({ message: error.details[0].message });
      const { content, postId, userId } = req.body;
      const user = await UserModel.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      const post = await PostModel.findByPk(postId);
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }
      const schema = Joi.object({
        content: Joi.string().required(),
        postId: Joi.number().required(),
        userId: Joi.number().required(),
      });
      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      const comment = await CommentModel.create({
        content,
        userId,
        postId,
      }).catch((err) => {
        return res.status(400).send({ message: err });
      });
      const commentData = await CommentModel.findOne({
        where: { id: comment.id },
        include: [
          {
            model: UserModel,
            attributes: { exclude: ["password"] },
          },
          {
            model: PostModel,
          },
        ],
      });
      res.status(201).send({
        message: "Comment created successfully",
        comment: commentData,
      });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async getCommentsByPostId(req, res) {
    try {
      const postId = req.params.postId;
      if (!postId)
        return res.status(400).send({ message: `Post ID is required` });

      const postExists = await PostModel.findOne({
        where: { id: postId },
      });
      if (!postExists)
        return res.status(400).send({ message: `Post not found` });

      const comments = await CommentModel.findAll({
        where: { postId },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: UserModel,
            attributes: { exclude: ["password"] },
          },
          {
            model: PostModel,
          },
        ],
      });
      return res.status(200).send({
        message: "Comments retrieved successfully",
        numberOfComments: comments.length,
        comments,
      });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async getAllComments(req, res) {
    try {
      const comments = await CommentModel.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: UserModel,
            attributes: { exclude: ["password"] },
          },
          {
            model: PostModel,
          },
        ],
      });
      return res.status(200).send({
        message: "Comments retrieved successfully",
        numberOfComments: comments.length,
        comments,
      });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }
}

module.exports = new CommentController();
