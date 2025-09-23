import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.send("Test API");
};

// update user API
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 to 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain any spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be in lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username must contain only letters and numbers")
      );
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

// delete user API
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

// signout user API
export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

// admin getUsers API
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to get all users"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort || "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res
      .status(200)
      .json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });
  } catch (error) {
    next(error);
  }
};

// get user details
export const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    // Allow only the owner or admins to view detailed user info
    const isSelf = req.user?.id === req.params.id;
    const isAdmin = req.user?.isAdmin || req.user?.isUserAdmin;
    if (!isSelf && !isAdmin) {
      return next(errorHandler(403, "You are not allowed to view this user"));
    }
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Accept Staff
export const approveAsStaff = async (req, res, next) => {
  const _id = req.params.staffID;

  try {
    // Only admins or staff admins can approve staff
    if (!req.user?.isAdmin && !req.user?.isStaffAdmin) {
      return next(errorHandler(403, "You are not allowed to approve staff"));
    }
    // Find the Staff Register request by ID and update its status to "accepted" in the database
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { isStaff: true },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "Staff not found"));
    }

    // If the request was successfully updated, send a success response
    res.status(200).json({
      success: true,
      message: "Staff Added successfully",
      data: updatedUser,
    });
  } catch (error) {
    // If an error occurs during the update process, send an error to handler
    next(error);
  }
};

// Deny Staff
export const rejectAsStaff = async (req, res, next) => {
  const _id = req.params.staffID;

  try {
    // Only admins or staff admins can reject staff
    if (!req.user?.isAdmin && !req.user?.isStaffAdmin) {
      return next(errorHandler(403, "You are not allowed to reject staff"));
    }
    // Find the Staff Register request by ID and update its status to "denied" in the database
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { isStaff: false },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "Staff not found"));
    }

    // If the request was successfully updated, send a success response
    res.status(200).json({
      success: true,
      message: "Staff Rejected",
      data: updatedUser,
    });
  } catch (error) {
    // If an error occurs during the update process, send an error to handler
    next(error);
  }
};
