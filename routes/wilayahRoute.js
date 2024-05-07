import express from "express";
import {
  getWilayah,
  getWilayahById,
  createWilayah,
  updateWilayah,
  deleteWilayah,
} from "../controllers/wilayahController.js";

const router = express.Router();

/**
 * @api {get} /wilayah Request All Wilayah
 * @apiName GetWilayah
 * @apiGroup Wilayah
 */
router.get("/wilayah", getWilayah);

/**
 * @api {get} /wilayah/:id_wilayah Request Wilayah information
 * @apiName GetWilayahById
 * @apiGroup Wilayah
 *
 * @apiParam {Number} id_wilayah Wilayah's unique ID.
 */
router.get("/wilayah/:id_wilayah", getWilayahById);

/**
 * @api {post} /wilayah Create a new Wilayah
 * @apiName CreateWilayah
 * @apiGroup Wilayah
 */
router.post("/wilayah", createWilayah);

/**
 * @api {patch} /wilayah/:id_wilayah Update Wilayah information
 * @apiName UpdateWilayah
 * @apiGroup Wilayah
 *
 * @apiParam {Number} id_wilayah Wilayah's unique ID.
 */
router.patch("/wilayah/:id_wilayah", updateWilayah);

/**
 * @api {delete} /wilayah/:id_wilayah Delete a Wilayah
 * @apiName DeleteWilayah
 * @apiGroup Wilayah
 *
 * @apiParam {Number} id_wilayah Wilayah's unique ID.
 */
router.delete("/wilayah/:id_wilayah", deleteWilayah);

export default router;