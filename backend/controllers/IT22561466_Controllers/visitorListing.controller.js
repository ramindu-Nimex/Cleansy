import visitorListing from "../../models/IT22561466_Models/visitorListing.model.js";
import { errorHandler } from "../../utils/error.js";

export const createvisitorListing = async (req, res, next) => {
  try {
    const payload = { ...req.body, userRef: req.user.id };
    const newVisitorListing = await visitorListing.create(payload);
    return res.status(201).json({
      success: true,
      message: "Visitor listing created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getVisitorListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const visitorListings = await visitorListing.find({
        userRef: req.params.id,
      });
      res.status(200).json(visitorListings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own lists!"));
  }
};

export const deletevisitorListing = async (req, res, next) => {
  const listing = await visitorListing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Guest not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    await visitorListing.findByIdAndDelete(req.params.id);
    res.status(200).json("Guest has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updatevisitorListing = async (req, res, next) => {
  const listing = await visitorListing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Guest not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }
  try {
    const updatedListing = await visitorListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getvisitorListing = async (req, res, next) => {
  try {
    const listing = await visitorListing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Guest not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// Function to get all visitor listings
export const getAllVisitorListings = async (req, res) => {
    try {
        const allVisitorListings = await visitorListing.find();
        res.status(200).json(allVisitorListings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getvisitors = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const searchTerm = req.query.searchTerm || '';
        const visitors = await visitorListing.find({ guestName: { $regex: searchTerm, $options: 'i' } }).skip(startIndex);
        return res.status(200).json(visitors);
    } catch (error) {
        next(error);
    }
};
