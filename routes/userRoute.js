import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  getUsersByWilayah,
  updateUser,
  deleteUser,
  getWilayahStats
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

/**
 * @api {get} /users Request All Users
 * @apiName GetUsers
 * @apiGroup User
 */
router.get("/users", getUsers);

/**
 * @api {get} /users/:id_user Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id_user User's unique ID.
 */
router.get("/users/:id_user", getUserById);

/**
 * @api {get} /users/wilayah/:id_wilayah Request Users by Wilayah
 * @apiName GetUsersByWilayah
 * @apiGroup User
 *
 * @apiParam {Number} id_wilayah Wilayah's unique ID.
 */
router.get("/users/wilayah/:id_wilayah", getUsersByWilayah);

/**
 * @api {get} /wilayah-stats Request Wilayah Stats
 * @apiName GetWilayahStats
 * @apiGroup User
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 */
router.get("/wilayah-stats", authenticate, getWilayahStats);

/**
 * @api {post} /users Create a new User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} username User's username.
 * @apiParam {String} password User's password.
 * @apiParam {String} email User's email.
 * @apiParam {Number} age User's age.
 * @apiParam {String} role User's role.
 * @apiParam {Number} id_wilayah User's wilayah ID.
 */
router.post("/users", createUser);

/**
 * @api {patch} /users/:id_user Update User information
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {Number} id_user User's unique ID.
 */
router.patch("/users/:id_user", updateUser);

/**
 * @api {delete} /users/:id_user Delete a User
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {Number} id_user User's unique ID.
 */
router.delete("/users/:id_user", deleteUser);

export default router;