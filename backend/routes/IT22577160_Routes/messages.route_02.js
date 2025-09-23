import express from 'express';
import { createNewMessage, getAllMessages } from '../../controllers/IT22577160_Controllers/messages.controller_02.js';
import { verifyToken } from '../../utils/verifyUser.js';

const router = express.Router();

router.post("/createNewMessage", verifyToken, createNewMessage);
router.get("/getAllMessages/:id", verifyToken, getAllMessages);

export default router;
