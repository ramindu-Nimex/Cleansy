import express from 'express';
import {PaymentProfile} from '../../controllers/IT22602978_Controllers/PaymentProfileCreation.controller_03.js';
import { verifyToken } from '../../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken,PaymentProfile);

export default router;