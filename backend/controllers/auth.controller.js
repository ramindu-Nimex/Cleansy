import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { getLogger } from "../utils/logHandler/contextLogger.js";

const JWT_ISSUER = process.env.JWT_ISSUER || 'cleansy-api';
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || 'cleansy-client';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '2h';
const COOKIE_SAMESITE = (process.env.COOKIE_SAMESITE || 'lax').toLowerCase();
const COOKIE_SECURE = process.env.NODE_ENV !== 'development';
const COOKIE_MAX_AGE_MS = parseInt(process.env.JWT_MAX_AGE_MS || '7200000', 10); // 2h

function issueToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      expiresIn: JWT_EXPIRES
    }
  );
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE === 'none' ? 'none' : COOKIE_SAMESITE,
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/'
  };
}

// sign up API
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const log = getLogger({ route: 'auth.signup' });

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    log.warn({ email }, 'signup rejected: missing fields');
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    log.info({ userId: newUser._id, email }, 'signup success');
    res.json("User Signup successfully");
  } catch (error) {
    log.error({ err: error }, 'signup error');
    next(error);
  }
};

// sign in API
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const log = getLogger({ route: 'auth.signin' });

  if (!email || !password || email === "" || password === "") {
    log.warn({ email }, 'signin rejected: missing fields');
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      log.warn({ email }, 'signin failed: user not found');
      return next(errorHandler(400, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      log.warn({ userId: validUser._id, email }, 'signin failed: invalid password');
      return next(errorHandler(400, "Invalid password"));
    }

    const token = issueToken({
      id: validUser._id,
      Username: validUser.username,
      isAdmin: validUser.isAdmin,
      isUserAdmin: validUser.isUserAdmin,
      isPropertyAdmin: validUser.isPropertyAdmin,
      isVisitorAdmin: validUser.isVisitorAdmin,
      isAnnouncementAdmin: validUser.isAnnouncementAdmin,
      isBookingAdmin: validUser.isBookingAdmin,
      isStaffAdmin: validUser.isStaffAdmin,
      isBillingAdmin: validUser.isBillingAdmin,
      isFacilityAdmin: validUser.isFacilityAdmin,
      isFacilityServiceAdmin: validUser.isFacilityServiceAdmin,
      isStaff: validUser.isStaff,
    });

    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, cookieOptions())
      .json(rest);
    log.info({ userId: validUser._id, email }, 'signin success');
  } catch (error) {
    log.error({ err: error }, 'signin error');
    next(error);
  }
};

// google sign in API
export const google = async (req, res, next) => {
   const { email, name, googlePhotoURL } = req.body;
   try {
      const user = await User.findOne({ email });
      if(user) {
         const token = issueToken({ id: user._id, Username:user.username,isAdmin: user.isAdmin, isUserAdmin: user.isUserAdmin, isPropertyAdmin: user.isPropertyAdmin, isVisitorAdmin: user.isVisitorAdmin, isAnnouncementAdmin: user.isAnnouncementAdmin, isBookingAdmin: user.isBookingAdmin, isStaffAdmin: user.isStaffAdmin, isBillingAdmin: user.isBillingAdmin, isFacilityAdmin: user.isFacilityAdmin, isFacilityServiceAdmin: user.isFacilityServiceAdmin });
         const { password, ...rest } = user._doc;
         res.status(200).cookie('access_token', token, cookieOptions()).json(rest);
         log.info({ userId: user._id, email: verifiedEmail }, 'google signin success');
      } else {
         const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
         const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
         const newUser = new User({
            username: (displayName || 'user').toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
            email: verifiedEmail,
            password: hashedPassword,
            profilePicture: picture,
         });
         await newUser.save();
         const token = issueToken({ id: newUser._id, Username:newUser.username,isAdmin: newUser.isAdmin, isUserAdmin: newUser.isUserAdmin, isPropertyAdmin: newUser.isPropertyAdmin, isVisitorAdmin: newUser.isVisitorAdmin, isAnnouncementAdmin: newUser.isAnnouncementAdmin, isBookingAdmin: newUser.isBookingAdmin, isStaffAdmin: newUser.isStaffAdmin, isBillingAdmin: newUser.isBillingAdmin, isFacilityAdmin: newUser.isFacilityAdmin, isFacilityServiceAdmin: newUser.isFacilityServiceAdmin });
         const { password, ...rest } = newUser._doc;
         res.status(200).cookie('access_token', token, cookieOptions()).json(rest);
         log.info({ userId: newUser._id, email: verifiedEmail }, 'google signup+signin success');
      }
   } catch (error) {
      getLogger({ route: 'auth.google' }).error({ err: error }, 'google auth error');
      next(error);
   }
}


export const signInQR = async (req, res, next) => {
   const { email } = req.body;
   const log = getLogger({ route: 'auth.signinQR' });
   try {
      const user = await User.findOne({ email });
      if (!user) {
        log.warn({ email }, 'QR signin failed: user not found');
        return next(errorHandler(400, 'User not found'));
      }

      
      const token = issueToken({ id: user._id, Username:user.username,isAdmin: user.isAdmin, isUserAdmin: user.isUserAdmin, isPropertyAdmin: user.isPropertyAdmin, isVisitorAdmin: user.isVisitorAdmin, isAnnouncementAdmin: user.isAnnouncementAdmin, isBookingAdmin: user.isBookingAdmin, isStaffAdmin: user.isStaffAdmin, isBillingAdmin: user.isBillingAdmin, isFacilityAdmin: user.isFacilityAdmin, isFacilityServiceAdmin: user.isFacilityServiceAdmin });
      const { password, ...rest } = user._doc;
      res.status(200).cookie('access_token', token, cookieOptions()).json(rest);
      log.info({ userId: user._id, email }, 'QR signin success');
   } catch (error) {
      log.error({ err: error }, 'QR signin error');
      next(error);
   }
}
