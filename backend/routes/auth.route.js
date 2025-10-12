import express from 'express';
import { google, signIn, signup,signupVulnerable, signInQR, googleVuln } from '../controllers/auth.controller.js';

const router = express.Router();

//router.post('/signup', signupVulnerable);
router.post('/signup', signup);
router.post('/signin', signIn)
router.post('/google', google)
router.post('/signinQR', signInQR)
router.post('/googleVuln', googleVuln)

export default router;