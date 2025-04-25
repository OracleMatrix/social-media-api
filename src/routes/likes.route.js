const express = require("express");
const router = express.Router();
const db = require("../models");
const auth = require("../middlewares/auth");

const likesController = require("../controllers/likes.controller");

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Endpoints for managing likes on posts
 */

router.use(auth);

/**
 * @swagger
 * /api/likes:
 *   get:
 *     summary: Get all likes
 *     tags: [Likes]
 *     responses:
 *       200:
 *         description: List of all likes
 *       401:
 *         description: Unauthorized
 */
router.get("/", likesController.getAllLikes);

/**
 * @swagger
 * /api/likes/post/{id}:
 *   get:
 *     summary: Get all likes for a specific post
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: List of likes for the specified post
 *       404:
 *         description: Post or likes not found
 *       401:
 *         description: Unauthorized
 */
router.get("/post/:id", likesController.getPostLikes);

/**
 * @swagger
 * /api/likes:
 *   post:
 *     summary: Add a like to a post
 *     tags: [Likes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - postId
 *             properties:
 *               userId:
 *                 type: integer
 *               postId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Like created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", likesController.createLike);

/**
 * @swagger
 * /api/likes/delete/{id}:
 *   delete:
 *     summary: Delete a like by ID
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the like to delete
 *     responses:
 *       200:
 *         description: Like deleted successfully
 *       404:
 *         description: Like not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/delete/:id", likesController.deleteLike);

module.exports = router;
