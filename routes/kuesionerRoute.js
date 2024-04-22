import express from "express";
import {
  createKuesioner,
  getKuesioner,
  getKuesionerById,
  updateKuesioner,
  deleteKuesioner,
} from "../controllers/kuesionerController.js";

const router = express.Router();

router.get("/kuesioners", getKuesioner);
router.get("/kuesioners/:id_kuesioner", getKuesionerById);
router.post("/kuesioners", createKuesioner);
router.patch("/kuesioners/:id_kuesioner", updateKuesioner);
router.delete("/kuesioners/:id_kuesioner", deleteKuesioner);

export default router;