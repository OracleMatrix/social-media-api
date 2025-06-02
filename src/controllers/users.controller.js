const jwt = require("jsonwebtoken");
const Joi = require("joi");
const _ = require("lodash");
const db = require("../models");
const UserModel = db.users;
const { Op } = require("sequelize");

class UserController {
  async registerUser(req, res) {
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });
      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findOne({
        where: {
          email,
        },
      });
      if (existingUser)
        return res.status(400).send({ message: "User already exists" });

      // Create new user
      const user = await UserModel.create({
        name: name,
        email: email,
        password: password,
      }).catch((err) => {
        return res.status(400).send({ message: err.errors[0].message });
      });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
      const userData = _.pick(user, ["id", "name", "email"]);
      res.status(201).send({
        message: "User registered successfully",
        user: userData,
        token: token,
      });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async loginUser(req, res) {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });
      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const { email, password } = req.body;

      // Check if user exists
      const user = await UserModel.findOne({
        where: {
          email,
        },
      });
      if (!user) return res.status(400).send({ message: "User not found" });

      // Check password
      const isMatch = await user.comparePssword(password);
      if (!isMatch)
        return res.status(400).send({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
      const userData = _.pick(user, ["id", "name", "email"]);
      res.status(200).json({
        message: "User logged in successfully",
        user: userData,
        token: token,
      });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      if (!userId)
        return res.status(400).send({ message: "User ID is required" });

      const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string(),
      });
      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const { name, email, password } = req.body;

      // Check if user exists
      const user = await UserModel.findByPk(userId);
      if (!user) return res.status(400).send({ message: "User not found" });

      // Update user
      await UserModel.update(
        {
          name: name,
          email: email,
          password: password,
        },
        { where: { id: userId } }
      );
      res.status(200).send({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async deleteUser(req, res) {
    try {
      // Check if user exists
      const user = await UserModel.findByPk(req.params.id);
      if (!user) return res.status(400).send({ message: "User not found" });

      // Delete user
      await UserModel.destroy({ where: { id: req.params.id } });
      res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserModel.findAll({
        attributes: { exclude: ["password"] },
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }
  async getUserById(req, res) {
    try {
      const user = await UserModel.findByPk(req.params.id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: db.posts,
            include: [
              {
                model: db.comments,
              },
              {
                model: db.likes,
              },
            ],
          },
          {
            model: db.follow,
            as: "follower",
            include: [
              {
                model: db.users,
                as: "following",
                attributes: { exclude: ["password"] },
              },
            ],
          },
          {
            model: db.follow,
            as: "following",
            include: [
              {
                model: db.users,
                as: "follower",
                attributes: { exclude: ["password"] },
              },
            ],
          },
        ],
      });
      if (!user) return res.status(400).send({ message: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }
  async getUserByEmail(req, res) {
    try {
      const user = await UserModel.findOne({
        where: { email: req.params.email },
        attributes: { exclude: ["password"] },
      });
      if (!user) return res.status(400).send({ message: "User not found" });
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }
  async getUserByName(req, res) {
    try {
      const user = await UserModel.findOne({
        where: { name: req.params.name },
        attributes: { exclude: ["password"] },
      });
      if (!user) return res.status(400).send({ message: "User not found" });
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async searchUserByEmail(req, res) {
    try {
      const { email } = req.query;

      if (!email) {
        return res
          .status(400)
          .send({ message: "Email query parameter is required" });
      }

      const users = await UserModel.findAll({
        where: {
          email: {
            [Op.like]: `%${email}%`, // Partial matching
          },
        },
        attributes: { exclude: ["password"] },
      });

      if (!users.length) {
        return res.status(404).send({ message: "No users found" });
      }

      res.status(200).send(users);
    } catch (error) {
      res.status(500).send({ message: `Internal Server ${error}` });
    }
  }

  async setProfile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).send({ message: "profilePicture is required" });
      }

      if (!req.params.userId) {
        return res.status(400).send({ message: "User ID is required" });
      }

      const user = await UserModel.findByPk(req.params.userId);
      if (!user) return res.status(404).send({ message: "User does not exist" });

      // Optional: Save filename in DB
      await UserModel.update(
          { profilePicture: req.file.filename },
          { where: { id: req.params.userId } }
      );

      res.status(200).send({
        message: "Profile picture uploaded successfully",
        file: req.file,
      });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
  }

}

module.exports = new UserController();
