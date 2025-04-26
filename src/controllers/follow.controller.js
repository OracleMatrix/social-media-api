const Joi = require("joi");

const db = require("../models");
const FollowModel = db.follow;
const UserModel = db.users;

class FollowController {
  async followUser(req, res) {
    const { followerId, followingId } = req.body;

    const schema = Joi.object({
      followerId: Joi.number().required(),
      followingId: Joi.number().required(),
    });

    const { error } = schema.validate({ followerId, followingId });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the user is trying to follow themselves
    if (followerId === followingId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    // Check if the user is already following
    const existingFollow = await FollowModel.findOne({
      where: {
        followerId,
        followingId,
      },
    });
    if (existingFollow) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // check ids exist
    const follower = await UserModel.findByPk(followerId);
    const following = await UserModel.findByPk(followingId);
    if (!follower || !following) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      const follow = await FollowModel.create({
        followerId,
        followingId,
        include: [
          {
            model: UserModel,
            as: "follower",
            attributes: { exclude: ["password"] },
          },
          {
            model: UserModel,
            as: "following",
            attributes: { exclude: ["password"] },
          },
        ],
      });
      return res.status(201).json(follow);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error following user", error: err.message });
    }
  }

  async unfollowUser(req, res) {
    const { followerId, followingId } = req.params;

    if (!followerId || !followingId) return res.status(400).send({ message: "Both follower ID and following ID is required" });

    // Check if the user is not following
    const existingFollow = await FollowModel.findOne({
      where: {
        followerId,
        followingId,
      },
    });
    if (!existingFollow) {
      return res.status(400).json({ message: "Not following this user" });
    }
    // check ids exist
    const follower = await UserModel.findByPk(followerId);
    const following = await UserModel.findByPk(followingId);
    if (!follower || !following) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      const unfollow = await FollowModel.destroy({
        where: {
          followerId,
          followingId,
        },
      });
      if (!unfollow) {
        return res.status(404).json({ message: "Follow not found" });
      }
      return res.status(200).json({ message: "Unfollowed successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error unfollowing user", error: err.message });
    }
  }
  async getFollowers(req, res) {
    const { userId } = req.params;

    try {
      // Check if the user exists
      const user = await UserModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const followers = await FollowModel.findAll({
        where: { followerId: userId },
        include: [
          {
            model: UserModel,
            as: "follower",
            attributes: { exclude: ["password"] },
          },
        ],
      });
      return res.status(200).json({
        message: "Followers fetched successfully",
        success: true,
        followers,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error fetching followers", error: err.message });
    }
  }
  async getFollowing(req, res) {
    const { userId } = req.params;

    try {
      // Check if the user exists
      const user = await UserModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const following = await FollowModel.findAll({
        where: { followingId: userId },
        include: [
          {
            model: UserModel,
            as: "following",
            attributes: { exclude: ["password"] },
          },
        ],
      });
      return res
        .status(200)
        .json({
          message: "Following fetched successfully",
          success: true,
          following,
        });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error fetching following", error: err.message });
    }
  }
}

module.exports = new FollowController();
