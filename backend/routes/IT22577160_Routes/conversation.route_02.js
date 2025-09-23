import express from 'express';
import { createNewConversation, getAdminConversation, updateLastMessage } from '../../controllers/IT22577160_Controllers/conversation.controller_02.js';
import { verifyToken } from '../../utils/verifyUser.js';

const router = express.Router();

router.post("/createNewConversation", verifyToken, createNewConversation);
router.get("/getAdminConversation/:id", verifyToken, getAdminConversation);
router.put("/updateLastMessage/:id", verifyToken, updateLastMessage)

export default router;
