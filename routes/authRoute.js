import express from 'express';
import { login } from '../controllers/authController.js';

const router = express.Router();

/**
 * @api {post} /login Authenticate a User
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiParam {String} username User's username.
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {String} token JWT token for authenticated user.
 *
 * @apiError {String} 400 Incorrect username or password.
 * @apiError {String} 500 An error occurred on the server.
 */
router.post('/login', login);

export default router;