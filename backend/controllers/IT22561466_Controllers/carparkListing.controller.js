import carparkListing from "../../models/IT22561466_Models/carparkListing.model.js";
import { errorHandler } from "../../utils/error.js";

export const createcarparkListing = async (req, res, next) => {
    try {
        // Ensure the authenticated user is recorded as the owner
        const payload = { ...req.body, userRef: req.user.id };
        const newCarparkListing = await carparkListing.create(payload);

        const savedCarparkListingId = newCarparkListing._id;

        return res.status(201).json({
            success: true,
            message: "Carpark listing created successfully",
            carparkListingId: savedCarparkListingId 
        });
        
    } catch (error) {
        next(error);
    }
};



export const updatecarparkListing = async (req, res, next) => {
    try {
        const { carparkListingId, slotId } = req.body;

        if (!carparkListingId) {
            return res.status(400).json({
                success: false,
                message: "Carpark Listing ID is required for updating.",
            });
        }

        const existingCarparkListing = await carparkListing.findById(carparkListingId);

        if (!existingCarparkListing) {
            return res.status(404).json({
                success: false,
                message: "Carpark Listing not found.",
            });
        }

        // Only the owner can update their listing
        if (existingCarparkListing.userRef?.toString() !== req.user.id) {
            return next(errorHandler(403, "You are not allowed to update this listing"));
        }

        existingCarparkListing.slotId = slotId;

        await existingCarparkListing.save();

        return res.status(200).json({
            success: true,
            message: "Carpark listing updated successfully",
            updatedCarparkListing: existingCarparkListing,
        });
    } catch (error) {
        next(error);
    }
};

export const getCarparkListings = async(req, res, next) => {
    try {
        const listing = await carparkListing.findById(req.params.id); 
        if (!listing) {
            return next(errorHandler(404, 'Details not found!'));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

export const getAllBooked = async (req, res, next) => {
    try {
        const allCarparkListings = await carparkListing.find();

        const bookedSlots = allCarparkListings.map(listing => listing.slotId);

        return res.status(200).json({
            success: true,
            bookedSlots: bookedSlots
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCarparkListings = async (req, res) => {
    try {
        const allCarparkListings = await carparkListing.find();
        res.status(200).json(allCarparkListings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletecarparkListing = async (req, res, next) => {
    const listing = await carparkListing.findById(req.params.id);

    if(!listing) {
        return next(errorHandler(404, 'Carpark details not found!'));
    }
    if(req.user.id !== listing.userRef) {
        return next(errorHandler(401,'You can only update your own listings!'));
    }

    try {
        await carparkListing.findByIdAndDelete(req.params.id);
        res.status(200).json('car park details has been deleted!');
    } catch (error) {
        next(error) }
};
