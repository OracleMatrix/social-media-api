const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const postsController = require("../controllers/posts.controller");

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints for managing posts
 */

router.use(auth);

/**
 * @swagger
 * /api/posts/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/create", postsController.createPost);

/**
 * @swagger
 * /api/posts/getUserPosts/{userId}:
 *   get:
 *     summary: Get all posts by a specific user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of user's posts
 *       404:
 *         description: User or posts not found
 */
router.get("/user/:userId", postsController.getUserPosts);

/**
 * @swagger
 * /api/posts/getPostById/{postId}:
 *   get:
 *     summary: Get a post by its ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 */
router.get("/post/:postId", postsController.getPostById);

/**
 * @swagger
 * /api/posts/delete/{postId}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete("/delete/:postId", postsController.deletePost);

/**
 * @swagger
 * /api/posts/update/{postId}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 */
router.put("/update/:postId", postsController.updatePost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 */
router.get("/", postsController.getAllPosts);

module.exports = router;
