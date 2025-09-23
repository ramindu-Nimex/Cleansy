import express from 'express';
import { checkout } from '../../controllers/IT22577160_Controllers/checkout.controller_02.js';
import { verifyToken } from '../../utils/verifyUser.js';

const router = express.Router();

router.post('/creteCheckout', verifyToken, checkout);

export default router;
