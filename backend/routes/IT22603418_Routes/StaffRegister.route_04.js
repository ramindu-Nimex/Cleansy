import express from "express";
import {
  registerStaff,
  getAllStaffRegisterRequests,
  acceptStaffRegisterRequest,
  denyStaffRegisterRequest,
} from "../../controllers/IT22603418_Controllers/StaffRegister.controller_04.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();
//Create Register
router.post("/register", verifyToken, registerStaff);

//Get All Staff Register
router.get("/getAll", verifyToken, getAllStaffRegisterRequests);

// Route to approve a staff register request (admin/staff-admin only)
router.put("/:requestId/approve", verifyToken, acceptStaffRegisterRequest);

// Route to deny a staff register request (admin/staff-admin only)
router.put("/:requestId/reject", verifyToken, denyStaffRegisterRequest);

export default router;
