const Joi = require("joi");
const db = require("../models");
const UserModel = db.users;
const PostModel = db.posts;
const path = require("path");
const fs = require("fs");

class PostController {
    async createPost(req, res) {
        try {
            const schema = Joi.object({
                title: Joi.string().required(),
                content: Joi.string().required(),
                userId: Joi.number().required(),
            });
            const {error} = schema.validate(req.body);
            if (error)
                return res.status(400).send({message: error.details[0].message});

            // Check if user exists
            const existingUser = await UserModel.findOne({
                where: {
                    id: req.body.userId,
                },
            });
            if (!existingUser)
                return res.status(400).send({message: "User does not exist"});

            // Create new post
            const post = await PostModel.create({
                title: req.body.title,
                content: req.body.content,
                userId: req.body.userId,
            }).catch((err) => {
                return res.status(400).send({message: err});
            });

            res.status(201).send({
                message: "Post created successfully",
                post: post,
            });
        } catch (error) {
            res.status(500).send({message: `Internal Server ${error}`});
        }
    }

    async getPostById(req, res) {
        try {
            const postId = req.params.postId;
            if (!postId)
                return res.status(400).send({message: "Post ID is required"});

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
                            attributes: {exclude: ["password"]},
                        },
                    },
                    {
                        model: db.likes,
                        attributes: ["id"],
                        include: {
                            model: UserModel,
                            attributes: {exclude: ["password"]},
                        },
                    },
                ],
            });

            if (!post) return res.status(404).send({message: "Post not found"});

            res.status(200).send({
                message: "Post retrieved successfully",
                post: post,
            });
        } catch (error) {
            res.status(500).send({message: `Internal Server ${error}`});
        }
    }

    async deletePost(req, res) {
        try {
            const postId = req.params.postId;
            if (!postId)
                return res.status(400).send({message: "Post ID is required"});

            // Check if post exists
            const existingPost = await PostModel.findOne({
                where: {
                    id: postId,
                },
            });
            if (!existingPost)
                return res.status(400).send({message: "Post does not exist"});

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
            res.status(500).send({message: `Internal Server ${error}`});
        }
    }

    async updatePost(req, res) {
        try {
            const postId = req.params.postId;
            if (!postId)
                return res.status(400).send({message: "Post ID is required"});

            const schema = Joi.object({
                title: Joi.string().required(),
                content: Joi.string().required(),
            });
            const {error} = schema.validate(req.body);
            if (error)
                return res.status(400).send({message: error.details[0].message});

            // Check if post exists
            const existingPost = await PostModel.findOne({
                where: {
                    id: postId,
                },
            });
            if (!existingPost)
                return res.status(400).send({message: "Post does not exist"});

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
            res.status(500).send({message: `Internal Server ${error}`});
        }
    }

    async getAllPosts(req, res) {
        try {
            const userId = req.params.userId;
            if (!userId)
                return res.status(400).send({message: "User ID is required"});

            const userExists = await UserModel.findOne({
                where: {
                    id: userId,
                },
            });

            if (!userExists)
                return res.status(404).send({message: "User not found"});

            // Find all users followed by the user
            const followedUsers = await db.follow.findAll({
                where: {followerId: userId},
                attributes: ["followingId"],
            });

            const followedUserIds = followedUsers.map((follow) => follow.followingId);

            // Get posts only from followed users
            const posts = await PostModel.findAll({
                where: {
                    userId: followedUserIds.length > 0 ? followedUserIds : null,
                },
                order: [["createdAt", "DESC"]],
                include: [
                    {
                        model: UserModel,
                        attributes: {exclude: ["password"]},
                    },
                    {
                        model: db.comments,
                        attributes: ["id", "content"],
                        include: {
                            model: UserModel,
                            attributes: {exclude: ["password"]},
                        },
                    },
                    {
                        model: db.likes,
                        attributes: ["id"],
                        include: {
                            model: UserModel,
                            attributes: {exclude: ["password"]},
                        },
                    },
                ],
            }).catch((err) => {
                return res.status(400).send({message: err});
            });

            res.status(200).send({
                message: "Posts retrieved successfully",
                totalPosts: posts.length,
                posts: posts,
            });
        } catch (error) {
            res.status(500).send({message: `Internal Server ${error}`});
        }
    }

    async uploadPostPicture(req, res) {
        try {
            if (!req.file) {
                return res.status(400).send({message: "postPicture is required"});
            }

            const {postId} = req.params;
            if (!postId) {
                return res.status(400).send({message: "Post ID is required"});
            }

            const post = await PostModel.findByPk(postId);
            if (!post) {
                return res.status(404).send({message: "Post not found"});
            }

            await PostModel.update(
                {postPicture: req.file.filename},
                {where: {id: postId}}
            );

            res.status(200).send({
                message: "Post picture uploaded successfully",
                file: req.file,
            });
        } catch (error) {
            res.status(500).send({message: "Internal Server Error", error: error.message});
        }
    }

    async sendPostPicture(req, res) {
        try {
            const {postId} = req.params;
            if (!postId) {
                return res.status(400).send({message: "Post ID is required"});
            }

            const post = await PostModel.findByPk(postId);
            if (!post) {
                return res.status(404).send({message: "Post not found"});
            }

            if (!post.postPicture) {
                return res.status(400).send({message: "Post does not have a postPicture"});
            }

            const filePath = path.join(__dirname, '..', '..', 'uploads', post.postPicture);
            if (!fs.existsSync(filePath)) {
                return res.status(404).send({message: "Post picture file not found"});
            }

            res.status(200).sendFile(filePath);
        } catch (error) {
            res.status(500).send({message: "Internal Server Error", error: error.message});
        }
    }

}

module.exports = new PostController();
