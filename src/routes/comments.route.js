const express = require("express");
const router = express.Router();
const db = require("../models");
const auth = require("../middlewares/auth");
const commentsController = require("../controllers/comments.controller");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Endpoints for managing comments on posts
 */

router.use(auth);

/**
 * @swagger
 * /api/comments/create:
 *   post:
 *     summary: Create a new comment on a post
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *               - userId
 *             properties:
 *               content:
 *                 type: string
 *               postId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/create", commentsController.createComment);

/**
 * @swagger
 * /api/comments/post/{postId}:
 *   get:
 *     summary: Get all comments for a specific post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: List of comments for the specified post
 *       404:
 *         description: Post or comments not found
 *       401:
 *         description: Unauthorized
 */
router.get("/post/:postId", commentsController.getCommentsByPostId);

/**
 * @swagger
 * /api/comments/
 *  get:
 *  summary: Get all comments
 * tags: [Comments]
 * responses:
 * 200:
 * description: List of all comments
 * 401:
 * description: Unauthorized
 */
router.get("/", commentsController.getAllComments);

module.exports = router;
