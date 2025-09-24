import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import sanitizeHtml from "sanitize-html";
import validator from "validator";

// Test API
export const test = (req, res) => {
  res.send("Test API");
};

// Update user API
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  // Password handling
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  // Username sanitization and validation
  if (req.body.username) {
    const cleanUsername = sanitizeHtml(req.body.username, {
      allowedTags: [],
      allowedAttributes: {}
    });
    req.body.username = cleanUsername;

    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(errorHandler(400, "Username must be between 7 to 20 characters"));
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be in lowercase"));
    }
    if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
      return next(errorHandler(400, "Username must contain only letters and numbers"));
    }
  }

  // Profile picture URL validation
  if (req.body.profilePicture) {
    if (!validator.isURL(req.body.profilePicture, { protocols: ["http", "https"], require_protocol: true })) {
      return next(errorHandler(400, "Profile picture URL must be a valid http/https URL"));
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete user API
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

// Signout API
export const signout = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

// Admin get users
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to get all users"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map(user => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });
  } catch (error) {
    next(error);
  }
};

// Get user details
export const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Approve staff
export const approveAsStaff = async (req, res) => {
  const _id = req.params.staffID;
  try {
    const updatedUser = await User.findByIdAndUpdate(_id, { isStaff: true }, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: "Staff not found" });
    res.status(200).json({ success: true, message: "Staff added successfully", data: updatedUser });
  } catch (error) {
    console.error("Error approving staff:", error);
    res.status(500).json({ success: false, message: "An error occurred while approving staff" });
  }
};

// Reject staff
export const rejectAsStaff = async (req, res) => {
  const _id = req.params.staffID;
  try {
    const updatedUser = await User.findByIdAndUpdate(_id, { isStaff: false }, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: "Staff not found" });
    res.status(200).json({ success: true, message: "Staff rejected", data: updatedUser });
  } catch (error) {
    console.error("Error rejecting staff:", error);
    res.status(500).json({ success: false, message: "An error occurred while rejecting staff" });
  }
};
