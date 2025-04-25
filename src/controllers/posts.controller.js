const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const db = require("../models");
const UserModel = db.users;
const PostModel = db.posts;

class PostController {
  async createPost(req, res) {
    try {
      const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        userId: Joi.number().required(),
      });
      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      // Check if user exists
      const existingUser = await UserModel.findOne({
        where: {
          id: req.body.userId,
        },
      });
      if (!existingUser)
        return res.status(400).send({ message: "User does not exist" });

      // Create new post
      const post = await PostModel.create({
        title: req.body.title,
        content: req.body.content,
        userId: req.body.userId,
      }).catch((err) => {
        return res.status(400).send({ message: err });
      });

      res.status(201).send({
        message: "Post created successfully",
        post: post,
      });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async getUserPosts(req, res) {
    try {
      const schema = Joi.object({
        userId: Joi.number().required(),
      });
      const { error } = schema.validate(req.params);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      // Check if user exists
      const existingUser = await UserModel.findOne({
        where: {
          id: req.params.userId,
        },
      });
      if (!existingUser)
        return res.status(400).send({ message: "User does not exist" });

      // Get user posts
      const posts = await PostModel.findAll({
        where: {
          userId: req.params.userId,
        },
        include: {
          model: UserModel,
          attributes: ["id", "name", "email"],
        },
      });

      res.status(200).send({
        message: "Posts retrieved successfully",
        totalPosts: posts.length,
        posts: posts,
      });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async getPostById(req, res) {
    try {
      const postId = req.params.postId;
      if (!postId)
        return res.status(400).send({ message: "Post ID is required" });

      // Get post by id
      const post = await PostModel.findOne({
        where: {
          id: postId,
        },
        include: [
          {
            model: UserModel,
            attributes: ["id", "name", "email"],
          },
          {
            model: db.comments,
            attributes: ["id", "content"],
            include: {
              model: UserModel,
              attributes: { exclude: ["password"] },
            },
          },
          {
            model: db.likes,
            attributes: ["id"],
            include: {
              model: UserModel,
              attributes: { exclude: ["password"] },
            },
          },
        ],
      });

      if (!post) return res.status(404).send({ message: "Post not found" });

      res.status(200).send({
        message: "Post retrieved successfully",
        post: post,
      });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async deletePost(req, res) {
    try {
      const postId = req.params.postId;
      if (!postId)
        return res.status(400).send({ message: "Post ID is required" });

      // Check if post exists
      const existingPost = await PostModel.findOne({
        where: {
          id: postId,
        },
      });
      if (!existingPost)
        return res.status(400).send({ message: "Post does not exist" });

      // Delete post
      await PostModel.destroy({
        where: {
          id: postId,
        },
      });

      res.status(200).send({
        message: "Post deleted successfully",
      });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async updatePost(req, res) {
    try {
      const postId = req.params.postId;
      if (!postId)
        return res.status(400).send({ message: "Post ID is required" });

      const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
      });
      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      // Check if post exists
      const existingPost = await PostModel.findOne({
        where: {
          id: postId,
        },
      });
      if (!existingPost)
        return res.status(400).send({ message: "Post does not exist" });

      // Update post
      await PostModel.update(req.body, {
        where: {
          id: postId,
        },
      });

      res.status(200).send({
        message: "Post updated successfully",
      });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async getAllPosts(req, res) {
    try {
      const posts = await PostModel.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: UserModel,
            attributes: { exclude: ["password"] },
          },
          {
            model: db.comments,
            attributes: ["id", "content"],
            include: {
              model: UserModel,
              attributes: { exclude: ["password"] },
            },
          },
          {
            model: db.likes,
            attributes: ["id"],
            include: {
              model: UserModel,
              attributes: { exclude: ["password"] },
            },
          },
        ],
      });

      res.status(200).send({
        message: "Posts retrieved successfully",
        totalPosts: posts.length,
        posts: posts,
      });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }
}

module.exports = new PostController();
