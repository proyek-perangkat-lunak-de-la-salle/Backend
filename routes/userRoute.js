import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  getUsersByWilayah,
  updateUser,
  deleteUser,
  getWilayahStats,
  getAllWilayah,
  getSortedWilayahStats,
  getClusterStatsByWilayah,
  getDetectionResultsByWilayah
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

const checkAdminRole = (req, res, next) => {
  if (req.user.role === 'Admin Wilayah' || req.user.role === 'Admin Paroki') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. You do not have permission to access this resource." });
  }
};

const checkAdminParokiRole = (req, res, next) => {
  if (req.user.role === 'Admin Paroki') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. You do not have permission to access this resource." });
  }
};
const checkAdminWilayahRole = (req, res, next) => {
  if (req.user.role === 'Admin Wilayah') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. You do not have permission to access this resource." });
  }
};

router.get("/users", getUsers);
router.get("/users/:id_user", getUserById);
router.get("/users/wilayah/:id_wilayah", getUsersByWilayah);
router.get("/wilayahs", getAllWilayah);
router.get("/wilayah-stats", authenticate, getWilayahStats);
router.get("/wilayah-stats/sorted", authenticate, checkAdminRole, getSortedWilayahStats);
router.get('/wilayah/:id_wilayah/cluster-stats', authenticate, checkAdminParokiRole, getClusterStatsByWilayah);
router.get('/wilayah/:id_wilayah/detection-result', authenticate, checkAdminWilayahRole, getDetectionResultsByWilayah);
router.post("/users", createUser);
router.patch("/users/:id_user", updateUser);
router.delete("/users/:id_user", deleteUser);

export default router;