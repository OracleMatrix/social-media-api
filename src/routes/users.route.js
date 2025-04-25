const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const usersController = require("../controllers/users.controller");

router.use(auth);

/**
 * @swagger
 * /api/users/update/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put("/update/:id", usersController.updateUser);

/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/delete/:id", usersController.deleteUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", usersController.getAllUsers);

/**
 * @swagger
 * /api/users/getUserById/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/getUserById/:id", usersController.getUserById);

/**
 * @swagger
 * /api/users/getUserByEmail/{email}:
 *   get:
 *     summary: Get a user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: User email
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/getUserByEmail/:email", usersController.getUserByEmail);

/**
 * @swagger
 * /api/users/getUserByName/{name}:
 *   get:
 *     summary: Get a user by name
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: User name
 *     responses:
 *       200:
 *         description: User(s) found
 *       404:
 *         description: No users found with that name
 */
router.get("/getUserByName/:name", usersController.getUserByName);

module.exports = router;
