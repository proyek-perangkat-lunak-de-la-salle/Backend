import express from "express";
import {
  createKuesioner,
  getKuesioner,
  getKuesionerById,
  updateKuesioner,
  deleteKuesioner,
  getHistoryByUserId,
} from "../controllers/kuesionerController.js";

const router = express.Router();

/**
 * @api {get} /kuesioners Request All Kuesioners
 * @apiName GetKuesioners
 * @apiGroup Kuesioner
 */
router.get("/kuesioners", getKuesioner);

/**
 * @api {get} /kuesioners/:id_kuesioner Request Kuesioner information
 * @apiName GetKuesioner
 * @apiGroup Kuesioner
 *
 * @apiParam {Number} id_kuesioner Kuesioner's unique ID.
 */
router.get("/kuesioners/:id_kuesioner", getKuesionerById);

/**
 * @api {get} /history/:id_user Request User's Kuesioner History
 * @apiName GetHistory
 * @apiGroup Kuesioner
 *
 * @apiParam {Number} id_user User's unique ID.
 */
router.get("/history/:id_user", getHistoryByUserId);

/**
 * @api {post} /kuesioners Create a new Kuesioner
 * @apiName CreateKuesioner
 * @apiGroup Kuesioner
 */
router.post("/kuesioners", createKuesioner);

/**
 * @api {patch} /kuesioners/:id_kuesioner Update Kuesioner information
 * @apiName UpdateKuesioner
 * @apiGroup Kuesioner
 *
 * @apiParam {Number} id_kuesioner Kuesioner's unique ID.
 */
router.patch("/kuesioners/:id_kuesioner", updateKuesioner);

/**
 * @api {delete} /kuesioners/:id_kuesioner Delete a Kuesioner
 * @apiName DeleteKuesioner
 * @apiGroup Kuesioner
 *
 * @apiParam {Number} id_kuesioner Kuesioner's unique ID.
 */
router.delete("/kuesioners/:id_kuesioner", deleteKuesioner);

export default router;