import StaffRegister from "../../models/IT22603418_Models/StaffRegister.model_04.js";
import User from "../../models/user.model.js";
import { errorHandler } from "../../utils/error.js";

// Controller to handle staff registration
export const registerStaff = async (req, res, next) => {
  try {
    // Extract data from the request body
    const { staffID, staffName, email, phoneNo, nic, imageURL, status } =
      req.body;

    // Validate if all required fields are present
    if (!staffID || !staffName || !email || !phoneNo || !nic || !imageURL) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Check if a staff with the given staffID or NIC already exists
    const existingStaff = await StaffRegister.findOne({
      $or: [{ staffID }, { nic }],
    });

    // If a staff with the same staffID or NIC already exists, return an error
    if (existingStaff) {
      return res
        .status(400)
        .json({ error: "Staff with the same staffID or NIC already exists" });
    }

    // Create a new staff registration entry
    const newStaff = await StaffRegister.create({
      staffID,
      staffName,
      email,
      phoneNo,
      nic,
      imageURL,
      status: status || "pending review", // Use default value if status is not provided
    });

    // If status is "approved", update the corresponding user's role to "staff"
    if (status === "approved") {
      await User.findOneAndUpdate(
        { username: staffID }, // Assuming username is staffID
        { isStaff: true }
      );
    }

    return res.status(201).json(newStaff);
  } catch (error) {
    console.error("Error registering staff:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get all Staff Register requests
export const getAllStaffRegisterRequests = async (req, res, next) => {
  try {
    // Only admins or staff-admins can view all staff register requests
    if (!req.user?.isAdmin && !req.user?.isStaffAdmin) {
      return next(errorHandler(403, "You are not allowed to view staff register requests"));
    }
    // Fetch all Staff Register requests from the database
    const AllStaffRegisterRequests = await StaffRegister.find();

    // Check if any Staff Register requests were found
    if (!AllStaffRegisterRequests || AllStaffRegisterRequests.length === 0) {
      return next(errorHandler(404, "No Staff Register requests found"));
    }

    // If Staff Register requests are found, return them
    return res.status(200).json(AllStaffRegisterRequests);
  } catch (error) {
    // If an error occurs during the process, pass it to the error handling middleware
    next(error);
  }
};

// Accept Staff Register Request
export const acceptStaffRegisterRequest = async (req, res, next) => {
  const requestId = req.params.requestId;

  try {
    if (!req.user?.isAdmin && !req.user?.isStaffAdmin) {
      return next(errorHandler(403, "You are not allowed to approve staff registration"));
    }
    // Find the Staff Register request by ID and update its status to "accepted" in the database
    const updatedStaffRegisterRequest = await StaffRegister.findOneAndUpdate(
      { staffID: requestId },
      { status: "approved" },
      { new: true }
    );

    if (!updatedStaffRegisterRequest) {
      return next(errorHandler(404, "Staff Register request not found"));
    }

    // If the request was successfully updated, send a success response
    res.status(200).json({
      success: true,
      message: "Staff Registered successfully",
      data: updatedStaffRegisterRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Deny Staff Register Request
export const denyStaffRegisterRequest = async (req, res, next) => {
  const requestId = req.params.requestId;
  try {
    if (!req.user?.isAdmin && !req.user?.isStaffAdmin) {
      return next(errorHandler(403, "You are not allowed to deny staff registration"));
    }
    // Find the Staff Register request by ID and update its status to "denied" in the database
    const updatedStaffRegisterRequest = await StaffRegister.findOneAndUpdate(
      { staffID: requestId },
      { status: "rejected" },
      { new: true }
    );

    if (!updatedStaffRegisterRequest) {
      return next(errorHandler(404, "Staff Register request not found"));
    }

    // If the request was successfully updated, send a success response
    res.status(200).json({
      success: true,
      message: "Staff Register denied",
      data: updatedStaffRegisterRequest,
    });
  } catch (error) {
    next(error);
  }
};
