import express from "express";
import {
  getWilayah,
  getWilayahById,
  createWilayah,
  updateWilayah,
  deleteWilayah,
} from "../controllers/wilayahController.js";

const router = express.Router();

router.get("/wilayah", getWilayah);
router.get("/wilayah/:id_wilayah", getWilayahById);
router.post("/wilayah", createWilayah);
router.patch("/wilayah/:id_wilayah", updateWilayah);
router.delete("/wilayah/:id_wilayah", deleteWilayah);

export default router;
