import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  getUsersByWilayah,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id_user", getUserById);
router.get("/users/wilayah/:id_wilayah", getUsersByWilayah);
router.post("/users", createUser);
router.patch("/users/:id_user", updateUser);
router.delete("/users/:id_user", deleteUser);

export default router;
