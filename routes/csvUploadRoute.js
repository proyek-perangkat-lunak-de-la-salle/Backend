import express from 'express';
import multer from 'multer';
import { uploadCsv } from '../controllers/csvUploadController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * @api {post} /upload-csv Upload a CSV file
 * @apiName UploadCsv
 * @apiGroup CSV
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiParam {File} file CSV file to upload.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object[]} data Processed data from the CSV file.
 *
 * @apiError {String} 400 No file uploaded.
 * @apiError {String} 403 Unauthorized.
 * @apiError {String} 500 An error occurred on the server.
 */
router.post('/upload-csv', upload.single('file'), authenticate, uploadCsv);

export default router;