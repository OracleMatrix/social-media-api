const router = require("express").Router();
const FollowController = require("../controllers/follow.controller");
const auth = require("../middlewares/auth");

// use auth for routes and requests
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: Follow and unfollow users
 */

/**
 * @swagger
 * /api/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Follow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - followerId
 *               - followingId
 *             properties:
 *               followerId:
 *                 type: integer
 *                 example: 1
 *               followingId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Successfully followed the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followerId:
 *                   type: integer
 *                 followingId:
 *                   type: integer
 *       400:
 *         description: Bad request (validation error or already following)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Already following this user
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error while following user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error following user
 */

/**
 * @swagger
 * /api/follow/unfollow:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Follow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - followerId
 *               - followingId
 *             properties:
 *               followerId:
 *                 type: integer
 *                 example: 1
 *               followingId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Successfully unfollowed the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unfollowed successfully
 *       400:
 *         description: Bad request (validation error or not following)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not following this user
 *       404:
 *         description: User or follow not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error while unfollowing user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error unfollowing user
 */

/**
 * @swagger
 * /api/follow/followers/{userId}:
 *   get:
 *     summary: Get followers of a user
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to get followers for
 *     responses:
 *       200:
 *         description: List of followers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   followerId:
 *                     type: integer
 *                   followingId:
 *                     type: integer
 *                   follower:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error while fetching followers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching followers
 */

/**
 * @swagger
 * /api/follow/following/{userId}:
 *   get:
 *     summary: Get users followed by a user
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to get following list for
 *     responses:
 *       200:
 *         description: List of users being followed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   followerId:
 *                     type: integer
 *                   followingId:
 *                     type: integer
 *                   following:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error while fetching following
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching following
 */

router.post("/", FollowController.followUser);
router.delete("/unfollow", FollowController.unfollowUser);
router.get("/followers/:userId", FollowController.getFollowers);
router.get("/following/:userId", FollowController.getFollowing);

module.exports = router;
