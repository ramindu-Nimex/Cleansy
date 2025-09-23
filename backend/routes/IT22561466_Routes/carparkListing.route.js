import express from 'express';
import { createcarparkListing , updatecarparkListing , getAllBooked, getCarparkListings, getAllCarparkListings, deletecarparkListing } from '../../controllers/IT22561466_Controllers/carparkListing.controller.js';
import { verifyToken } from '../../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createcarparkListing);
router.put('/updateSlotID', verifyToken, updatecarparkListing);
router.get('/getAllboked',  getAllBooked);
router.get('/get/:id', getCarparkListings);
router.get('/getAll', getAllCarparkListings);
router.delete('/delete/:id',verifyToken, deletecarparkListing);

export default router;
