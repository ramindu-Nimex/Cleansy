import express from 'express';
import { createvisitorListing, deletevisitorListing, updatevisitorListing, getvisitorListing, getAllVisitorListings, getvisitors } from '../../controllers/IT22561466_Controllers/visitorListing.controller.js';
import { verifyToken } from '../../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createvisitorListing);
router.delete('/delete/:id', verifyToken, deletevisitorListing);
router.post('/update/:id', verifyToken, updatevisitorListing);
router.get('/get/:id', getvisitorListing);
router.get('/getAll', getAllVisitorListings);
router.get('/get', getvisitors);

export default router;
