import express from "express";
import {
  deleteUser,
  getUserDetails,
  getUsers,
  signout,
  test,
  updateUser,
  approveAsStaff,
  rejectAsStaff,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { getVisitorListings } from "../controllers/IT22561466_Controllers/visitorListing.controller.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", verifyToken, signout);
router.get("/getusers", verifyToken, getUsers);
router.get("/:id", verifyToken, getUserDetails);
router.get("/visitorListings/:id", verifyToken, getVisitorListings);
router.put("/:staffID/makeStaff", verifyToken, approveAsStaff);
router.put("/:staffID/removeStaff", verifyToken, rejectAsStaff);

export default router;
