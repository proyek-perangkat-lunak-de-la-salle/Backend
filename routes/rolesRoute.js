import express from 'express';
import { authorize } from '../middleware/authorize.js';
import { authenticate } from '../middleware/authenticate.js'; 

const router = express.Router();

router.get("/protected-route", authenticate, authorize('Admin Wilayah', 'Admin Paroki', "Pengguna Umum"), (req, res) => {
    const response = {
        user: {
            id_user: req.user.id_user,
            username: req.user.username,
            role: req.user.role
        }
    };

    res.status(200).json(response);
});

export default router;