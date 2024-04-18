import ServiceBooking from "../../models/IT22350114_Models/serviceBookingModel.js";

export const createServiceBooking = async (req, res, next) => {
  try {
    // Create a new service listing using the data from the request body
    const newServiceBooking = await ServiceBooking.create(req.body);

    // Send a success response with the newly created service booking
    return res.status(201).json({
      success: true,
      message: "Service booking created successfully",
      serviceBooking: newServiceBooking,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};

//Read for all service listings
export const getAllServiceBookings = async (req, res, next) => {
  try {
    const allServiceBookings = await ServiceBooking.find();
    return res.status(200).json(allServiceBookings);
  } catch (error) {
    next(error);
  }
};

//Fetch a specific service listing
export const getServiceBookingById = async (req, res, next) => {
  try {
    const { BookingId } = req.params;
    const serviceBooking = await ServiceBooking.findById(BookingId);
    if (!serviceBooking) {
      return res.status(404).json({ message: "Service booking not found" });
    }
    return res.status(200).json(serviceBooking);
  } catch (error) {
    next(error);
  }
};

//Update a service listing
export const updateServiceBooking = async (req, res, next) => {
  try {
    const { BookingId } = req.params;
    const updateServiceBooking = await ServiceBooking.findByIdAndUpdate(
      BookingId,
      req.body,
      { new: true, upsert: true }
    );
    return res.status(200).json(updateServiceBooking);
  } catch (error) {
    next(error);
  }
};

//Delete a service listing
export const deleteServiceBooking = async (req, res, next) => {
  try {
    const { BookingId } = req.params;
    const deleteServiceBooking = await ServiceBooking.findByIdAndDelete(
      BookingId
    );
    return res.status(200).json(deleteServiceBooking);
  } catch (error) {
    next(error);
  }
};